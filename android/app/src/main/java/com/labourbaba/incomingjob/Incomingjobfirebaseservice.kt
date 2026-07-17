package com.labourbaba.incomingjob

import android.content.Intent
import android.os.Build
import android.util.Log
import androidx.core.content.ContextCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

/**
 * Receives HIGH PRIORITY FCM **data** messages for incoming jobs.
 *
 * IMPORTANT: the backend must send this as a data-only message (no "notification"
 * block). Data-only messages always reach onMessageReceived, even when the app is
 * killed — a "notification" block would let the OS auto-display a tray notification
 * and skip this class entirely when the app is backgrounded, which breaks the
 * foreground-service / full-screen / MediaPlayer flow this system depends on.
 *
 * Register this in AndroidManifest.xml (see AndroidManifest-CHANGES.xml).
 */
class IncomingJobFirebaseService : FirebaseMessagingService() {

    companion object {
        private const val TAG = "IncomingJobFCM"
        const val TYPE_INCOMING_JOB = "incoming_job"
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)

        val data = remoteMessage.data
        Log.d(TAG, "onMessageReceived: $data")

        if (data["type"] != TYPE_INCOMING_JOB) {
            // Not a job dispatch — ignore. Other data message types (chat, generic
            // alerts, etc.) should be handled elsewhere, not in this class.
            return
        }

        val jobId = data["jobId"] ?: run {
            Log.w(TAG, "Missing jobId, dropping message")
            return
    }
        val requirementId = data["requirementId"] ?: ""
        val title = data["title"] ?: "New Job"
        val body = data["body"] ?: ""
        val ratePerDay = data["ratePerDay"] ?: ""
        val customerName = data["customerName"] ?: ""
        val location = data["location"] ?: ""
        val expiresAt = data["expiresAt"] ?: ""

        val serviceIntent = Intent(this, IncomingJobForegroundService::class.java).apply {
            action = IncomingJobForegroundService.ACTION_START
            putExtra(IncomingJobForegroundService.EXTRA_JOB_ID, jobId)
            putExtra(IncomingJobForegroundService.EXTRA_REQUIREMENT_ID, requirementId)
            putExtra(IncomingJobForegroundService.EXTRA_TITLE, title)
            putExtra(IncomingJobForegroundService.EXTRA_BODY, body)
            putExtra(IncomingJobForegroundService.EXTRA_RATE_PER_DAY, ratePerDay)
            putExtra(IncomingJobForegroundService.EXTRA_CUSTOMER_NAME, customerName)
            putExtra(IncomingJobForegroundService.EXTRA_LOCATION, location)
            putExtra(IncomingJobForegroundService.EXTRA_EXPIRES_AT, expiresAt)
        }

        // startForegroundService is required from O+ since this may be invoked while
        // the app is killed/backgrounded and a plain startService() would be blocked
        // in the background-execution limits introduced in Android 8.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ContextCompat.startForegroundService(this, serviceIntent)
        } else {
            startService(serviceIntent)
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        // Your existing token-refresh handling (upload to backend) should already be
        // wired elsewhere via @react-native-firebase/messaging's onTokenRefresh — no
        // change needed here unless you want native-side token sync too.
        Log.d(TAG, "onNewToken: $token")
    }
}