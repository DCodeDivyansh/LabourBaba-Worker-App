import { Platform, Vibration } from "react-native";

// react-native-sound is an optional native dependency. It's wrapped in a
// try/catch so the app doesn't crash if it hasn't been installed/linked yet
// (see README notes at the bottom of IncomingJobScreen for setup steps).
let Sound: any = null;
try {
  Sound = require("react-native-sound").default;
} catch (e) {
  Sound = null;
}

let ringtoneInstance: any = null;

// Uber-style buzz: short-long-pause, repeated until stopped.
const VIBRATION_PATTERN = [0, 400, 200, 400, 600];

export const startRinging = () => {
  // Haptic buzz — works out of the box, no native setup required.
  Vibration.vibrate(VIBRATION_PATTERN, true);

  if (!Sound) {
    console.log(
      "[ringtone] react-native-sound not installed — vibration only. " +
        "Run `npm install react-native-sound` and add ringtone.mp3 to enable audio."
    );
    return;
  }

  try {
    Sound.setCategory("Playback");

    // ringtone.mp3 must be placed in:
    //  Android: android/app/src/main/res/raw/ringtone.mp3
    //  iOS: added to the Xcode project as a bundled resource
    ringtoneInstance = new Sound(
      "ringtone.mp3",
      Platform.OS === "android" ? Sound.MAIN_BUNDLE : undefined,
      (error: any) => {
        if (error) {
          console.log("[ringtone] Failed to load ringtone.mp3:", error.message);
          ringtoneInstance = null;
          return;
        }

        if (ringtoneInstance) {
          ringtoneInstance.setNumberOfLoops(-1); // loop forever, like an incoming call
          ringtoneInstance.setVolume(1.0);
          ringtoneInstance.play((success: boolean) => {
            if (!success) {
              console.log("[ringtone] Playback failed");
            }
          });
        }
      }
    );
  } catch (err) {
    console.log("[ringtone] Unexpected error starting ringtone:", err);
  }
};

export const stopRinging = () => {
  Vibration.cancel();

  if (ringtoneInstance) {
    try {
      ringtoneInstance.stop(() => {
        ringtoneInstance.release();
        ringtoneInstance = null;
      });
    } catch (err) {
      ringtoneInstance = null;
    }
  }
};
