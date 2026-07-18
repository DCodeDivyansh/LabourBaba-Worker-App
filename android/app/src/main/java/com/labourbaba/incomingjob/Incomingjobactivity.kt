package com.labourbaba.incomingjob

import android.app.KeyguardManager
import android.content.Intent
import android.os.Build
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.labourbaba.MainActivity // ⬅ adjust if your ReactActivity class/package differs

/**
 * This is the Activity the full-screen notification's PendingIntent launches.
 * It is intentionally NOT the React Native screen itself — its only job is to:
 *   1. Force the screen on and dismiss the keyguard (show-over-lock-screen).
 *   2. Hand the job payload to the existing MainActivity/RN bridge.
 *   3. Finish immediately, so there's no second Activity lingering in the
 *      back stack and your existing React Navigation stack stays authoritative.
 *
 * MainActivity (React Native side) is responsible for actually rendering
 * IncomingJobScreen — see IncomingJobModule.getInitialIncomingJob() and the
 * DeviceEventEmitter "onIncomingJob" event this triggers.
 */
class IncomingJobActivity : AppCompatActivity() {

    companion object {
        const val EXTRA_JOB_ID = "extra_job_id"
        const val EXTRA_REQUIREMENT_ID = "extra_requirement_id"
        const val EXTRA_TITLE = "extra_title"
        const val EXTRA_BODY = "extra_body"
        const val EXTRA_RATE_PER_DAY = "extra_rate_per_day"
        const val EXTRA_CUSTOMER_NAME = "extra_customer_name"
        const val EXTRA_LOCATION = "extra_location"
        const val EXTRA_EXPIRES_AT = "extra_expires_at"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        showOverLockScreenAndWake()

        val forwardIntent = Intent(this, MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                Intent.FLAG_ACTIVITY_REORDER_TO_FRONT or
                Intent.FLAG_ACTIVITY_SINGLE_TOP
            // Same keys IncomingJobModule.getInitialIncomingJob() reads on cold
            // start, and the same keys the "onIncomingJob" JS event carries.
            putExtras(intent.extras ?: Bundle())
            action = IncomingJobFirebaseService.TYPE_INCOMING_JOB
        }
        startActivity(forwardIntent)
        overridePendingTransition(0, 0)

        finish()
        overridePendingTransition(0, 0)
    }

    private fun showOverLockScreenAndWake() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O_MR1) {
            setShowWhenLocked(true)
            setTurnScreenOn(true)
            val keyguardManager = getSystemService(KEYGUARD_SERVICE) as KeyguardManager
            keyguardManager.requestDismissKeyguard(this, null)
        } else {
            @Suppress("DEPRECATION")
            window.addFlags(
                android.view.WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    android.view.WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                    android.view.WindowManager.LayoutParams.FLAG_DISMISS_KEYGUARD or
                    android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
            )
        }
    }
}