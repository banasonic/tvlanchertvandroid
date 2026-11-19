import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { RefObject } from "react";
import type { WebView, WebViewMessageEvent } from "react-native-webview";

import TvLauncher from "@/modules/tv-launcher";
import type { DeviceMemory, NativeTVApp } from "@/modules/tv-launcher";

const PRAYER_IDS_KEY = "tv-launcher.prayer-notification-ids.v1";
const CHIME_CHANNEL = "prayer-reminders-chime-v1";
const DEFAULT_CHANNEL = "prayer-reminders-default-v1";

if (Platform.OS === "android") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export type PrayerEventInput = {
  triggerAt: number;
  title: string;
  body: string;
};

type WebCommand = {
  type?: string;
  action?: string;
  appId?: string;
  soundMode?: string;
  events?: PrayerEventInput[];
};

function postToWebView(webViewRef: RefObject<WebView | null>, payload: Record<string, unknown>) {
  const webView = webViewRef.current;
  if (!webView) return;
  const json = JSON.stringify(payload)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  webView.injectJavaScript(`window.__tvNativeReceive && window.__tvNativeReceive(${json}); true;`);
}

async function cancelPreviouslyScheduledPrayerNotifications() {
  const stored = await AsyncStorage.getItem(PRAYER_IDS_KEY);
  const ids: string[] = stored ? JSON.parse(stored) : [];
  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined)));
  await AsyncStorage.removeItem(PRAYER_IDS_KEY);
}

async function schedulePrayerNotifications(
  webViewRef: RefObject<WebView | null>,
  events: PrayerEventInput[],
  soundMode: string,
) {
  await cancelPreviouslyScheduledPrayerNotifications();
  if (Platform.OS !== "android" || events.length === 0) {
    postToWebView(webViewRef, { type: "notification-result", permissionGranted: true, scheduled: 0, disabled: true });
    return;
  }

  let permission = await Notifications.getPermissionsAsync();
  if (!permission.granted) permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) {
    postToWebView(webViewRef, { type: "notification-result", permissionGranted: false, scheduled: 0 });
    return;
  }

  const useBundledChime = soundMode === "chime";
  const channelId = useBundledChime ? CHIME_CHANNEL : DEFAULT_CHANNEL;
  await Notifications.setNotificationChannelAsync(channelId, {
    name: useBundledChime ? "Prayer reminders · gentle chime" : "Prayer reminders · system sound",
    description: "Local reminders before the next prayer time.",
    importance: Notifications.AndroidImportance.HIGH,
    sound: useBundledChime ? "prayer_chime.wav" : "default",
    vibrationPattern: [0, 120, 80, 120],
    enableVibrate: true,
    showBadge: false,
  });

  const scheduledIds: string[] = [];
  const now = Date.now();
  for (const event of events) {
    if (!Number.isFinite(event.triggerAt) || event.triggerAt <= now + 5_000) continue;
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: event.title,
        body: event.body,
        sound: useBundledChime ? "prayer_chime.wav" : "default",
        data: { kind: "prayer-reminder" },
        color: "#42B9FF",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: new Date(event.triggerAt),
        channelId,
      },
    });
    scheduledIds.push(identifier);
  }
  await AsyncStorage.setItem(PRAYER_IDS_KEY, JSON.stringify(scheduledIds));
  postToWebView(webViewRef, {
    type: "notification-result",
    permissionGranted: true,
    scheduled: scheduledIds.length,
  });
}

export async function handleNativeWebViewMessage(
  event: WebViewMessageEvent,
  webViewRef: RefObject<WebView | null>,
) {
  let message: WebCommand;
  try {
    message = JSON.parse(event.nativeEvent.data) as WebCommand;
  } catch {
    return;
  }

  if (message.type === "ready") {
    postToWebView(webViewRef, { type: "native-mode" });
    try {
      const apps: NativeTVApp[] = await TvLauncher.getInstalledApps();
      postToWebView(webViewRef, { type: "apps", apps });
    } catch (error) {
      console.warn("Unable to enumerate Android TV applications", error);
      postToWebView(webViewRef, { type: "apps", apps: [] });
    }
    return;
  }

  if (message.type !== "command") return;
  try {
    switch (message.action) {
      case "get-apps": {
        const apps: NativeTVApp[] = await TvLauncher.getInstalledApps();
        postToWebView(webViewRef, { type: "apps", apps });
        break;
      }
      case "launch-app": {
        const opened = message.appId ? await TvLauncher.launchApp(message.appId) : false;
        if (!opened) postToWebView(webViewRef, { type: "launch-error" });
        break;
      }
      case "open-wifi-settings":
        if (!TvLauncher.openWifiSettings()) postToWebView(webViewRef, { type: "launch-error" });
        break;
      case "open-bluetooth-settings":
        if (!TvLauncher.openBluetoothSettings()) postToWebView(webViewRef, { type: "launch-error" });
        break;
      case "open-memory-settings":
        if (!TvLauncher.openAppMemorySettings()) postToWebView(webViewRef, { type: "launch-error" });
        break;
      case "get-memory": {
        const memory: DeviceMemory = TvLauncher.getDeviceMemory();
        postToWebView(webViewRef, { type: "memory", memory });
        break;
      }
      case "schedule-prayers":
        await schedulePrayerNotifications(webViewRef, message.events || [], message.soundMode || "chime");
        break;
      default:
        // Ignore unknown messages; the WebView cannot launch arbitrary URLs or invoke arbitrary native APIs.
        break;
    }
  } catch (error) {
    console.warn("Android TV native bridge action failed", error);
    if (message.action === "schedule-prayers") {
      postToWebView(webViewRef, { type: "notification-result", permissionGranted: false, scheduled: 0 });
    } else {
      postToWebView(webViewRef, { type: "launch-error" });
    }
  }
}

export function validateExternalUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}
