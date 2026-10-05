package com.noormuslim.quran;

import android.content.Context;
import android.os.Build;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/** Native audio store for true offline/background playback. */
public final class NativeDownloadStore {
    private static final ExecutorService EXECUTOR = Executors.newSingleThreadExecutor();
    private static final Map<String, Integer> STATUS = new ConcurrentHashMap<>(); // 0 pending, 1 done, -1 failed

    private NativeDownloadStore() {}

    private static String safeKey(String key) {
        return (key == null ? "unknown" : key).replaceAll("[^A-Za-z0-9._-]", "_");
    }

    public static File fileFor(Context context, String key, int surah) {
        File dir = new File(context.getFilesDir(), "quran_audio/" + safeKey(key));
        if (!dir.exists()) dir.mkdirs();
        return new File(dir, String.format(java.util.Locale.US, "%03d.mp3", Math.max(1, surah)));
    }

    private static String statusKey(String key, int surah) { return safeKey(key) + ":" + surah; }

    public static boolean isDownloaded(Context context, String key, int surah) {
        File f = fileFor(context, key, surah);
        return f.isFile() && f.length() > 4096;
    }

    public static int status(Context context, String key, int surah) {
        if (isDownloaded(context, key, surah)) return 1;
        return STATUS.getOrDefault(statusKey(key, surah), 0);
    }

    public static void enqueue(Context context, String key, int surah, JSONArray urls) {
        if (isDownloaded(context, key, surah)) {
            STATUS.put(statusKey(key, surah), 1);
            return;
        }
        final String sk = statusKey(key, surah);
        STATUS.put(sk, 0);
        final Context app = context.getApplicationContext();
        EXECUTOR.execute(() -> downloadOne(app, key, surah, urls));
    }

    private static void downloadOne(Context context, String key, int surah, JSONArray urls) {
        final String sk = statusKey(key, surah);
        STATUS.put(sk, 0);
        File target = fileFor(context, key, surah);
        File temp = new File(target.getParentFile(), target.getName() + ".part");
        try {
            for (int i = 0; i < urls.length(); i++) {
                String raw = urls.optString(i, "");
                if (raw.isEmpty()) continue;
                HttpURLConnection conn = null;
                try {
                    URL url = new URL(raw);
                    conn = (HttpURLConnection) url.openConnection();
                    conn.setConnectTimeout(20000);
                    conn.setReadTimeout(60000);
                    conn.setInstanceFollowRedirects(true);
                    conn.setRequestProperty("User-Agent", "NoorMuslimQuran/1.0 Android");
                    conn.setRequestProperty("Accept", "audio/mpeg,audio/*;q=0.9,*/*;q=0.8");
                    conn.connect();
                    int code = conn.getResponseCode();
                    if (code < 200 || code >= 300) continue;
                    long expected = conn.getContentLengthLong();
                    try (BufferedInputStream in = new BufferedInputStream(conn.getInputStream());
                         BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(temp, false))) {
                        byte[] buffer = new byte[64 * 1024];
                        long total = 0;
                        int n;
                        while ((n = in.read(buffer)) != -1) {
                            out.write(buffer, 0, n);
                            total += n;
                        }
                        out.flush();
                        if (total < 4096 || (expected > 0 && total != expected)) {
                            // Do not promote a partial file to the offline store.
                            // Some servers use chunked transfer, so expected may be -1.
                            // If a declared length mismatches, retry the next source.
                            continue;
                        }
                    }
                    if (!temp.renameTo(target)) {
                        try (FileInputStream in = new FileInputStream(temp);
                             FileOutputStream out = new FileOutputStream(target, false)) {
                            byte[] buffer = new byte[64 * 1024];
                            int n;
                            while ((n = in.read(buffer)) != -1) out.write(buffer, 0, n);
                        }
                        //noinspection ResultOfMethodCallIgnored
                        temp.delete();
                    }
                    if (isDownloaded(context, key, surah)) {
                        STATUS.put(sk, 1);
                        return;
                    }
                } catch (Exception ignored) {
                    // Try the next candidate URL.
                } finally {
                    if (conn != null) conn.disconnect();
                }
            }
            //noinspection ResultOfMethodCallIgnored
            temp.delete();
            STATUS.put(sk, -1);
        } catch (Exception e) {
            //noinspection ResultOfMethodCallIgnored
            temp.delete();
            STATUS.put(sk, -1);
        }
    }
}
