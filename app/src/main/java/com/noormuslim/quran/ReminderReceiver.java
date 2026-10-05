package com.noormuslim.quran;

import android.Manifest;
import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.SystemClock;

public final class ReminderReceiver extends BroadcastReceiver {
    private static final String ACTION_REMINDER = "com.noormuslim.quran.REMINDER";
    private static final String PREFS = "quran_reminders";
    private static final String KEY_ENABLED = "enabled";
    private static final String KEY_INDEX = "index";
    private static final String CHANNEL_ID = "quran_reminders_v2";
    private static final int ALARM_ID = 2406;
    private static final int NOTIFICATION_ID = 2408;
    private static final long FOUR_HOURS = 4L * 60L * 60L * 1000L;

    private static final String[][] MESSAGES = {
        {"ذكر الله 🤍", "سبحان الله، والحمد لله، والله أكبر."},
        {"ذكر قصير 🌿", "سبحان الله وبحمده، سبحان الله العظيم."},
        {"تذكير إيماني", "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير."},
        {"استغفار", "أستغفر الله وأتوب إليه."},
        {"الصلاة على النبي ﷺ", "اللهم صل وسلم وبارك على نبينا محمد ﷺ."}
    };

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent == null ? ACTION_REMINDER : intent.getAction();

        if (Intent.ACTION_BOOT_COMPLETED.equals(action) ||
                Intent.ACTION_LOCKED_BOOT_COMPLETED.equals(action)) {
            if (isEnabled(context)) scheduleNext(context, 60_000L);
            return;
        }

        if (!ACTION_REMINDER.equals(action) || !isEnabled(context)) return;

        showReminder(context.getApplicationContext());
        scheduleNext(context.getApplicationContext(), FOUR_HOURS);
    }

    public static boolean isEnabled(Context context) {
        return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .getBoolean(KEY_ENABLED, false);
    }

    public static void setEnabled(Context context, boolean enabled) {
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                .edit().putBoolean(KEY_ENABLED, enabled).apply();

        if (enabled) scheduleNext(context.getApplicationContext(), FOUR_HOURS);
        else cancel(context.getApplicationContext());
    }

    public static void ensureScheduled(Context context) {
        if (!isEnabled(context)) return;

        AlarmManager alarmManager =
                (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent i = new Intent(context, ReminderReceiver.class).setAction(ACTION_REMINDER);
        PendingIntent existing = PendingIntent.getBroadcast(
                context, ALARM_ID, i,
                PendingIntent.FLAG_NO_CREATE | PendingIntent.FLAG_IMMUTABLE);

        if (existing == null) scheduleNext(context.getApplicationContext(), FOUR_HOURS);
    }

    private static void scheduleNext(Context context, long delayMillis) {
        AlarmManager alarmManager =
                (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent i = new Intent(context, ReminderReceiver.class).setAction(ACTION_REMINDER);
        PendingIntent pi = PendingIntent.getBroadcast(
                context, ALARM_ID, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        long trigger = SystemClock.elapsedRealtime() + Math.max(60_000L, delayMillis);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarmManager.setAndAllowWhileIdle(
                    AlarmManager.ELAPSED_REALTIME_WAKEUP, trigger, pi);
        } else {
            alarmManager.set(
                    AlarmManager.ELAPSED_REALTIME_WAKEUP, trigger, pi);
        }
    }

    private static void cancel(Context context) {
        AlarmManager alarmManager =
                (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent i = new Intent(context, ReminderReceiver.class).setAction(ACTION_REMINDER);
        PendingIntent pi = PendingIntent.getBroadcast(
                context, ALARM_ID, i,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        alarmManager.cancel(pi);
    }

    public static void showTestReminder(Context context) {
        showReminder(context.getApplicationContext());
    }

    private static void showReminder(Context context) {
        NotificationManager nm =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;

        if (Build.VERSION.SDK_INT >= 33 &&
                context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                        != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        createChannel(nm);

        SharedPreferences prefs =
                context.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        int index = prefs.getInt(KEY_INDEX, 0) % MESSAGES.length;
        String[] message = MESSAGES[index];

        Intent open = new Intent(context, MainActivity.class)
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK |
                        Intent.FLAG_ACTIVITY_CLEAR_TOP |
                        Intent.FLAG_ACTIVITY_SINGLE_TOP);

        PendingIntent contentIntent = PendingIntent.getActivity(
                context, 2407, open,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

        Notification.Builder builder = Build.VERSION.SDK_INT >= 26
                ? new Notification.Builder(context, CHANNEL_ID)
                : new Notification.Builder(context);

        builder.setSmallIcon(R.drawable.ic_stat_quran)
                .setContentTitle("القرآن الكريم • " + message[0])
                .setContentText(message[1])
                .setStyle(new Notification.BigTextStyle().bigText(message[1]))
                .setAutoCancel(true)
                .setContentIntent(contentIntent)
                .setCategory(Notification.CATEGORY_REMINDER)
                .setPriority(Notification.PRIORITY_DEFAULT);

        nm.notify(NOTIFICATION_ID, builder.build());

        prefs.edit().putInt(KEY_INDEX, (index + 1) % MESSAGES.length).apply();
    }

    private static void createChannel(NotificationManager nm) {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel ch = new NotificationChannel(
                    CHANNEL_ID,
                    "تذكيرات القرآن الكريم",
                    NotificationManager.IMPORTANCE_DEFAULT);
            ch.setDescription("تذكيرات الأذكار كل أربع ساعات");
            nm.createNotificationChannel(ch);
        }
    }
}
