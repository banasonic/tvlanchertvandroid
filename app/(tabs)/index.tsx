import { useCallback, useEffect, useRef } from "react";
import { BackHandler, Linking, Platform, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { WebView, type WebViewMessageEvent } from "react-native-webview";

import { tvPreviewHtml } from "@/lib/tvPreviewHtml";
import { handleNativeWebViewMessage, validateExternalUrl } from "@/lib/native-tv-bridge";

const LAUNCHER_ORIGIN = "https://launcher.local/";

export default function HomeScreen() {
  const webViewRef = useRef<WebView | null>(null);

  const onMessage = useCallback((event: WebViewMessageEvent) => {
    void handleNativeWebViewMessage(event, webViewRef);
  }, []);

  const injectBack = useCallback(() => {
    webViewRef.current?.injectJavaScript(
      "document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})); true;",
    );
  }, []);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      injectBack();
      return true;
    });
    return () => subscription.remove();
  }, [injectBack]);

  return (
    <View style={styles.root}>
      <StatusBar hidden />
      <WebView
        ref={webViewRef}
        source={{ html: tvPreviewHtml, baseUrl: LAUNCHER_ORIGIN }}
        originWhitelist={["*"]}
        style={styles.webview}
        containerStyle={styles.container}
        javaScriptEnabled
        domStorageEnabled
        cacheEnabled
        allowFileAccess
        allowUniversalAccessFromFileURLs={false}
        setSupportMultipleWindows
        mediaPlaybackRequiresUserAction={false}
        allowsFullscreenVideo
        onMessage={onMessage}
        onLoadEnd={() => {
          webViewRef.current?.injectJavaScript(
            "window.__tvNativeBootstrap && window.__tvNativeBootstrap(); true;",
          );
        }}
        onOpenWindow={(event) => {
          const url = validateExternalUrl(event.nativeEvent.targetUrl);
          if (url) void Linking.openURL(url);
        }}
        onShouldStartLoadWithRequest={(request) =>
          request.url === LAUNCHER_ORIGIN ||
          request.url === "https://launcher.local" ||
          request.url.startsWith("about:blank")
        }
        onRenderProcessGone={() => webViewRef.current?.reload()}
        renderLoading={() => <View style={styles.loading} />}
        startInLoadingState
        applicationNameForUserAgent="TVLauncher/1.0 AndroidTV"
        overScrollMode="never"
        scrollEnabled={false}
        bounces={false}
        textZoom={100}
        accessibilityLabel="Android TV Launcher"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#020713" },
  container: { backgroundColor: "#020713" },
  webview: { flex: 1, backgroundColor: "#020713" },
  loading: { flex: 1, backgroundColor: "#020713" },
});
