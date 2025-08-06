# Zanyengo👋

Zanyengo is the weather app for DCCMS.

## Get started with a development build

1. Install dependencies

   ```bash
   npm install
   ```
2. Set environment variables

   ```bash
   cp .env.sample .env
   # Set the variables as required in your preferred editor
   # For example I use Vim and I would have the following
   vim .env
   ```

3. Create a development build

- Ensure that you have setup the relevant build environment for an android|ios emulator.

- ios: Use xcode to download the latest version of ios and create an iPhone emulator device.
- android: Install Android Studio, download latest android SDK and create an android phone emulator device.

   ```bash
   npx expo run:android|ios
   ```

4. Start the app

   ```bash
    npx expo start
   ```

- In the output, you'll find options to open the app in a

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Build a test version
This guide will help you generate a signed APK for development or testing purposes using Android Studio.

---

### Prerequisites
1. **Android Studio** installed on your machine.
2. Your project is open in Android Studio.
3. A **keystore file** for signing (if you don't have one, this guide includes steps to create it).

---

### Steps to Build a Signed APK

#### 1. Open Your Project in Android Studio
- Launch Android Studio.
- Open the project you want to build.

---

#### 2. Create or Locate a Keystore File
##### Option A: If You Already Have a Keystore
- Locate your existing keystore file (e.g., `my-release-key.jks`).

##### Option B: If You Need to Create a Keystore
1. Go to **Build > Generate Signed Bundle / APK**.
2. Choose **APK** and click **Next**.
3. Click **Create New...** under the "Key store path."
4. Fill in the details:
   - **Key store path**: Choose a location to save your `.jks` file.
   - **Password**: Set a secure password.
   - **Key alias**: Enter an alias name for your key.
   - **Key password**: Set a password for the key.
   - **Validity**: Set the validity period in years (e.g., 25).
   - **Certificate details**: Fill in your personal or organizational details.
5. Click **OK** to create the keystore.

---

#### 3. Configure APK Signing
1. Go to **Build > Generate Signed Bundle / APK**.
2. Choose **APK** and click **Next**.
3. Under **Key store path**, browse and select your keystore file.
4. Enter the **Key store password**, **Key alias**, and **Key password**.
5. Choose the build variant (e.g., `debug` or `release`) and click **Next**.

---

#### 4. Set Build Options
1. **Destination Folder**: Specify where the APK should be saved.
2. **Signature Versions**: Ensure both **V1 (Jar Signature)** and **V2 (Full APK Signature)** are checked.
3. Click **Finish**.

---

#### 5. Wait for the Build Process
- Android Studio will start building the APK.  
- Once the process is complete, a confirmation dialog will appear with the location of the signed APK.

---

#### 6. Locate Your Signed APK
1. Navigate to the output directory specified during the build process.
2. The signed APK will typically be located under the `/app/release` or `/app/debug` folder.

---

### Troubleshooting
1. **Signing Errors**:
   - Ensure passwords for the keystore and key alias are correct.
   - Verify the keystore file path.
2. **Build Failures**:
   - Check for missing dependencies or build.gradle misconfigurations.
3. **Unsupported Signature Version**:
   - Ensure your Android Gradle plugin is updated to the latest version.

---

### Next Steps
- Install the APK on a device for testing:
  ```bash
  adb install path-to-apk.apk
  ```

## Release to Google Play store

### Prerequisites
Before starting, ensure you have:
1. A **Google Play Developer Account**.  
   - [Sign up here](https://play.google.com/console/signup).
2. A fully developed app in release-ready APK or AAB format.
3. A **Privacy Policy URL** (if required).
4. Basic app details such as app name, description, and graphics.
5. A prepared **store listing**, including icons, screenshots, and feature graphics.
6. A signed app bundle or APK. [Learn about app signing](https://developer.android.com/studio/publish/app-signing).
7. Payment details (if the app will have in-app purchases or a price).

---

### Steps to Upload Your App

#### 1. Sign In to Google Play Console
- Visit the [Google Play Console](https://play.google.com/console/).
- Log in using your Developer Account credentials.

#### 2. Create a New App
1. Click **"Create App"** in the Google Play Console dashboard.
2. Fill in the following details:
   - App name
   - Default language
   - Application type (App or Game)
   - Free or Paid
3. Agree to Google Play's developer policies and click **Create**.

#### 3. Configure Store Listing
1. **Product Details**:
   - App title, short description, and full description.
2. **Graphic Assets**:
   - Upload high-quality images:
     - App icon (512x512 pixels, PNG format)
     - Screenshots for phone, tablet, or other devices
     - Feature graphic (1024x500 pixels)
3. **Categorization**:
   - Choose the appropriate category (e.g., Entertainment, Productivity).
   - Add tags for better discoverability.
4. **Contact Details**:
   - Provide a valid support email address.
5. **Privacy Policy**:
   - Add the URL for your app's privacy policy.

#### 4. Upload Your App Bundle or APK
1. Navigate to the **"Production"** section in the left-hand menu.
2. Click **"Create New Release"** under the Production track.
3. Upload your signed AAB or APK file.
4. Provide a release name and notes (e.g., version number and highlights of the release).

#### 5. Set App Content
1. Go to **App Content** in the left menu.
2. Fill out the required sections:
   - Content Rating (answer a questionnaire).
   - Target Audience and Age Group.
   - Ads Declaration (if your app contains ads).
   - Data Safety (list data collected by the app).
   - Permissions Declaration (if your app uses sensitive permissions).

#### 6. Set Pricing and Distribution
1. Navigate to the **"Pricing & Distribution"** section.
2. Select whether the app is free or paid (you cannot change this later).
3. Choose the countries or regions where you want your app to be available.
4. Enable or disable app availability for specific devices (e.g., tablets).

#### 7. Review and Publish
1. Double-check all information and settings.
2. Click **"Review Release"** to validate your app.
3. Resolve any issues or warnings flagged by Google Play Console.
4. Once all issues are resolved, click **"Start Rollout to Production"**.
5. Confirm your submission.

---

### After Publishing
1. **Review Process**:
   - Google typically takes a few hours to a few days to review your app.
2. **Monitor Status**:
   - Check the app's status in the **Dashboard**.
3. **Update Your App**:
   - For future updates, repeat the steps under "Upload Your App Bundle or APK."

---

### Troubleshooting
- **Common Errors**:
  - Invalid APK/AAB: Ensure your app is signed and matches Play Store requirements.
  - Missing Privacy Policy: Include a valid URL in the **Store Listing** section.
- Refer to the [Google Play Console Help Center](https://support.google.com/googleplay/android-developer/) for additional assistance.

---

### Contributing
Feel free to submit issues or pull requests if you find something missing or need clarification in this guide.

Happy publishing! 🎉
