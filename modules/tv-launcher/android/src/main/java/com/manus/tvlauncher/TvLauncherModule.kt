package com.manus.tvlauncher

import android.app.ActivityManager
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.Drawable
import android.os.Build
import android.provider.Settings
import android.util.Base64
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.ByteArrayOutputStream

class TvLauncherModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("TvLauncher")

    AsyncFunction("getInstalledApps") {
      val context = requireNotNull(appContext.reactContext)
      val packageManager = context.packageManager
      val results = linkedMapOf<String, Map<String, Any?>>()
      val categories = listOf(
        Intent.CATEGORY_LEANBACK_LAUNCHER,
        Intent.CATEGORY_LAUNCHER
      )

      categories.forEach { category ->
        val query = Intent(Intent.ACTION_MAIN).addCategory(category)
        queryActivities(packageManager, query).forEach { resolveInfo ->
          val activityInfo = resolveInfo.activityInfo ?: return@forEach
          val packageName = activityInfo.packageName ?: return@forEach
          if (packageName == context.packageName || results.containsKey(packageName)) return@forEach

          val appInfo = activityInfo.applicationInfo ?: return@forEach
          val label = resolveInfo.loadLabel(packageManager)?.toString()
            ?: appInfo.loadLabel(packageManager)?.toString()
            ?: packageName
          val icon = runCatching { resolveInfo.loadIcon(packageManager) }.getOrNull()
          results[packageName] = mapOf(
            "id" to "android:$packageName",
            "packageName" to packageName,
            "label" to label,
            "iconDataUrl" to icon?.let(::drawableToDataUrl)
          )
        }
      }

      results.values.sortedBy { (it["label"] as? String)?.lowercase() ?: "" }
    }

    AsyncFunction("launchApp") { appId: String ->
      val context = requireNotNull(appContext.reactContext)
      val candidates = when (appId) {
        "youtube" -> listOf("com.google.android.youtube.tv", "com.google.android.youtube")
        "google-play" -> listOf("com.android.vending")
        else -> listOf(appId.removePrefix("android:"))
      }
      val packageManager = context.packageManager
      val launchIntent = candidates.asSequence().mapNotNull { packageName ->
        runCatching {
          packageManager.getLeanbackLaunchIntentForPackage(packageName)
            ?: packageManager.getLaunchIntentForPackage(packageName)
        }.getOrNull()
      }.firstOrNull()

      if (launchIntent == null) return@AsyncFunction false
      runCatching {
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(launchIntent)
        true
      }.getOrDefault(false)
    }

    Function("openWifiSettings") {
      openSettings(Intent(Settings.ACTION_WIFI_SETTINGS))
    }

    Function("openBluetoothSettings") {
      openSettings(Intent(Settings.ACTION_BLUETOOTH_SETTINGS))
    }

    Function("openAppMemorySettings") {
      openSettings(Intent(Settings.ACTION_MANAGE_APPLICATIONS_SETTINGS))
    }

    Function("getDeviceMemory") {
      val context = requireNotNull(appContext.reactContext)
      val manager = context.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
      val info = ActivityManager.MemoryInfo()
      manager.getMemoryInfo(info)
      val total = info.totalMem
      val available = info.availMem
      mapOf(
        "totalBytes" to total,
        "availableBytes" to available,
        "usedBytes" to (total - available).coerceAtLeast(0L),
        "lowMemory" to info.lowMemory
      )
    }
  }

  private fun queryActivities(packageManager: PackageManager, intent: Intent) =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
      packageManager.queryIntentActivities(
        intent,
        PackageManager.ResolveInfoFlags.of(PackageManager.MATCH_ALL.toLong())
      )
    } else {
      @Suppress("DEPRECATION")
      packageManager.queryIntentActivities(intent, PackageManager.MATCH_ALL)
    }

  private fun openSettings(intent: Intent): Boolean {
    val context = appContext.reactContext ?: return false
    return runCatching {
      intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      context.startActivity(intent)
      true
    }.getOrDefault(false)
  }

  private fun drawableToDataUrl(drawable: Drawable): String? = runCatching {
    val size = 72
    val bitmap = Bitmap.createBitmap(size, size, Bitmap.Config.ARGB_8888)
    val canvas = Canvas(bitmap)
    drawable.setBounds(0, 0, size, size)
    drawable.draw(canvas)
    val output = ByteArrayOutputStream()
    bitmap.compress(Bitmap.CompressFormat.PNG, 90, output)
    bitmap.recycle()
    "data:image/png;base64," + Base64.encodeToString(output.toByteArray(), Base64.NO_WRAP)
  }.getOrNull()
}
