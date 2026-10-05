package com.noormuslim.quran;

import android.webkit.JavascriptInterface;

import org.json.JSONArray;
import org.json.JSONObject;

/** JavaScript bridge used only by the bundled Android build. */
public final class NativeBridge {
    private final MainActivity activity;

    public NativeBridge(MainActivity activity) { this.activity = activity; }

    @JavascriptInterface public boolean isNative() { return true; }

    @JavascriptInterface public boolean isDownloaded(String key, int surah) {
        return NativeDownloadStore.isDownloaded(activity, key, surah);
    }

    @JavascriptInterface public int downloadStatus(String key, int surah) {
        return NativeDownloadStore.status(activity, key, surah);
    }

    @JavascriptInterface public void downloadAudio(String requestJson) {
        try {
            JSONObject r = new JSONObject(requestJson);
            NativeDownloadStore.enqueue(activity, r.optString("key", ""), r.optInt("surah", 1), r.optJSONArray("urls") == null ? new JSONArray() : r.optJSONArray("urls"));
        } catch (Exception ignored) {}
    }

    @JavascriptInterface public void playSurah(String requestJson) {
        try { QuranPlaybackService.startPlay(activity, new JSONObject(requestJson)); } catch (Exception ignored) {}
    }

    @JavascriptInterface public void togglePlay() { QuranPlaybackService.toggle(activity); }
    @JavascriptInterface public void next() { QuranPlaybackService.next(activity); }
    @JavascriptInterface public void previous() { QuranPlaybackService.prev(activity); }
    @JavascriptInterface public void stop() { QuranPlaybackService.stop(activity); }
    @JavascriptInterface public void seekTo(double seconds) { QuranPlaybackService.seek(activity, seconds); }
    @JavascriptInterface public void setAutoNext(boolean enabled) { QuranPlaybackService.setAutoNext(activity, enabled); }
    @JavascriptInterface public void setVolume(double volume) { /* Android MediaPlayer uses the device media volume; reserved for future per-app gain. */ }

    @JavascriptInterface public String getState() { return QuranPlaybackService.getSnapshot(); }
}
