// react-native-track-player requires a registered playback service on
// Android — it backs the foreground service that keeps audio alive. We
// don't need remote/lock-screen controls for the incoming-job ringtone, so
// this just satisfies the registration requirement.
module.exports = async function trackPlayerService() {};