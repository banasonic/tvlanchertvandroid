const { withAndroidManifest, withDangerousMod, withMainActivity } = require("expo/config-plugins");
const fs = require("node:fs");
const path = require("node:path");

function ensureArray(target, key) {
  if (!target[key]) target[key] = [];
  return target[key];
}

function hasFeature(features, name) {
  return features.some((item) => item.$?.["android:name"] === name);
}

function withAndroidTV(config) {
  config = withAndroidManifest(config, (mod) => {
    const manifest = mod.modResults.manifest;
    const features = ensureArray(manifest, "uses-feature");
    if (!hasFeature(features, "android.software.leanback")) {
      features.push({ $: { "android:name": "android.software.leanback", "android:required": "false" } });
    }
    if (!hasFeature(features, "android.hardware.touchscreen")) {
      features.push({ $: { "android:name": "android.hardware.touchscreen", "android:required": "false" } });
    }

    const queries = (manifest.queries = manifest.queries || [{}])[0];
    const queryIntents = ensureArray(queries, "intent");
    for (const category of ["android.intent.category.LEANBACK_LAUNCHER", "android.intent.category.LAUNCHER"]) {
      const exists = queryIntents.some((query) =>
        query.action?.some((action) => action.$?.["android:name"] === "android.intent.action.MAIN") &&
        query.category?.some((item) => item.$?.["android:name"] === category),
      );
      if (!exists) {
        queryIntents.push({
          action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
          category: [{ $: { "android:name": category } }],
        });
      }
    }

    const application = manifest.application?.[0];
    if (!application) throw new Error("Android TV plugin: application element was not found");
    application.$["android:banner"] = "@drawable/tv_launcher_banner";
    const activities = ensureArray(application, "activity");
    const mainActivity = activities.find((activity) =>
      /\.MainActivity$/.test(activity.$?.["android:name"] || ""),
    );
    if (!mainActivity) throw new Error("Android TV plugin: Expo MainActivity was not found");
    mainActivity.$["android:screenOrientation"] = "landscape";
    const filters = ensureArray(mainActivity, "intent-filter");
    const launcherFilters = [
      ["android.intent.category.LEANBACK_LAUNCHER"],
      ["android.intent.category.HOME", "android.intent.category.DEFAULT"],
    ];
    for (const categories of launcherFilters) {
      const exists = filters.some((filter) =>
        filter.action?.some((action) => action.$?.["android:name"] === "android.intent.action.MAIN") &&
        categories.every((category) =>
          filter.category?.some((item) => item.$?.["android:name"] === category),
        ),
      );
      if (!exists) {
        filters.push({
          action: [{ $: { "android:name": "android.intent.action.MAIN" } }],
          category: categories.map((category) => ({ $: { "android:name": category } })),
        });
      }
    }
    return mod;
  });

  config = withMainActivity(config, (mod) => {
    let { contents } = mod.modResults;
    const marker = "// ANDROID_TV_IMMERSIVE_FLAGS";
    if (contents.includes(marker) || !contents.includes("class MainActivity")) return mod;

    const onCreateCall = ["super.onCreate(null)", "super.onCreate(savedInstanceState)"].find((value) => contents.includes(value));
    if (!onCreateCall) return mod;
    if (!contents.includes("import android.view.View")) {
      contents = contents.replace(/^(package [^\n]+\n)/m, "$1\nimport android.view.View\n");
    }
    const immersive = `${onCreateCall}\n    ${marker}\n    hideSystemBarsForTV()`;
    contents = contents.replace(onCreateCall, immersive);
    const classEnd = contents.lastIndexOf("}");
    if (classEnd !== -1) {
      const helper = `\n\n  private fun hideSystemBarsForTV() {\n    window.decorView.systemUiVisibility = (\n      View.SYSTEM_UI_FLAG_FULLSCREEN or\n        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or\n        View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or\n        View.SYSTEM_UI_FLAG_LAYOUT_STABLE or\n        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or\n        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN\n    )\n  }\n\n  override fun onWindowFocusChanged(hasFocus: Boolean) {\n    super.onWindowFocusChanged(hasFocus)\n    if (hasFocus) hideSystemBarsForTV()\n  }\n`;
      contents = `${contents.slice(0, classEnd)}${helper}${contents.slice(classEnd)}`;
    }
    mod.modResults.contents = contents;
    return mod;
  });

  config = withDangerousMod(config, ["android", async (mod) => {
    const projectRoot = mod.modRequest.projectRoot;
    const preferredBanner = path.join(projectRoot, "assets/images/tv-launcher-banner.png");
    const source = fs.existsSync(preferredBanner)
      ? preferredBanner
      : path.join(projectRoot, "assets/images/icon.png");
    if (!fs.existsSync(source)) throw new Error(`Android TV banner source is missing: ${source}`);
    const drawable = path.join(projectRoot, "android/app/src/main/res/drawable-xhdpi");
    fs.mkdirSync(drawable, { recursive: true });
    fs.copyFileSync(source, path.join(drawable, "tv_launcher_banner.png"));
    return mod;
  }]);

  return config;
}

module.exports = withAndroidTV;
