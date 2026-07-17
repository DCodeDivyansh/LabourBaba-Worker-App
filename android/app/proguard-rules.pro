# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Notifee ProGuard Rules
-keep class com.notifee.** { *; }
-keep class app.notifee.core.** { *; }

# Keep react-native-sound classes
-keep class com.zmxv.RNSound.** { *; }


# android/app/src/main/res/raw/keep.xml — safer than a proguard rule for *resources*

-keep class com.labourbaba.incomingjob.** { *; }
