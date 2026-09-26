# CREATE & EARN - App Store & Google Play Store Publishing Guide

This app is built with a responsive, mobile-first Progressive Web App (PWA) architecture and pre-configured for **Capacitor** and **Trusted Web Activities (TWA)**.

---

## 1. What You Need Before You Start

| Requirement | Google Play Store | Apple App Store |
| :--- | :--- | :--- |
| **Developer Account** | $25 USD one-time fee at [play.google.com/console](https://play.google.com/console) | $99 USD/year at [developer.apple.com](https://developer.apple.com) |
| **Identity Verification** | Government ID (National NRC / Passport) + Phone | Government ID + Phone |
| **File Format** | Android App Bundle (`.aab`) | iOS App Archive (`.ipa`) via Xcode |
| **Assets Needed** | App Icon (512x512 PNG), Feature Graphic (1024x500 PNG), Screenshots | App Icon (1024x1024 PNG), iPhone Screenshots |

---

## 2. Google Play Store (Android) – Two Simple Options

### Option A: 10-Minute Export via PWABuilder (No Code / Fastest)
Because CREATE & EARN already has a validated PWA manifest (`manifest.webmanifest`), service workers, and standalone icons:
1. Copy your deployed web app URL:  
   `https://ais-pre-m76bz66lpsfmzge6k4kpsc-254530879519.europe-west2.run.app`
2. Go to **[PWABuilder.com](https://www.pwabuilder.com)** and enter your app URL.
3. Click **"Package for Stores"** ➔ Select **Google Play (Android)**.
4. Fill in:
   - Package ID: `com.createearn.app`
   - App Name: `CREATE & EARN`
5. Download the generated `.aab` (Android App Bundle).
6. Go to **Google Play Console** ➔ **Create App** ➔ **Production** ➔ Upload the `.aab` file.
7. Fill out the store listing, privacy policy, and submit for Google review (usually takes 24–72 hours).

### Option B: Native Build via Capacitor CLI
```bash
# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize and sync
npx cap init "CREATE & EARN" com.createearn.app
npm run build
npx cap add android
npx cap sync

# 3. Open in Android Studio to generate signed APK/AAB
npx cap open android
```
In Android Studio: Click **Build > Generate Signed Bundle / APK** ➔ Upload to Google Play Console.

---

## 3. Apple App Store (iOS)

Apple requires all App Store apps to be compiled with Xcode.

### Steps:
1. Enroll in the **[Apple Developer Program](https://developer.apple.com)** ($99/year).
2. Install Capacitor iOS:
   ```bash
   npm install @capacitor/ios
   npm run build
   npx cap add ios
   npx cap sync
   npx cap open ios
   ```
3. Xcode will open the native iOS project.
4. Select your Development Team in Xcode signing settings.
5. In Xcode, click **Product > Archive**.
6. Click **Distribute App** ➔ **App Store Connect**.
7. In [appstoreconnect.apple.com](https://appstoreconnect.apple.com):
   - Add app description, age rating, and upload iPhone 6.5" and 5.5" screenshots.
   - Submit for Apple App Review (usually approved within 24–48 hours).

---

## 4. Privacy Policy & Store Listing Requirements

Google Play and Apple App Store require a live **Privacy Policy URL**.
- Both stores will test the app: they require demo login credentials (e.g. `test@createearn.com` / `password123`) in the App Review Notes so store testers can experience the full app.
- Both stores require account deletion capability (already built into user profiles in accordance with App Store guideline 5.1.1).
