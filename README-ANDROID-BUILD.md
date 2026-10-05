# نور المسلم — Android background audio build

This project wraps the current Quran audio web UI in a native Android shell.
The Android side provides:
- Foreground media playback service that survives Activity finish/back navigation.
- Media notification with previous / play-pause / next / stop.
- Local native MP3 storage for offline playback.
- Native download queue used by the web UI inside the APK.
- Android back handling: inside the surah/reciter modal it goes back to the main screen; on the main screen it finishes the Activity without stopping the playback service.

Build requirements: Android Studio with the Android SDK installed. The project targets SDK 36, min SDK 23, AGP 9.3.0, compatible with Gradle 9.5+.

Important: this environment does not have the Android SDK/build tools installed, so an APK could not be compiled here. The source project is complete for opening/building in Android Studio.
