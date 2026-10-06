package com.noormuslim.quran;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.window.OnBackInvokedCallback;
import android.window.OnBackInvokedDispatcher;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

public class MainActivity extends Activity {
    private WebView webView;
    private NativeBridge nativeBridge;
    private boolean destroyed = false;
    private OnBackInvokedCallback backCallback;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        webView = new WebView(this);
        setContentView(webView);
        configureWebView(webView);
        // Notification permission is requested only when the user enables reminders in Settings.
        ReminderReceiver.ensureScheduled(this);
        if (Build.VERSION.SDK_INT >= 33) {
            backCallback = this::handleBackPress;
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(
                    OnBackInvokedDispatcher.PRIORITY_DEFAULT, backCallback);
        }
        webView.loadUrl("https://noor.local/index.html");
    }

    public void notifyNotificationPermissionResult(boolean granted) {
        if (webView == null || destroyed) return;
        webView.post(() -> webView.evaluateJavascript(
                "window.__quranNativeNotificationResult && window.__quranNativeNotificationResult(" + granted + ");",
                null));
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != 2026 || webView == null || destroyed) return;
        boolean granted = Build.VERSION.SDK_INT < 33 ||
                (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED);
        notifyNotificationPermissionResult(granted);
    }

    private void configureWebView(WebView wv) {
        WebSettings s = wv.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        wv.setBackgroundColor(0x00000000);
        nativeBridge = new NativeBridge(this);
        wv.addJavascriptInterface(nativeBridge, "AndroidQuran");
        wv.setWebViewClient(new LocalAssetClient());
    }

    private final class LocalAssetClient extends WebViewClient {
        @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
            return assetResponse(request.getUrl().getPath());
        }

        @Override public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
            if (url != null && url.startsWith("https://noor.local/")) return assetResponse(android.net.Uri.parse(url).getPath());
            return super.shouldInterceptRequest(view, url);
        }

        private WebResourceResponse assetResponse(String path) {
            if (path == null) return null;
            if (!path.startsWith("/")) path = "/" + path;
            String assetPath = path.substring(1);
            if (assetPath.isEmpty()) assetPath = "index.html";
            try {
                InputStream in = getAssets().open("site/" + assetPath);
                String mime = mime(assetPath);
                return new WebResourceResponse(mime, "UTF-8", in);
            } catch (IOException ignored) {
                return null;
            }
        }

        private String mime(String path) {
            String p = path.toLowerCase(Locale.US);
            if (p.endsWith(".html")) return "text/html";
            if (p.endsWith(".js")) return "application/javascript";
            if (p.endsWith(".css")) return "text/css";
            if (p.endsWith(".json") || p.endsWith(".webmanifest")) return "application/json";
            if (p.endsWith(".png")) return "image/png";
            if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
            if (p.endsWith(".svg")) return "image/svg+xml";
            if (p.endsWith(".mp3")) return "audio/mpeg";
            return "application/octet-stream";
        }
    }

    private void handleBackPress() {
        if (webView == null || destroyed) { finish(); return; }
        webView.post(() -> webView.evaluateJavascript(
                "(function(){try{if(window.__quranAndroidBack){window.__quranAndroidBack();return true;}return true;}catch(e){return true;}})()",
                null
        ));
    }

    @Override public void onBackPressed() {
        handleBackPress();
    }
    @Override protected void onDestroy() {
        if (Build.VERSION.SDK_INT >= 33 && backCallback != null) {
            try { getOnBackInvokedDispatcher().unregisterOnBackInvokedCallback(backCallback); } catch (Exception ignored) {}
            backCallback = null;
        }
        destroyed = true;
        if (nativeBridge != null) {
            nativeBridge.shutdownTts();
            nativeBridge = null;
        }
        if (webView != null) {
            webView.stopLoading();
            webView.removeJavascriptInterface("AndroidQuran");
            webView.destroy();
            webView = null;
        }
        // Do NOT stop QuranPlaybackService here. It is intentionally independent
        // of the Activity so audio can continue after Back closes the app UI.
        super.onDestroy();
    }
}
