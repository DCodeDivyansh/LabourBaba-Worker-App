package com.labourbaba.incomingjob

import android.app.Service
import android.content.Intent
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.MediaPlayer
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.PowerManager
import android.util.Log

/**
 * Owns the entire "phone is ringing" lifecycle:
 *  - acquires a WAKE_LOCK so the CPU doesn't sleep mid-ring
 *  - builds + posts the full-screen ongoing notification
 *  - loops a local raw-resource ringtone via android.media.MediaPlayer
 *  - runs the 30s countdown and auto-times-out if nobody responds
 *  - stops everything (ringtone, wake lock, notification, itself) on
 *    accept / reject / timeout, called either from IncomingJobActivity
 *    or from JS via IncomingJobModule.
 */
class IncomingJobForegroundService : Service() {

    companion object {
        private const val TAG = "IncomingJobFgService"

        const val ACTION_START = "com.labourbaba.incomingjob.action.START"
        const val ACTION_STOP = "com.labourbaba.incomingjob.action.STOP"

        const val EXTRA_JOB_ID = "extra_job_id"
        const val EXTRA_REQUIREMENT_ID = "extra_requirement_id"
        const val EXTRA_TITLE = "extra_title"
        const val EXTRA_BODY = "extra_body"
        const val EXTRA_RATE_PER_DAY = "extra_rate_per_day"
        const val EXTRA_CUSTOMER_NAME = "extra_customer_name"
        const val EXTRA_LOCATION = "extra_location"
        const val EXTRA_EXPIRES_AT = "extra_expires_at"

        const val NOTIFICATION_ID = 5501
        const val TIMEOUT_MS = 30_000L

        // Exposes whether the service is currently ringing so the RN bridge
        // module can answer synchronous "isRinging" queries without an IPC round trip.
        @Volatile var isRunning: Boolean = false
            private set
    }

    private var mediaPlayer: MediaPlayer? = null
    private var wakeLock: PowerManager.WakeLock? = null
    private val timeoutHandler = Handler(Looper.getMainLooper())
    private var currentJobId: String? = null

    private val timeoutRunnable = Runnable {
        Log.d(TAG, "Timeout reached for job $currentJobId")
        IncomingJobModule.emitTimeout(currentJobId)
        stopEverything()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_STOP -> {
                stopEverything()
                return START_NOT_STICKY
            }
            else -> {
                val jobId = intent?.getStringExtra(EXTRA_JOB_ID) ?: run {
                    stopSelf()
                    return START_NOT_STICKY
                }
                start(intent, jobId)
                return START_NOT_STICKY
            }
        }
    }

    private fun start(intent: Intent, jobId: String) {
        currentJobId = jobId
        isRunning = true

        acquireWakeLock()

        val notification = IncomingJobNotificationHelper.buildFullScreenNotification(
            context = this,
            jobId = jobId,
            requirementId = intent.getStringExtra(EXTRA_REQUIREMENT_ID) ?: "",
            title = intent.getStringExtra(EXTRA_TITLE) ?: "New Job",
            body = intent.getStringExtra(EXTRA_BODY) ?: "",
            ratePerDay = intent.getStringExtra(EXTRA_RATE_PER_DAY) ?: "",
            customerName = intent.getStringExtra(EXTRA_CUSTOMER_NAME) ?: "",
            location = intent.getStringExtra(EXTRA_LOCATION) ?: "",
            expiresAt = intent.getStringExtra(EXTRA_EXPIRES_AT) ?: "",
        )

        startForeground(NOTIFICATION_ID, notification)

        startRingtone()

        IncomingJobModule.emitIncomingJob(
            jobId = jobId,
            requirementId = intent.getStringExtra(EXTRA_REQUIREMENT_ID) ?: "",
            title = intent.getStringExtra(EXTRA_TITLE) ?: "",
            body = intent.getStringExtra(EXTRA_BODY) ?: "",
            ratePerDay = intent.getStringExtra(EXTRA_RATE_PER_DAY) ?: "",
            customerName = intent.getStringExtra(EXTRA_CUSTOMER_NAME) ?: "",
            location = intent.getStringExtra(EXTRA_LOCATION) ?: "",
            expiresAt = intent.getStringExtra(EXTRA_EXPIRES_AT) ?: "",
        )

        timeoutHandler.removeCallbacks(timeoutRunnable)
        timeoutHandler.postDelayed(timeoutRunnable, TIMEOUT_MS)
    }

    private fun acquireWakeLock() {
        val powerManager = getSystemService(POWER_SERVICE) as PowerManager
        wakeLock = powerManager.newWakeLock(
            PowerManager.PARTIAL_WAKE_LOCK,
            "LabourBaba:IncomingJobWakeLock"
        ).apply {
            setReferenceCounted(false)
            // Safety cap slightly above the ring timeout so a wake lock can never
            // leak forever if something throws before stopEverything() runs.
            acquire(TIMEOUT_MS + 5_000L)
        }
    }

    private fun startRingtone() {
        stopRingtoneOnly() // guard against double-start
        try {
            // res/raw/ringtone.mp3 — same file Notifee's channel used to reference;
            // now MediaPlayer owns playback exclusively so make sure the Notifee
            // channel for this notification has its `sound` set to null/silent to
            // avoid two overlapping audio streams (see IncomingJobNotificationHelper).
            val uri = Uri.parse("android.resource://$packageName/raw/ringtone")
            mediaPlayer = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_NOTIFICATION_RINGTONE)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                setDataSource(this@IncomingJobForegroundService, uri)
                isLooping = true
                setVolume(1.0f, 1.0f)
                setOnPreparedListener { it.start() }
                setOnErrorListener { _, what, extra ->
                    Log.e(TAG, "MediaPlayer error what=$what extra=$extra")
                    true
                }
                prepareAsync()
            }

            // Force the ringtone to play at full audible volume regardless of the
            // user's current media-volume setting, matching Uber/Ola "always loud"
            // behavior. Respects the RING/notification stream so system silent mode
            // is still honored.
            val audioManager = getSystemService(AUDIO_SERVICE) as AudioManager
            val maxVolume = audioManager.getStreamMaxVolume(AudioManager.STREAM_NOTIFICATION)
            audioManager.setStreamVolume(AudioManager.STREAM_NOTIFICATION, maxVolume, 0)
        } catch (e: Exception) {
            Log.e(TAG, "Failed to start ringtone", e)
        }
    }

    private fun stopRingtoneOnly() {
        mediaPlayer?.let {
            try {
                if (it.isPlaying) it.stop()
            } catch (_: IllegalStateException) {
                // already stopped/released — safe to ignore
            }
            it.release()
        }
        mediaPlayer = null
    }

    private fun stopEverything() {
        timeoutHandler.removeCallbacks(timeoutRunnable)
        stopRingtoneOnly()

        wakeLock?.let { if (it.isHeld) it.release() }
        wakeLock = null

        currentJobId?.let {
            IncomingJobNotificationHelper.cancelNotification(this, it)
        }

        isRunning = false
        currentJobId = null

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            stopForeground(STOP_FOREGROUND_REMOVE)
        } else {
            @Suppress("DEPRECATION")
            stopForeground(true)
        }
        stopSelf()
    }

    override fun onDestroy() {
        stopRingtoneOnly()
        wakeLock?.let { if (it.isHeld) it.release() }
        timeoutHandler.removeCallbacks(timeoutRunnable)
        isRunning = false
        super.onDestroy()
    }
}