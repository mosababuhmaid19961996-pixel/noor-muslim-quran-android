package com.noormuslim.quran;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;

public class ReminderReceiver extends BroadcastReceiver {
    private static final String ACTION_REMINDER = "com.noormuslim.quran.REMINDER";
    private static final String CHANNEL_ID = "islamic_reminders";
    private static final long FOUR_HOURS = 4L * 60L * 60L * 1000L;

    private static final String[] TITLES = {
        "تذكير إيماني 🌿",
        "آية تذكّر بها قلبك 📖",
        "من السنة النبوية ﷺ",
        "ذكر الله يطمئن القلوب 🤍"
    };

    private static final String[] MESSAGES = {
        "﴿ألا بذكر الله تطمئن القلوب﴾ — الرعد: 28",
        "﴿فاذكروني أذكركم واشكروا لي ولا تكفرون﴾ — البقرة: 152",
        "قال ﷺ: «من صلى علي واحدة صلى الله عليه بها عشراً»",
        "سبحان الله، والحمد لله، والله أكبر."
    };

    @Override
    public void onReceive(Context context, Intent intent) {
        if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
            schedule(context);
            return;
        }
        showNotification(context);
    }

    public static void schedule(Context context) {
        createChannel(context);

        AlarmManager alarmManager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
        if (alarmManager == null) return;

        Intent intent = new Intent(context, ReminderReceiver.class);
        intent.setAction(ACTION_REMINDER);

        PendingIntent pendingIntent = PendingIntent.getBroadcast(
                context,
                4004,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        long firstTrigger = System.currentTimeMillis() + FOUR_HOURS;
        alarmManager.setInexactRepeating(
                AlarmManager.RTC_WAKEUP,
                firstTrigger,
                FOUR_HOURS,
                pendingIntent
        );
    }

    private static void createChannel(Context context) {
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (manager == null) return;

            NotificationChannel channel = new NotificationChannel(
                    CHANNEL_ID,
                    "التذكيرات الإسلامية",
                    NotificationManager.IMPORTANCE_DEFAULT
            );
            channel.setDescription("آيات وأحاديث وأذكار كل أربع ساعات");
            manager.createNotificationChannel(channel);
        }
    }

    private static void showNotification(Context context) {
        if (Build.VERSION.SDK_INT >= 33 &&
                context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            return;
        }

        createChannel(context);

        int index = context.getSharedPreferences("reminders", Context.MODE_PRIVATE)
                .getInt("index", 0);

        Intent openIntent = new Intent(context, MainActivity.class);
        openIntent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP | Intent.FLAG_ACTIVITY_CLEAR_TOP);

        PendingIntent openPendingIntent = PendingIntent.getActivity(
                context,
                5005,
                openIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );

        android.app.Notification.Builder builder;
        if (Build.VERSION.SDK_INT >= 26) {
            builder = new android.app.Notification.Builder(context, CHANNEL_ID);
        } else {
            builder = new android.app.Notification.Builder(context);
        }

        builder.setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(TITLES[index % TITLES.length])
                .setContentText(MESSAGES[index % MESSAGES.length])
                .setStyle(new android.app.Notification.BigTextStyle().bigText(MESSAGES[index % MESSAGES.length]))
                .setContentIntent(openPendingIntent)
                .setAutoCancel(true)
                .setCategory(android.app.Notification.CATEGORY_REMINDER)
                .setPriority(android.app.Notification.PRIORITY_DEFAULT);

        NotificationManager manager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.notify(4004 + index, builder.build());
        }

        context.getSharedPreferences("reminders", Context.MODE_PRIVATE)
                .edit()
                .putInt("index", (index + 1) % TITLES.length)
                .apply();
    }
}
