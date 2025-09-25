# BlogPlatform

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.1.5.

## Prerequisites

- Node.js LTS
- A Firebase project (for authentication). Create one at https://console.firebase.google.com/

## Environment configuration

Environment files are intentionally git‑ignored. To set up local Firebase config:

1. Copy `src/environments/environment.example.ts` to `src/environments/environment.ts`.
2. Replace the placeholder values with your real Firebase web app credentials (Project settings > General > Your apps > Web app config).
3. (Optional) Create `src/environments/environment.prod.ts` with production credentials if they differ.

Example (already in the example file):
```ts
export const environment = {
  firebaseConfig: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project',
    storageBucket: 'your-project.firebasestorage.app',
    messagingSenderId: '000000000000',
    appId: '1:000000000000:web:abcdef123456',
    measurementId: 'G-XXXXXXX'
  }
};
```

Never commit real credentials. If you accidentally commit `environment.ts`, remove it from git history (e.g. with `git rm` and a filter‑rewrite) and re‑generate keys in the Firebase console if necessary.

## Authentication flows

The app includes a minimal email/password auth flow using Firebase Authentication:

- `AuthService` wraps registration, login, logout and exposes:
  - `user$`: raw Firebase user (nullable)
  - `userInfo$`: simplified user object for templates
  - `isAuthenticated$`: boolean stream
  - `loading$`, `error$`: ui state helpers
- Routes that require auth use `authGuard` (e.g. create/edit post routes).
- `AuthComponent` handles both login and registration (mode switches via route data or toggle link).

To extend auth (password reset, email verification, OAuth providers), add the relevant Firebase methods inside `AuthService` and surface new UI actions.

## Development server

To start a local development server, run:

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will auto‑reload on source changes.

## Code scaffolding

Generate a new component:

```bash
ng generate component component-name
```

List schematic help:

```bash
ng generate --help
```

## Building

Build the project:

```bash
ng build
```

Artifacts are emitted to `dist/`. The production build is optimized.

## Running unit tests

Execute unit tests with Karma/Jasmine:

```bash
ng test
```

(If running in a CI/headless environment you may configure ChromeHeadless in `karma.conf.js`).

## Running end-to-end tests

There is no e2e framework bundled. You can add Playwright or Cypress (recommended) and create separate environment configs as needed.

## Next steps / ideas

- Add Firestore for storing posts and comments
- Add role-based authorization (e.g. only authors can edit their posts)
- Add password reset & email verification flows
- Add lazy loaded feature routes for performance
- Improve accessibility & add dark mode

## Additional Resources

See the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) for more details.
