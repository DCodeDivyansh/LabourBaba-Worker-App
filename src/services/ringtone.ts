import { Vibration } from "react-native";

let Sound: any = null;
try {
  Sound = require("react-native-sound").default;
  console.log("[ringtone] react-native-sound module loaded successfully");
} catch (e) {
  Sound = null;
  console.log("[ringtone] Failed to require react-native-sound:", e);
}

let ringtoneInstance: any = null;

const VIBRATION_PATTERN = [0, 400, 200, 400, 600];

export const startRinging = () => {
  console.log("[ringtone] startRinging() called"); // ⬅ NEW
  Vibration.vibrate(VIBRATION_PATTERN, true);

  if (!Sound) {
    console.log(
      "[ringtone] react-native-sound not installed — vibration only. " +
        "Run `npm install react-native-sound` and add ringtone.mp3 to enable audio."
    );
    return;
  }

  try {
    // ⬅ CHANGED: was "Playback" — "Alarm" maps to a louder, more insistent
    // playback path on both platforms (STREAM_ALARM-style behavior on
    // Android, AVAudioSession "Alarm" behavior on iOS) instead of the
    // regular media stream, which is what makes Uber/Ola-style incoming
    // job rings cut through even when the phone is on a low media volume.
    Sound.setCategory("Alarm");
    console.log("[ringtone] Sound.setCategory('Alarm') succeeded");

    // ⬅ FIXED: this was reversed — Sound.MAIN_BUNDLE is the correct
    // basePath for a bundled sound file on BOTH platforms (on Android it
    // resolves to android/app/src/main/res/raw/, on iOS to the app
    // bundle). Passing `undefined` on iOS meant the file was never found
    // there.
    ringtoneInstance = new Sound(
      "ringtone.mp3",
      Sound.MAIN_BUNDLE,
      (error: any) => {
        if (error) {
          console.log("[ringtone] Failed to load ringtone.mp3:", JSON.stringify(error)); // ⬅ CHANGED: stringify so nested error objects aren't silently blank
          ringtoneInstance = null;
          return;
        }

        console.log("[ringtone] ringtone.mp3 loaded successfully, duration:", ringtoneInstance?.getDuration?.()); // ⬅ NEW

        if (ringtoneInstance) {
          ringtoneInstance.setNumberOfLoops(-1);
          ringtoneInstance.setVolume(1.0);
          ringtoneInstance.play((success: boolean) => {
            console.log("[ringtone] play() callback fired, success:", success); // ⬅ NEW
            if (!success) {
              console.log("[ringtone] Playback failed");
            }
          });
          console.log("[ringtone] play() was called"); // ⬅ NEW — confirms we actually reached this line
        }
      }
    );
  } catch (err) {
    console.log("[ringtone] Unexpected error starting ringtone:", err); // existing, kept
  }
};

export const stopRinging = () => {
  console.log("[ringtone] stopRinging() called"); // ⬅ NEW
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