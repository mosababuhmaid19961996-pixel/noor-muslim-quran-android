package com.noormuslim.quran;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.media.session.MediaSession;
import android.media.session.PlaybackState;
import android.net.Uri;
import android.os.Build;
import android.os.IBinder;
import android.content.pm.ServiceInfo;


import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.util.concurrent.atomic.AtomicBoolean;

public class QuranPlaybackService extends Service {
    public static final String ACTION_PLAY = "com.noormuslim.quran.PLAY";
    public static final String ACTION_TOGGLE = "com.noormuslim.quran.TOGGLE";
    public static final String ACTION_NEXT = "com.noormuslim.quran.NEXT";
    public static final String ACTION_PREV = "com.noormuslim.quran.PREV";
    public static final String ACTION_STOP = "com.noormuslim.quran.STOP";
    public static final String ACTION_SEEK = "com.noormuslim.quran.SEEK";
    public static final String ACTION_AUTONEXT = "com.noormuslim.quran.AUTONEXT";
    public static final String EXTRA_REQUEST = "request";
    public static final String EXTRA_SECONDS = "seconds";
    public static final String EXTRA_ENABLED = "enabled";

    private static final String CHANNEL_ID = "quran_playback";
    private static volatile QuranPlaybackService instance;

    private MediaPlayer player;
    private MediaSession mediaSession;
    private String reciterKey = "";
    private String title = "القرآن الكريم";
    private String artist = "";
    private JSONArray urls = new JSONArray();
    private int surah = 0;
    private boolean autoNext = true;
    private boolean prepared = false;
    private boolean explicitStop = false;
    private final AtomicBoolean preparing = new AtomicBoolean(false);

    public static void startPlay(android.content.Context context, JSONObject req) {
        Intent i = new Intent(context, QuranPlaybackService.class);
        i.setAction(ACTION_PLAY);
        i.putExtra(EXTRA_REQUEST, req.toString());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(i);
        else context.startService(i);
    }

    public static void toggle(android.content.Context context) { send(context, ACTION_TOGGLE, null); }
    public static void next(android.content.Context context) { send(context, ACTION_NEXT, null); }
    public static void prev(android.content.Context context) { send(context, ACTION_PREV, null); }
    public static void stop(android.content.Context context) { send(context, ACTION_STOP, null); }
    public static void seek(android.content.Context context, double seconds) {
        Intent i = new Intent(context, QuranPlaybackService.class).setAction(ACTION_SEEK).putExtra(EXTRA_SECONDS, seconds);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(i); else context.startService(i);
    }
    public static void setAutoNext(android.content.Context context, boolean enabled) {
        Intent i = new Intent(context, QuranPlaybackService.class).setAction(ACTION_AUTONEXT).putExtra(EXTRA_ENABLED, enabled);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(i); else context.startService(i);
    }
    private static void send(android.content.Context context, String action, String extra) {
        Intent i = new Intent(context, QuranPlaybackService.class).setAction(action);
        if (extra != null) i.putExtra(EXTRA_REQUEST, extra);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(i); else context.startService(i);
    }

    public static String getSnapshot() {
        QuranPlaybackService s = instance;
        JSONObject o = new JSONObject();
        try {
            if (s == null) { o.put("active", false); return o.toString(); }
            o.put("active", s.player != null && s.prepared);
            o.put("playing", s.player != null && s.prepared && s.player.isPlaying());
            o.put("surah", s.surah);
            o.put("key", s.reciterKey);
            o.put("title", s.title);
            o.put("artist", s.artist);
            o.put("autoNext", s.autoNext);
            o.put("position", s.positionSeconds());
            o.put("duration", s.durationSeconds());
        } catch (Exception ignored) {}
        return o.toString();
    }

    private double positionSeconds() {
        try { return player != null && prepared ? player.getCurrentPosition() / 1000.0 : 0; } catch (Exception e) { return 0; }
    }
    private double durationSeconds() {
        try { return player != null && prepared ? player.getDuration() / 1000.0 : 0; } catch (Exception e) { return 0; }
    }

