# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.8.0] - 2025-09-08

### Features

- **PWA:** Converted the application to a full Progressive Web App with a custom service worker. (`0f3a8672`)
- **PWA:** Added a custom, non-intrusive modal to prompt users to install the app. (`f67ff736`)
- **CI/CD:** Implemented a GitHub Actions workflow for automatic deployments to Firebase Hosting. (`fecfb0dd`)
- **UI:** Added the app version number, visible on hover over the main title. (`fecfb0dd`)

### Bug Fixes

- **Assets:** Corrected avatar image paths to ensure they load correctly in the production build. (`4f960579`)
- **UI:** Fixed inconsistent padding on several icons across different viewports. (`9970476a`)
- **UI:** Prevented layout shifts caused by modal dialogs appearing. (`f4089cbd`)
- **Auth:** Ensured users are redirected to their intended page after a successful signup. (`a57f3550`)
- **Styling:** Prevented layout shifts during initial page load caused by font loading. (`71cf4aee`)

### Documentation

- Added `README.md`, `LICENSE`, and `CONTRIBUTING.md` to establish community standards. (`f34a856a`)

---

## [1.7.0] - 2025-09-04

### Features

- **UI:** Implemented a mobile-first layout for the desktop view for a consistent experience. (`14ede1cc`)
- **UI:** Added skeleton loading screens for a smoother perceived performance on:
  - User Profile sections (`480c3a04`)
  - Group Details Page (`762592a8`)
  - Groups & Group Invites lists (`92ce6602`, `560e748c`)
  - Buddies & Friend Requests lists (`c78d987a`, `d6a6399b`)
  - Homepage Charts (`473aa72b`)
  - Progress Page Charts (`5736d0c3`)
  - Friends Invite Modal (`2a055eef`)
- **UI:** Created a custom 3D "Fire" icon to represent active and broken streaks. (`be02a263`)

### Bug Fixes

- **Groups:** Ensured the group list is automatically updated after joining a group from an invite. (`36af9230`)
- **Sessions:** Cleared the current session context on user change to prevent data leakage between accounts. (`515ac859`)

---

## [1.6.0] - 2025-08-31

### Features

- **UI:** Added an `EmptyData` component with clear calls-to-action for empty buddy and group lists. (`12b4a493`)
- **Search:** Implemented a global, animated search bar with a results dropdown for users and groups. (`e303aa53` to `d1813edd`)
- **Profile:** Users can now view their own profile details from the account page or search. (`b3896f28`)
- **Buddies:** Implemented the full friend request lifecycle: send, accept, reject, and unfriend actions. (`93d13a3b`)

### Improvements

- **Styling:** Enhanced the UI/UX for the buddies page, group cards, request/invite lists, and subject selection dialog to match the application's theme. (`58ec8bc7` to `3a6418d5`)
- **Data:** Combined progress results for subjects with different character cases into a single entry. (`2f366ff2`)

---

## [1.5.0] - 2025-08-28

### Features

- **Feedback:** Implemented success and error toasts for all major features (Auth, Sessions, Buddies, Groups, etc.) using `react-hot-toast`. (`2b47fdc4` to `08a7b107`)
- **Auth:** Added email verification before a user can proceed with the onboarding flow. (`d23a2fae`)
- **Auth:** Implemented "show/hide password" and "forgot password" functionality. (`89f1dd61`, `b25fcc8e`)
- **Onboarding:** Created a multi-step onboarding wizard for new users to set their username and avatar. (`0a216a55`)

### Improvements

- **Charts:** Improved chart styling and data fetching to be on a weekly basis for better progress comparison. (`4c52b2d2`)
- **UI:** Created a shared `Header` component for consistent page titles. (`35e1dae2`)
- **Hooks:** Added a `useOnlineAction` hook to prevent actions when the user is offline. (`a1f16aa2`)

---

## [1.0.0] - 2025-07-18

### Features

- **Authentication:** Full user authentication including signup, login, and logout. (`a7102aae`)
- **Real-time Sessions:** Core functionality for starting, pausing, and ending study sessions with real-time updates. (`05a7376c`)
- **Session Conflict:** Implemented a dialog to resolve session conflicts if a session is active on another device. (`700efc37`)
- **Streak Tracking:** Added logic to calculate and display user study streaks. (`0ea93cf3`)
- **Groups & Buddies:** Initial implementation of group and friend management services. (`7e6baa50`, `93da9a42`)
- **Data Visualization:** Implemented charts for daily/weekly goals and subject progress. (`6c5b5b6c`)
- **Routing & Layout:** Set up the main application layout, navigation, and routing structure. (`774c823a`)

### Bug Fixes

- **Sessions:** Resolved a circular import dependency that caused page reloads. (`4d747c9d`)
- **Sessions:** Fixed an issue where session duration was not calculated correctly when the app was idle. (`9055e4b1`)

### Initial Release

- **Project Setup:** Initialized the project with React, TypeScript, Vite, Shadcn, and Tailwind CSS. (`12618acf`)
- **Firebase:** Added initial Firebase configuration and emulator connections. (`36222ed4`)
