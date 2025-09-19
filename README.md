<div align="center">
  <picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/icons/logo-darkMode.png" width='220px'>
  <source media="(prefers-color-scheme: light)" srcset="public/icons/logo-lightMode.png" width='220px'>
  <img alt="Foci Logo" src="public/icons/logo-lightMode.png" width='220px'>
</picture>

  <p><strong>🎯 Your Personal Focus & Accountability Partner 🎯</strong></p>
  <p><i>Ditch the procrastination gremlins and crush your goals. Foci helps you stay on track with timed focus sessions, accountability buddies, and group challenges.</i></p>
</div>

[![Deploy to Firebase Hosting on merge](https://github.com/luckygoswami/Foci/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/luckygoswami/Foci/actions/workflows/firebase-hosting-merge.yml)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-yellow.svg)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/luckygoswami/foci)](https://github.com/luckygoswami/foci/releases/latest)

---

Welcome to the Foci repository! This app is designed to be a clean, intuitive, and motivating tool to help you and your friends concentrate on what matters most.

## ✨ Core Features

- **🎯 Focus Timer:** A minimalist, distraction-free timer to help you get into a deep work state.
- **🤝 Buddies & Accountability:** Connect with friends, see who's focusing, and keep each other motivated.
- **👨‍👩‍👧‍👦 Group Sessions:** Create or join groups to tackle shared goals. Perfect for study groups or team projects!
- **🔥 Streaks & Gamification:** Build a focus streak and make productivity a rewarding habit.
- **📊 Progress Insights:** Visualize your work patterns with beautiful charts and see how you're spending your time.
- **📱 Seamless Mobile-First Experience:** Designed to work beautifully on any device.

## 🚀 Tech Stack & Architecture

This project is built with a modern, type-safe, and scalable stack, chosen to create a fantastic developer experience.

| Category     | Technologies                                                                                                                                                               |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | [**React 19**](https://react.dev/) \| [**Vite**](https://vitejs.dev/) \| [**TypeScript**](https://www.typescriptlang.org/) \| [**Tailwind CSS**](https://tailwindcss.com/) |
| **Backend**  | [**Firebase**](https://firebase.google.com/) (Authentication, Firestore, Hosting)                                                                                          |
| **UI/UX**    | [**Shadcn/UI**](https://ui.shadcn.com/) (via `components.json`) \| [**Framer Motion**](https://www.framer.com/motion/) \| [**Recharts**](https://recharts.org/)            |
| **Routing**  | [**React Router**](https://reactrouter.com/) \| `vite-plugin-pages`                                                                                                        |
| **Tooling**  | [**pnpm**](https://pnpm.io/) \| [**ESLint**](https://eslint.org/) \| [**Vitest**](https://vitest.dev/)                                                                     |

### 🏛️ Architectural Philosophy

- **Feature-Sliced Design:** The `src/features` directory organizes code by business domain, making it easy to locate related components, hooks, and services. This keeps the codebase modular and scalable.
- **Component-Driven UI:** A strong emphasis on reusable and composable components, located in `src/components`. We use skeletons for loading states to ensure a smooth user experience.
- **Type Safety:** TypeScript is used throughout the project to catch errors early and improve code quality and maintainability.
- **Centralized Configuration:** Firebase and other configurations are kept in the `src/lib` directory for easy management.

---

## 🏁 Getting Started

Ready to jump in? Follow these steps to get the development environment up and running.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/installation) (recommended) or npm
- A [Firebase](https://firebase.google.com/) project.

### Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/luckygoswami/foci.git
    cd foci
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Configure Firebase:**

    You have two distinct workflows for local development.

    #### Option 1: Using a Real Firebase Project

    - Create a new project on the [Firebase Console](https://console.firebase.google.com/).
    - Create a new Web App in your Firebase project.
    - Copy the Firebase configuration object.
    - Create a `.env` file in the root of the project and paste your config there:

    ```env
    # .env

    VITE_FIREBASE_API_KEY="your-api-key"
    VITE_FIREBASE_AUTH_DOMAIN="your-auth-domain"
    VITE_FIREBASE_PROJECT_ID="your-project-id"
    VITE_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
    VITE_FIREBASE_DATABASE_URL="your-database-url"
    VITE_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
    VITE_FIREBASE_APP_ID="your-app-id"
    ```

    #### Option 2: Using the Firebase Emulator Suite (Recommended)

    - No `.env` file or Firebase project is required for this option. All services run locally.
    - The `dev.js` script will automatically create a mock configuration and handle all emulator setup.

### Available Scripts

- `pnpm dev`:
  - **Runs the development server without emulators.** It connects to your real Firebase project using the configurations from your `.env` file.
  - This command will throw an error if the `.env` file is missing or incomplete.
- `pnpm dev --emulators`:
  - **Runs the development server with the Firebase Emulator Suite.** This is the recommended local development workflow as it requires no internet connection and no real Firebase project.
  - It automatically starts the following emulators: Auth, Firestore, Realtime Database, and App Hosting.
  - The emulator host is set to your machine's local IPv4 address, allowing other devices on your network to connect.
- `pnpm dev --emulators --import <path>`:
  - Starts the emulators and imports data from the specified local path. This is ideal for testing with pre-existing data.
  - Saves the emulator data to the `<path>` directory on exiting emulator.
- `pnpm build`: Bundles the app for production.
- `pnpm preview`: Serves the production build locally.
- `pnpm lint`: Lints the codebase using ESLint.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📜 License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for more information.

---

<div align="center">
  <code>> Engineered by Deepak Goswami.</code>
</div>
