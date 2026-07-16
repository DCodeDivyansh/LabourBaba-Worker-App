import { Vibration } from 'react-native';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';

// react-native-sound is not compatible with the New Architecture (mandatory
// as of RN 0.82+) — its native module has no TurboModule/Codegen spec, so
// it fails to build entirely. react-native-track-player is actively
// maintained with real New Architecture support and handles looping
// playback more reliably anyway. Use the v4.x line (Apache-2.0, free for
// commercial use) — v5 (published as `@rntp/player`) is commercially
// licensed.

const RINGTONE_TRACK_ID = 'incoming-job-ringtone';
const VIBRATION_PATTERN = [0, 400, 200, 400, 600];

let setupPromise: Promise<void> | null = null;

// TrackPlayer.setupPlayer() must only run once per app session — calling it
// again throws. This caches the in-flight/completed setup so every caller
// can safely await it without duplicating work.
function ensurePlayerSetup(): Promise<void> {
  if (!setupPromise) {
    setupPromise = (async () => {
      try {
        await TrackPlayer.setupPlayer();
      } catch (err) {
        // "already initialized" is expected if setup ran elsewhere first —
        // anything else is a real problem worth seeing in logs.
        console.log('[ringtone] setupPlayer (may already be set up):', err);
      }
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
    })();
  }
  return setupPromise;
}

export const startRinging = async () => {
  console.log('[ringtone] startRinging() called');
  Vibration.vibrate(VIBRATION_PATTERN, true);

  try {
    await ensurePlayerSetup();
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: RINGTONE_TRACK_ID,
      // Bundled JS asset — NOT the android/app/src/main/res/raw copy, which
      // native `require()` can't see. Metro's default assetExts already
      // includes mp3, so this just works.
      url: require('../assets/sounds/ringtone.mp3'),
      title: 'Incoming Job',
      artist: 'LabourBaba',
    });
    await TrackPlayer.play();
    console.log('[ringtone] playback started');
  } catch (err) {
    console.log('[ringtone] Failed to start ringtone playback:', err);
  }
};

export const stopRinging = async () => {
  console.log('[ringtone] stopRinging() called');
  Vibration.cancel();

  try {
    await TrackPlayer.stop();
    await TrackPlayer.reset();
  } catch (err) {
    console.log('[ringtone] stopRinging error:', err);
  }
};