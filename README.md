<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# SmartInvoice AI - Progressive Web App

This contains everything you need to run your app locally and install it as a Progressive Web App (PWA) on any device.

View your app in AI Studio: https://ai.studio/apps/temp/1

## 📱 PWA Features

This app can be installed on your device and used like a native app with:
- **Offline Support**: Works without internet connection
- **Install on Any Device**: Desktop, mobile, or tablet
- **Fast Loading**: Service worker caches assets for instant loading
- **App-like Experience**: Runs in standalone mode without browser UI
- **Auto Updates**: Automatically updates when new versions are available

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 🚀 Install as PWA

### Desktop (Chrome, Edge, Brave)
1. Run the app (`npm run dev`)
2. Click the install icon (⊕) in the address bar
3. Click "Install" in the popup

### Mobile (Android/iOS)
1. Open the app in your mobile browser
2. **Android**: Tap the menu (⋮) → "Install app" or "Add to Home Screen"
3. **iOS**: Tap Share (⎙) → "Add to Home Screen"

## 📦 Build for Production

```bash
npm run build
npm run preview
```

The built PWA will be in the `dist` folder, ready to deploy to any static hosting service.

## 🎨 Customize App Icon

To use your own app icon:
1. Replace `public/icons/icon.svg` with your design
2. Run `node generate-icons.js` to generate all sizes
3. Rebuild the app
