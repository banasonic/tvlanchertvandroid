import type { ExpoConfig } from "expo/config";

const app = {
  name: "لانشر Android TV عربي",
  slug: "tvlaunch",
  logoUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310519663391601956/HqjEJUSmdwtpeYPO.png",
  packageName: "space.manus.tvlaunch.t216042200716599",
};

const config: ExpoConfig = {
  name: app.name,
  slug: app.slug,
  version: "1.0.0",
  orientation: "landscape",
  icon: "./assets/images/icon.png",
  userInterfaceStyle: "dark",
  backgroundColor: "#071842",
  android: {
    adaptiveIcon: {
      backgroundColor: "#071842",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
    package: app.packageName,
    permissions: ["POST_NOTIFICATIONS"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-asset",
    "expo-router",
    "./plugins/withAndroidTV.js",
    [
      "expo-notifications",
      {
        icon: "./assets/images/android-icon-monochrome.png",
        color: "#42B9FF",
        defaultChannel: "prayer-reminders",
        sounds: ["./assets/sounds/prayer_chime.wav"],
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#071842",
        dark: {
          backgroundColor: "#071842",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          minSdkVersion: 28,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
