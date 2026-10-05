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

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;

public class MainActivity extends Activity {
    private WebView webView;
    private boolean destroyed = false;

    @Override protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        webView = new WebView(this);
        setContentView(webView);
        configureWebView(webView);
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 2026);
        }
        ReminderReceiver.schedule(this);
        webView.loadUrl("https://noor.local/index.html");
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
        wv.addJavascriptInterface(new NativeBridge(this), "AndroidQuran");
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

    @Override public void onBackPressed() {
        if (webView == null || destroyed) { finish(); return; }
        webView.evaluateJavascript(
                "(function(){var m=document.getElementById('modal'),s=document.getElementById('settingsModal');return (m&&!m.classList.contains('hidden'))||(s&&!s.classList.contains('hidden'));})()",
                value -> {
                    boolean overlay = "true".equals(value);
                    if (overlay && webView.canGoBack()) webView.goBack();
                    else finish();
                });
    }

    @Override protected void onDestroy() {
        destroyed = true;
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
