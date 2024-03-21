# Weather App

This is a [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

## Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup?guide=native) instructions till "Creating a new application" step, before proceeding.

Install at least version `v20.9.0` of node before proceeding.

## Step 0: Download the code

```bash
git clone git@github.com:Malawi-DCCMS/weather-app.git
cd weather-app
```

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# this will take a long time when starting from a newly cloned repo
npm install
npm start
```

## Step 2: Start your Application

You can now press `i` or `a` to run the app in a simulator OR run the simulator in a separate terminal, like so:

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
npm run android
```

### For iOS

```bash
npm run ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Building your app
## Build your app from Android Studio
To generate debug or release APKs for testing purposes using Android Studio please follow the steps outlined [here](https://code.tutsplus.com/how-to-generate-apk-and-signed-apk-files-in-android-studio--cms-37927t).

## Build your app from the command line

bookmark\_borderbookmark Stay organized with collections Save and categorize content based on your preferences.

*   In this section
*   Build and deploy an APK
    *   Build a debug APK
    *   Build a release bundle or APK
    *   Deploy your app to the emulator
    *   Deploy your app to a physical device
*   Sign your app from command line
    *   Sign your app manually from the command line

You can execute all the build tasks available to your Android project using the `Gradle wrapper` command line tool. It's available as a batch file for Windows (`gradlew.bat`) and a shell script for Linux and Mac (`gradlew.sh`), and it's accessible from the root of each project you create with Android Studio.

To run a task with the wrapper, use one of the following commands from a Terminal window (from Android Studio, select **View > Tool Windows > Terminal**):

* On Windows:
```bash    
gradlew task-name
```
    
* On Mac or Linux:
```bash
./gradlew task-name
```

To see a list of all available build tasks for your project, execute `tasks`:

```bash
gradlew tasks
```

Build and deploy an APK
-----------------------

### Build a debug APK

For immediate app testing and debugging, you can build a debug APK. The debug APK is signed with a debug key provided by the SDK tools and allows debugging through `adb`

To build a debug APK, open a command line and navigate to the root of your Android project directory. To initiate a debug build, invoke the `assembleDebug` task:

```bash
gradlew assembleDebug
```

This creates an APK named `module_name-debug.apk` in `project_name/module_name/build/outputs/apk/`. The file is already signed with the debug key and aligned with [`zipalign`](/tools/help/zipalign), so you can immediately install it on a device.

Or to build the APK and immediately install it on a running emulator or connected device, instead invoke `installDebug`:

```bash
gradlew installDebug
```

### Build a release bundle or APK

When you're ready to release and distribute your app, you must build a release bundle or APK that is signed with your private key. For more information, go to the section about how to sign your app from the command line.

### Deploy your app to the emulator

To use the Android Emulator, you must create an Android Virtual Device (AVD) using Android Studio.

Once you have an AVD, start the Android Emulator and install your app as follows:

1.  In a command line, navigate to `android_sdk/tools/` and start the emulator by specifying your AVD:
    ```bash
    emulator -avd avd\_name
    ```
    
    If you're unsure of the AVD name, execute `emulator -list-avds`.
    
2.  Now you can install your app using either one of the Gradle install tasks mentioned in the section about how to build a debug APK or the `adb` tool.
    ```bash
    adb install path/to/your\_app.apk
    ```
    
    All APKs you build are saved in `project_name/module_name/build/outputs/apk/`.

### Deploy your app to a physical device

Before you can run your app on a device, you must enable **USB debugging** on your device. You can find the option under **Settings > Developer options**.

**Note:** On Android 4.2 and newer, **Developer options** is hidden by default. To make it available, go to **Settings > About phone** and tap **Build number** seven times. Return to the previous screen to find **Developer options**.

Once your device is set up and connected via USB, you can install your app using either the Gradle install tasks mentioned in the section about how to build a debug APK or the adb tool:
```bash
adb -d install path/to/your\_app.apk
```

All APKs you build are saved in `project_name/module_name/build/outputs/apk/`.

For more information, see [Run Apps on a Hardware Device](/studio/run/device).

### Sign your app manually from the command line

If you want to sign an app bundle from the command line, you can use `jarsigner` If instead you want to sign an APK, you need to use `zipalign` and `apksigner` as described below.

1.  Open a command line—from Android Studio, select **View > Tool Windows > Terminal**—and navigate to the directory where your unsigned APK is located.
2.  Align the unsigned APK using `[zipalign](/studio/command-line/zipalign)`:
    ```bash
    zipalign -v -p 4 my-app-unsigned.apk my-app-unsigned-aligned.apk
    ```
    
    `zipalign` ensures that all uncompressed data starts with a particular byte alignment relative to the start of the file, which may reduce the amount of RAM consumed by an app.
    
3.  Sign your APK with your private key using `apksigner`
    ```bash
    apksigner sign --ks my-release-key.jks --out my-app-release.apk my-app-unsigned-aligned.apk
    ```
    
    This example outputs the signed APK at `my-app-release.apk` after signing it with a private key and certificate that are stored in a single KeyStore file: `my-release-key.jks`.
    
    The `apksigner` tool supports other signing options, including signing an APK file using separate private key and certificate files, and signing an APK using multiple signers. For more details, see the `apksigner` reference.
    
    **Note:** To use the `apksigner` tool, you must have revision 24.0.3 or higher of the Android SDK Build Tools installed. You can update this package using the `SDK Manager`.
    
4.  Verify that your APK is signed:
    ```bash
    apksigner verify my-app-release.apk
    ```

To learn more about building using the command-line please go [here](https://developer.android.com/build/building-cmdline).

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
