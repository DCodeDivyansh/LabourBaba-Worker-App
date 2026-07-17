package com.labourbaba.incomingjob

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

/**
 * Builds the Uber/Ola-style incoming-job notification: HIGH importance,
 * category CALL, full-screen intent, ongoing (can't be swiped away),
 * with native Accept/Reject actions.
 *
 * The channel's own `sound` is intentionally left unset (silent) because
 * IncomingJobForegroundService plays the ringtone itself via MediaPlayer —
 * this avoids two overlapping audio streams.
 */
object IncomingJobNotificationHelper {

    const val CHANNEL_ID = "incoming-job-v1"
    private const val CHANNEL_NAME = "Incoming Jobs"

    const val ACTION_ACCEPT = "com.labourbaba.incomingjob.action.ACCEPT"
    const val ACTION_REJECT = "com.labourbaba.incomingjob.action.REJECT"
    const val EXTRA_JOB_ID = "extra_job_id"

    fun createChannel(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channel = NotificationChannel(
            CHANNEL_ID,
            CHANNEL_NAME,
            NotificationManager.IMPORTANCE_HIGH
        ).apply {
            description = "Alerts for new incoming job offers"
            enableVibration(true)
            vibrationPattern = longArrayOf(0, 400, 200, 400, 200, 600)
            lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
            setBypassDnd(true)
            // Deliberately silent — MediaPlayer in IncomingJobForegroundService
            // owns the actual ringtone audio.
            setSound(null, null)
        }
        manager.createNotificationChannel(channel)
    }

    fun buildFullScreenNotification(
        context: Context,
        jobId: String,
        requirementId: String,
        title: String,
        body: String,
        ratePerDay: String,
        customerName: String,
        location: String,
        expiresAt: String,
    ): android.app.Notification {
        createChannel(context)

        val fullScreenIntent = Intent(context, IncomingJobActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_CLEAR_TOP or
                Intent.FLAG_ACTIVITY_SINGLE_TOP
            putExtra(IncomingJobActivity.EXTRA_JOB_ID, jobId)
            putExtra(IncomingJobActivity.EXTRA_REQUIREMENT_ID, requirementId)
            putExtra(IncomingJobActivity.EXTRA_TITLE, title)
            putExtra(IncomingJobActivity.EXTRA_BODY, body)
            putExtra(IncomingJobActivity.EXTRA_RATE_PER_DAY, ratePerDay)
            putExtra(IncomingJobActivity.EXTRA_CUSTOMER_NAME, customerName)
            putExtra(IncomingJobActivity.EXTRA_LOCATION, location)
            putExtra(IncomingJobActivity.EXTRA_EXPIRES_AT, expiresAt)
        }

        val fullScreenPendingIntent = PendingIntent.getActivity(
            context,
            jobId.hashCode(),
            fullScreenIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val acceptPendingIntent = actionPendingIntent(context, ACTION_ACCEPT, jobId)
        val rejectPendingIntent = actionPendingIntent(context, ACTION_REJECT, jobId)

        return NotificationCompat.Builder(context, CHANNEL_ID)
            .setContentTitle(title)
            .setContentText("$customerName • ₹$ratePerDay/day • $location")
            .setSmallIcon(context.applicationInfo.icon)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .setFullScreenIntent(fullScreenPendingIntent, true)
            .setContentIntent(fullScreenPendingIntent)
            .setOngoing(true)
            .setAutoCancel(false)
            .addAction(0, "Accept", acceptPendingIntent)
            .addAction(0, "Reject", rejectPendingIntent)
            .build()
    }

    private fun actionPendingIntent(context: Context, action: String, jobId: String): PendingIntent {
        val intent = Intent(context, IncomingJobActionReceiver::class.java).apply {
            this.action = action
            putExtra(EXTRA_JOB_ID, jobId)
        }
        return PendingIntent.getBroadcast(
            context,
            (action + jobId).hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }

    fun cancelNotification(context: Context, jobId: String) {
        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        manager.cancel(IncomingJobForegroundService.NOTIFICATION_ID)
    }
}