    @Override public void onCreate() {
        super.onCreate();
        instance = this;
        createChannel();
        setupMediaSession();
        // Start with a foreground notification immediately. This prevents Android
        // from stopping a newly launched foreground service before media is ready.
        if (Build.VERSION.SDK_INT >= 29) {
            startForeground(1001, buildNotification(), ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK);
        } else {
            startForeground(1001, buildNotification());
        }
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel c = new NotificationChannel(CHANNEL_ID, "تشغيل القرآن الكريم", NotificationManager.IMPORTANCE_LOW);
            c.setDescription("تحكم في تلاوة القرآن الكريم في الخلفية");
            c.setShowBadge(false);
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(c);
        }
    }

    private void setupMediaSession() {
        mediaSession = new MediaSession(this, "NoorMuslimQuran");
        mediaSession.setCallback(new MediaSession.Callback() {
            @Override public void onPlay() { playInternal(); }
            @Override public void onPause() { pauseInternal(); }
            @Override public void onSkipToNext() { nextInternal(); }
            @Override public void onSkipToPrevious() { prevInternal(); }
            @Override public void onSeekTo(long pos) { seekToInternal(pos / 1000.0); }
            @Override public void onStop() { stopSelfAndPlayer(); }
        });
        mediaSession.setActive(true);
    }

    @Override public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent == null) return START_STICKY;
        String action = intent.getAction();
        try {
            if (ACTION_PLAY.equals(action)) {
                String raw = intent.getStringExtra(EXTRA_REQUEST);
                if (raw != null) startRequest(new JSONObject(raw));
            } else if (ACTION_TOGGLE.equals(action)) {
                if (player != null && prepared && player.isPlaying()) pauseInternal(); else playInternal();
            } else if (ACTION_NEXT.equals(action)) nextInternal();
            else if (ACTION_PREV.equals(action)) prevInternal();
            else if (ACTION_STOP.equals(action)) stopSelfAndPlayer();
            else if (ACTION_SEEK.equals(action)) seekToInternal(intent.getDoubleExtra(EXTRA_SECONDS, 0));
            else if (ACTION_AUTONEXT.equals(action)) { autoNext = intent.getBooleanExtra(EXTRA_ENABLED, autoNext); updateNotification(); }
        } catch (Exception ignored) {}
        return START_STICKY;
    }

    private void startRequest(JSONObject req) {
        explicitStop = false;
        reciterKey = req.optString("key", reciterKey);
        surah = Math.max(1, Math.min(114, req.optInt("surah", surah == 0 ? 1 : surah)));
        title = req.optString("title", "السورة " + surah);
        artist = req.optString("artist", "القرآن الكريم");
        autoNext = req.optBoolean("autoNext", true);
        try { urls = req.optJSONArray("urls"); if (urls == null) urls = new JSONArray(); } catch (Exception ignored) { urls = new JSONArray(); }
        double position = Math.max(0, req.optDouble("position", 0));
        prepareCurrent(position);
    }

    private void prepareCurrent(double seekSeconds) {
        if (!preparing.compareAndSet(false, true)) {
            releasePlayerOnly();
            preparing.set(true);
        }
        prepared = false;
        releasePlayerOnly();
        player = new MediaPlayer();
        try {
            player.setAudioAttributes(new AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_MEDIA)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build());
            File local = NativeDownloadStore.fileFor(this, reciterKey, surah);
            if (local.isFile() && local.length() > 4096) {
                player.setDataSource(local.getAbsolutePath());
            } else if (urls.length() > 0) {
                player.setDataSource(this, Uri.parse(urls.optString(0)));
            } else {
                throw new IllegalStateException("No audio source");
            }
            player.setOnPreparedListener(mp -> {
                prepared = true;
                preparing.set(false);
                if (seekSeconds > 0 && seekSeconds < (mp.getDuration() / 1000.0) - 0.5) mp.seekTo((int) (seekSeconds * 1000));
                mp.start();
                updatePlaybackState();
                updateNotification();
            });
            player.setOnCompletionListener(mp -> {
                prepared = true;
                if (autoNext) {
                    int next = surah >= 114 ? 1 : surah + 1;
                    surah = next;
                    title = "السورة " + next;
                    urls = nextUrls(urls, next);
                    prepareCurrent(0);
                } else {
                    updatePlaybackState();
                    updateNotification();
                }
            });
            player.setOnErrorListener((mp, what, extra) -> {
                preparing.set(false);
                prepared = false;
                updatePlaybackState();
                updateNotification();
                // If the first remote source failed, try the second candidate.
                if (urls.length() > 1) {
                    try {
                        JSONArray rest = new JSONArray();
                        for (int i = 1; i < urls.length(); i++) rest.put(urls.optString(i));
                        urls = rest;
                        prepareCurrent(0);
                    } catch (Exception ignored) {}
                }
                return true;
            });
            player.prepareAsync();
        } catch (Exception e) {
            preparing.set(false);
            prepared = false;
            updateNotification();
        }
    }

    private JSONArray nextUrls(JSONArray old, int next) {
        JSONArray out = new JSONArray();
        String file = String.format(java.util.Locale.US, "%03d.mp3", next);
        for (int i = 0; i < old.length(); i++) {
            String u = old.optString(i, "");
            if (u.isEmpty()) continue;
            // Works for both /001.mp3 and /001.mp3?query=...
            String v = u.replaceFirst("/\\d{3}\\.mp3(?=\\?|$)", "/" + file);
            out.put(v);
        }
        return out;
    }

    private void playInternal() {
        try {
            if (player != null && prepared) {
                player.start();
                updatePlaybackState();
                updateNotification();
            }
        } catch (Exception ignored) {}
    }

    private void pauseInternal() {
        try { if (player != null && prepared && player.isPlaying()) player.pause(); } catch (Exception ignored) {}
        updatePlaybackState();
        updateNotification();
    }

    private void nextInternal() {
        int next = surah >= 114 ? 1 : surah + 1;
        surah = next;
        title = "السورة " + next;
        urls = nextUrls(urls, next);
        prepareCurrent(0);
    }

    private void prevInternal() {
        int prev = surah <= 1 ? 114 : surah - 1;
        surah = prev;
        title = "السورة " + prev;
        urls = nextUrls(urls, prev);
        prepareCurrent(0);
    }

    private void seekToInternal(double sec) {
        try { if (player != null && prepared) player.seekTo((int) Math.max(0, sec * 1000)); } catch (Exception ignored) {}
        updatePlaybackState();
        updateNotification();
    }

    private void stopSelfAndPlayer() {
        explicitStop = true;
        releasePlayerOnly();
        prepared = false;
        updatePlaybackState();
        stopForeground(true);
        if (mediaSession != null) mediaSession.setActive(false);
        stopSelf();
    }

    private void releasePlayerOnly() {
        if (player != null) {
            try { player.setOnPreparedListener(null); player.setOnCompletionListener(null); player.setOnErrorListener(null); } catch (Exception ignored) {}
            try { player.stop(); } catch (Exception ignored) {}
            try { player.reset(); } catch (Exception ignored) {}
            try { player.release(); } catch (Exception ignored) {}
            player = null;
        }
    }

    private void updatePlaybackState() {
        if (mediaSession == null) return;
        boolean playing = false;
        try { playing = player != null && prepared && player.isPlaying(); } catch (Exception ignored) {}
        int state = playing ? PlaybackState.STATE_PLAYING : (prepared ? PlaybackState.STATE_PAUSED : PlaybackState.STATE_BUFFERING);
        long pos = (long) (positionSeconds() * 1000.0);
        long dur = (long) (durationSeconds() * 1000.0);
        PlaybackState.Builder b = new PlaybackState.Builder()
                .setActions(PlaybackState.ACTION_PLAY | PlaybackState.ACTION_PAUSE |
                        PlaybackState.ACTION_SKIP_TO_NEXT | PlaybackState.ACTION_SKIP_TO_PREVIOUS |
                        PlaybackState.ACTION_SEEK_TO | PlaybackState.ACTION_STOP)
                .setState(state, pos, 1.0f);
        if (dur > 0) b.setExtras(new android.os.Bundle());
        mediaSession.setPlaybackState(b.build());
    }

    private PendingIntent serviceIntent(String action) {
        Intent i = new Intent(this, QuranPlaybackService.class).setAction(action);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
        return PendingIntent.getService(this, action.hashCode(), i, flags);
    }

    private Notification buildNotification() {
        boolean playing = false;
        try { playing = player != null && prepared && player.isPlaying(); } catch (Exception ignored) {}
        Intent open = new Intent(this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) flags |= PendingIntent.FLAG_IMMUTABLE;
        PendingIntent content = PendingIntent.getActivity(this, 700, open, flags);
        Notification.Builder b = new Notification.Builder(this, CHANNEL_ID)
                .setSmallIcon(com.noormuslim.quran.R.drawable.ic_quran)
                .setContentTitle(title)
                .setContentText(artist)
                .setContentIntent(content)
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setShowWhen(false)
                .setVisibility(Notification.VISIBILITY_PUBLIC);
        b.addAction(new Notification.Action.Builder(null, "السابق", serviceIntent(ACTION_PREV)).build());
        b.addAction(new Notification.Action.Builder(null, playing ? "إيقاف مؤقت" : "تشغيل", serviceIntent(ACTION_TOGGLE)).build());
        b.addAction(new Notification.Action.Builder(null, "التالي", serviceIntent(ACTION_NEXT)).build());
        b.addAction(new Notification.Action.Builder(null, "إيقاف", serviceIntent(ACTION_STOP)).build());
        if (mediaSession != null) b.setStyle(new Notification.MediaStyle().setMediaSession(mediaSession.getSessionToken()).setShowActionsInCompactView(0,1,2));
        return b.build();
    }

    private void updateNotification() {
        NotificationManager nm = getSystemService(NotificationManager.class);
        if (nm != null) nm.notify(1001, buildNotification());
        updatePlaybackState();
    }

    @Override public void onTaskRemoved(Intent rootIntent) {
        // Deliberately keep the playback service alive when the app task is swiped away.
        super.onTaskRemoved(rootIntent);
    }

    @Override public void onDestroy() {
        if (mediaSession != null) { try { mediaSession.setActive(false); mediaSession.release(); } catch (Exception ignored) {} mediaSession = null; }
        releasePlayerOnly();
        if (instance == this) instance = null;
        super.onDestroy();
    }

    @Override public IBinder onBind(Intent intent) { return null; }
}
