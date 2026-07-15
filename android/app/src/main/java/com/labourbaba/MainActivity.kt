package com.labourbaba

import android.os.Build
import android.os.Bundle
import android.view.WindowManager
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    RNBootSplash.init(this, R.style.BootTheme)
    // ⬅ FIXED: must be `null`, not `savedInstanceState` — this is a
    // documented requirement of react-native-bootsplash v6/v7. Passing the
    // real saved state here conflicts with how ReactActivity restores its
    // Fragment on cold start and crashes the app immediately after launch.
    super.onCreate(null)

    // ⬅ NEW: lets an incoming-job full-screen notification (see
    // notifee.ts's fullScreenAction) pop this activity straight over the
    // lock screen, the same way an incoming call does. The manifest's
    // android:showWhenLocked/turnScreenOn attributes cover API 27+; this
    // is the equivalent for API 24-26 (this app's minSdkVersion is 24).
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O_MR1) {
      window.addFlags(
        WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
          WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
          WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
      )
    }
  }

  override fun getMainComponentName(): String = "LabourBaba"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
