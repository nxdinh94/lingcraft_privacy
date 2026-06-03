# Privacy Policy

Effective date: June 3, 2026

This Privacy Policy applies to the Ling Craft project and app (`Ling Craft`) operated by Nguyen Xuan Dinh as of June 3, 2026.

## 1. Overview

Ling Craft is an English-learning app that supports:

- Account sign-in with email/password, email sign-in links, Google Sign-In, and Sign in with Apple
- AI-assisted text generation, vocabulary help, text-to-speech, and voice vocabulary capture
- Vocabulary collections, saved stories, reading/comprehension content, and app preferences
- Daily reminder notifications
- Rewarded ads and analytics/crash reporting

## 2. Information We Collect

Depending on how you use the app, the app may collect or process:

- Account information, such as your email address, Firebase user ID, display name, profile photo URL, and provider-linked profile data
- Learning profile data, such as your selected native language, English level, generation preferences, onboarding state, daily goals, streak-related fields, token/coin balance, and selected settings
- User-created content, such as prompts you enter, generated stories/paragraphs, saved stories, collected vocabulary words, vocabulary familiarity data, highlights, reading positions, and comprehension activity
- Audio data you choose to record for voice vocabulary features
- Device and app diagnostics, such as crash logs and technical error data
- Analytics data about app usage and navigation events
- Notification preference and scheduling data
- A locally stored anonymous identifier when the app needs a scoped local/Firestore cache before authentication

## 3. How the App Uses Information

The app uses data to:

- Authenticate users and maintain sign-in sessions
- Create and maintain user profiles and default learning data in Firestore
- Sync preferences and vocabulary collections across sessions and devices
- Generate learning content and vocabulary assistance through configured AI services
- Convert text to speech and process voice vocabulary input
- Save local progress, cached content, and saved stories
- Send or schedule local reading reminders
- Measure app usage, improve stability, and diagnose crashes
- Support rewarded ad flows tied to in-app token refills

## 4. Third-Party Services Used by the App

Ling Craft integrates with third-party services including:

- Google Firebase, including Firebase Authentication, Cloud Firestore, Firebase Analytics, and Firebase Crashlytics
- Google Sign-In
- Sign in with Apple
- Google Mobile Ads
- OpenRouter APIs for AI text generation, speech synthesis, and audio transcription/parsing
- `dictionaryapi.dev` for dictionary lookups
- Platform/device translation services through native bridges, which may use downloaded on-device language models depending on platform behavior

These providers may process data according to their own terms and privacy policies.

## 5. Audio and Voice Data

If you use the voice vocabulary feature:

- The app requests microphone permission
- Audio is recorded only when you start the recording feature
- Recorded audio is processed for vocabulary transcription/parsing
- Recorded audio may be sent to external transcription services used by the app

If you do not use this feature, the app does not need your microphone input.

## 6. AI-Generated Content and Prompts

When you use generation, explanation, vocabulary review, word meaning, speech, or related AI features:

- Your prompts, selected words, text content, or recorded voice-derived text may be sent to OpenRouter-backed models
- Generated output may be stored locally and, in some cases, linked to your app state or Firestore-backed profile/preferences

Do not submit sensitive personal data, financial data, health data, or other confidential information into AI prompts or voice inputs unless you are comfortable sharing that information with the relevant service providers.

## 7. Ads

The app initializes Google Mobile Ads and includes rewarded ad flows. Rewarded ads may be used to grant additional in-app tokens. Ad providers may collect device and usage data according to their own policies.

## 8. Local Storage

The app stores data on your device using local storage tools such as secure storage and app preferences. Local storage may include:

- Sign-in helper data, including pending email-link sign-in state
- OpenRouter API token values configured for the app
- Settings and display preferences
- Saved stories/history
- Vocabulary collections and cached familiarity state
- Reading offsets and other local progress/cache data
- Anonymous scoped local identifier data

Some local data may be cleared on sign-out. Remote account data is not automatically deleted when you sign out.

## 9. Firestore / Remote Account Data

When you authenticate, the app may create or update remote account and learning records linked to your profile.

This data is used to persist your learning profile and related app functionality.

## 10. Notifications

If notifications are enabled, the app may request notification permission and schedule local reminders on your device.

## 11. Security

The app uses platform secure storage for certain sensitive local values and relies on Firebase and other third-party providers for parts of authentication, storage, analytics, and diagnostics. No method of transmission or storage is completely secure, and absolute security cannot be guaranteed.

## 12. Children

This repository does not currently include a separate child-directed privacy workflow or age-gating flow. If you distribute the app to children or in child-directed markets, additional review and compliance work may be required before release.

## 13. Data Retention

Data may be retained:

- Locally on your device until you remove it, sign out, clear app data, or uninstall the app
- In Firebase/other connected services for as long as needed for app operation, account continuity, diagnostics, legal compliance, or until deleted by Nguyen Xuan Dinh

The app may not include a full in-app account deletion workflow.

## 14. Your Choices

You can generally:

- Choose whether to sign in
- Control whether you use microphone-based features
- Control notification permission through device settings
- Sign out to clear certain local user data on the device
- Avoid entering sensitive information into prompts or voice features

## 15. International Processing

Because the app uses third-party cloud providers, your data may be processed outside your country or region, subject to those providers' infrastructure and policies.

## 16. Changes to This Policy

This Privacy Policy may be updated when the app's data practices change. Revised versions should include a new effective date.

## 17. Contact

Ling Craft is operated by Nguyen Xuan Dinh.

For privacy or support questions, contact:

- Email: `nguyenxuandinh336@gmail.com`
- Phone: `0384566800`
