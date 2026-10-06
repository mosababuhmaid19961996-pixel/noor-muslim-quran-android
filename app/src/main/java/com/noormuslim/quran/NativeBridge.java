package com.noormuslim.quran;

import android.media.AudioAttributes;
import android.media.AudioManager;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.Voice;
import android.webkit.JavascriptInterface;

import java.util.Locale;

import org.json.JSONArray;
import org.json.JSONObject;

/** JavaScript bridge used only by the bundled Android build. */
public final class NativeBridge {
    private final MainActivity activity;
    private TextToSpeech tts;
    private boolean ttsReady = false;
    private boolean welcomePending = false;
    private static final String WELCOME_TEXT = "اللهم صل وسلم وبارك على نبينا محمد";

    public NativeBridge(MainActivity activity) {
        this.activity = activity;
        activity.runOnUiThread(() -> {
            try {
                tts = new TextToSpeech(activity, status -> {
                    if (status != TextToSpeech.SUCCESS || tts == null) {
                        ttsReady = false;
                        return;
                    }

                    int result = tts.setLanguage(new Locale("ar", "SA"));
                    if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                        result = tts.setLanguage(new Locale("ar"));
                    }
                    if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                        ttsReady = false;
                        return;
                    }

                    try {
                        tts.setAudioAttributes(new AudioAttributes.Builder()
                                .setUsage(AudioAttributes.USAGE_ASSISTANCE_ACCESSIBILITY)
                                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH)
                                .build());
                    } catch (Exception ignored) {}

                    try {
                        Voice maleArabic = findPreferredMaleArabicVoice();
                        if (maleArabic != null) tts.setVoice(maleArabic);
                    } catch (Exception ignored) {}

                    tts.setSpeechRate(0.90f);
                    tts.setPitch(1.0f);
                    ttsReady = true;

                    if (welcomePending) {
                        welcomePending = false;
                        speakWelcomeNow();
                    }
                });
            } catch (Exception ignored) {
                ttsReady = false;
            }
        });
    }

    @JavascriptInterface public boolean isNative() { return true; }

    @JavascriptInterface public void speakWelcome() {
        activity.runOnUiThread(() -> {
            if (!ttsReady || tts == null) {
                // The TTS engine initializes asynchronously. Remember the request
                // so the welcome speech plays as soon as Arabic TTS is ready.
                welcomePending = true;
                return;
            }
            speakWelcomeNow();
        });
    }

    private Voice findPreferredMaleArabicVoice() {
        try {
            if (tts == null || tts.getVoices() == null) return null;
            Voice fallbackArabic = null;
            for (Voice voice : tts.getVoices()) {
                if (voice == null || voice.getLocale() == null) continue;
                if (!"ar".equalsIgnoreCase(voice.getLocale().getLanguage())) continue;
                String name = voice.getName() == null ? "" : voice.getName().toLowerCase(Locale.ROOT);
                if (name.contains("male") || name.contains("man") || name.contains("masculine")) return voice;
                if (!voice.isNetworkConnectionRequired()) fallbackArabic = voice;
            }
            return fallbackArabic;
        } catch (Exception ignored) {
            return null;
        }
    }

    private void speakWelcomeNow() {
        try {
            if (tts == null || !ttsReady) return;
            Bundle params = new Bundle();
            params.putInt(TextToSpeech.Engine.KEY_PARAM_STREAM, AudioManager.STREAM_MUSIC);
            params.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, 1.0f);
            tts.speak(WELCOME_TEXT, TextToSpeech.QUEUE_FLUSH, params, "quran_welcome");
        } catch (Exception ignored) {}
    }

    @JavascriptInterface public void stopWelcomeSpeech() {
        activity.runOnUiThread(() -> {
            try {
                welcomePending = false;
                if (tts != null) tts.stop();
            } catch (Exception ignored) {}
        });
    }

    public void shutdownTts() {
        activity.runOnUiThread(() -> {
            try {
                welcomePending = false;
                ttsReady = false;
                if (tts != null) {
                    tts.stop();
                    tts.shutdown();
                    tts = null;
                }
            } catch (Exception ignored) {}
        });
    }

    @JavascriptInterface public boolean hasNotificationPermission() {
        if (android.os.Build.VERSION.SDK_INT < 33) return true;
        return activity.checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)
                == android.content.pm.PackageManager.PERMISSION_GRANTED;
    }

    @JavascriptInterface public void requestNotificationPermission() {
        activity.runOnUiThread(() -> {
            if (android.os.Build.VERSION.SDK_INT < 33) {
                activity.notifyNotificationPermissionResult(true);
                return;
            }
            if (hasNotificationPermission()) {
                activity.notifyNotificationPermissionResult(true);
                return;
            }
            activity.requestPermissions(
                    new String[]{android.Manifest.permission.POST_NOTIFICATIONS}, 2026);
        });
    }

    @JavascriptInterface public boolean isReminderEnabled() {
        return ReminderReceiver.isEnabled(activity) && hasNotificationPermission();
    }

    @JavascriptInterface public void setReminderEnabled(boolean enabled) {
        if (!enabled) {
            ReminderReceiver.setEnabled(activity, false);
            return;
        }
        if (hasNotificationPermission()) {
            ReminderReceiver.setEnabled(activity, true);
        }
    }

    @JavascriptInterface public void testReminder() {
        if (hasNotificationPermission()) ReminderReceiver.showTestReminder(activity);
    }

    @JavascriptInterface public void openNotificationSettings() {
        activity.runOnUiThread(() -> {
            android.content.Intent i = new android.content.Intent(
                    android.provider.Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            i.putExtra(android.provider.Settings.EXTRA_APP_PACKAGE, activity.getPackageName());
            activity.startActivity(i);
        });
    }

    @JavascriptInterface public boolean isDownloaded(String key, int surah) {
        return NativeDownloadStore.isDownloaded(activity, key, surah);
    }

    @JavascriptInterface public int downloadStatus(String key, int surah) {
        return NativeDownloadStore.status(activity, key, surah);
    }

    @JavascriptInterface public void downloadAudio(String requestJson) {
        try {
            JSONObject r = new JSONObject(requestJson);
            NativeDownloadStore.enqueue(
                    activity,
                    r.optString("key", ""),
                    r.optInt("surah", 1),
                    r.optJSONArray("urls") == null ? new JSONArray() : r.optJSONArray("urls"));
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
