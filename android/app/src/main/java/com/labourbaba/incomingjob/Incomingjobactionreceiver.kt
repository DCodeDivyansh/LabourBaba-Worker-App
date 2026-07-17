package com.labourbaba.incomingjob

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

/**
 * Handles the inline Accept/Reject buttons on the notification itself
 * (as opposed to buttons inside IncomingJobScreen). Works even if the
 * user never opens the app — stops the ringtone/service immediately and
 * emits the decision to JS if the RN bridge is alive, otherwise the JS
 * layer picks it up via getInitialIncomingJobDecision() on next launch.
 */
class IncomingJobActionReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val jobId = intent.getStringExtra(IncomingJobNotificationHelper.EXTRA_JOB_ID) ?: return

        val stopIntent = Intent(context, IncomingJobForegroundService::class.java).apply {
            action = IncomingJobForegroundService.ACTION_STOP
        }
        context.startService(stopIntent)

        when (intent.action) {
            IncomingJobNotificationHelper.ACTION_ACCEPT -> IncomingJobModule.emitDecision(jobId, "accept")
            IncomingJobNotificationHelper.ACTION_REJECT -> IncomingJobModule.emitDecision(jobId, "reject")
        }
    }
}