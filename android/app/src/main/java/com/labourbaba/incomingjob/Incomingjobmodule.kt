package com.labourbaba.incomingjob

import android.content.Intent
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

/**
 * Two-way bridge between the native incoming-job system and JS.
 *
 * Native -> JS: emitIncomingJob/emitTimeout/emitDecision are called from
 * Kotlin (services, receiver) and, if a JS bridge instance is currently
 * alive, immediately fire a DeviceEventEmitter event. If the app was fully
 * killed and the bridge isn't up yet, the payload is cached statically and
 * JS should call getInitialIncomingJob() once IncomingJobContext mounts to
 * pick it up (handles the "cold start from full-screen notification" case).
 *
 * JS -> Native: stopRinging/acceptJob/rejectJob let IncomingJobScreen stop
 * the foreground service the instant the worker responds, instead of
 * waiting for the 30s timeout.
 */
class IncomingJobModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val EVENT_INCOMING_JOB = "onIncomingJob"
        private const val EVENT_TIMEOUT = "onIncomingJobTimeout"
        private const val EVENT_DECISION = "onIncomingJobDecision"

        @Volatile private var instance: IncomingJobModule? = null
        @Volatile private var pendingJob: WritableMap? = null

        private fun buildJobMap(
            jobId: String, requirementId: String, title: String, body: String,
            ratePerDay: String, customerName: String, location: String, expiresAt: String,
        ): WritableMap = Arguments.createMap().apply {
            putString("jobId", jobId)
            putString("requirementId", requirementId)
            putString("title", title)
            putString("body", body)
            putString("ratePerDay", ratePerDay)
            putString("customerName", customerName)
            putString("location", location)
            putString("expiresAt", expiresAt)
        }

        fun emitIncomingJob(
            jobId: String, requirementId: String, title: String, body: String,
            ratePerDay: String, customerName: String, location: String, expiresAt: String,
        ) {
            val map = buildJobMap(jobId, requirementId, title, body, ratePerDay, customerName, location, expiresAt)
            pendingJob = map
            // Build a second copy for the live-emit path since WritableMap can only
            // be consumed once (by either the bridge send or the cached pendingJob read).
            val emitCopy = buildJobMap(jobId, requirementId, title, body, ratePerDay, customerName, location, expiresAt)
            instance?.emit(EVENT_INCOMING_JOB, emitCopy)
        }

        fun emitTimeout(jobId: String?) {
            val map = Arguments.createMap().apply { putString("jobId", jobId ?: "") }
            instance?.emit(EVENT_TIMEOUT, map)
        }

        fun emitDecision(jobId: String, decision: String) {
            val map = Arguments.createMap().apply {
                putString("jobId", jobId)
                putString("decision", decision) // "accept" | "reject"
            }
            instance?.emit(EVENT_DECISION, map)
        }
    }

    init {
        instance = this
    }

    override fun getName() = "IncomingJobModule"

    private fun emit(eventName: String, params: WritableMap) {
        try {
            if (reactContext.hasActiveCatalystInstance()) {
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                    .emit(eventName, params)
            }
        } catch (_: Exception) {
            // Bridge not ready — JS will pick this up via getInitialIncomingJob().
        }
    }

    /** Cold-start recovery: call once on JS mount to consume any job data the
     * native layer already had queued (e.g. app was killed, notification tap
     * launched MainActivity fresh before this module's listeners were attached). */
    @ReactMethod
    fun getInitialIncomingJob(promise: Promise) {
        val job = pendingJob
        pendingJob = null
        promise.resolve(job)
    }

    @ReactMethod
    fun stopRinging() {
        val intent = Intent(reactContext, IncomingJobForegroundService::class.java).apply {
            action = IncomingJobForegroundService.ACTION_STOP
        }
        reactContext.startService(intent)
    }

    @ReactMethod
    fun acceptJob(jobId: String, promise: Promise) {
        stopRinging()
        promise.resolve(true)
    }

    @ReactMethod
    fun rejectJob(jobId: String, promise: Promise) {
        stopRinging()
        promise.resolve(true)
    }

    // Required no-ops so RN's NativeEventEmitter doesn't warn about missing
    // addListener/removeListeners on this module.
    @ReactMethod
    fun addListener(eventName: String) {}

    @ReactMethod
    fun removeListeners(count: Int) {}
}