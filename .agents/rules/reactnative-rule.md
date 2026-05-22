---
trigger: always_on
---

# Antigravity Rules - Eshkul React Native App

This file defines the strict guidelines, patterns, and principles to be followed when developing, refactoring, or editing files in the Eshkul React Native project.

---

## 1. Strict Localization & Translation (No Hardcoded Strings)
- **Zero Tolerance for Hardcoded Strings:** Absolutely no user-facing text strings should be hardcoded in UI components.
- **Always use `react-i18next`:** 
  - Import and use `useTranslation` hook:
    ```javascript
    import { useTranslation } from 'react-i18next';
    const { t } = useTranslation();
    ```
  - Reference translations via `t('key_name')`.
- **Localization Files:** 
  - English translations reside in `locales/en.json`.
  - Bangla translations reside in `locales/bn.json`.
  - When introducing new text/features, always update both files with consistent, lowercase snake_case keys.

---

## 2. Component-Based Development & UI Isolation
- **Modular Architecture:** Always prefer creating reusable, self-contained components in the `components/` directory over writing monolithic screen components.
- **Separation of Concerns:** 
  - **Dumb/Presentation Components:** Focus solely on rendering UI based on props.
  - **Isolate Business/Network Logic:** Move network requests, state management, and complex business logic out of the UI/view layer. Use dedicated service files, API client helper controllers, or custom hooks.
  - **Custom Hooks for State & Side-Effects:** Keep screens/components clean by extracting state machines, event handlers, and data fetching logic into reusable custom React hooks (e.g., `useLogin`, `useHomeData`).

---

## 3. Centralized Service Layers & Network Management
- **Single Service Layer:** Maintain single, unified service layers to handle logic. 
- **Centralized Network Manager:** All HTTP/HTTPS requests must flow through a centralized network helper (e.g., `services/NetworkManager.js`). Do not invoke `axios` or `fetch` directly from individual screens, hooks, or non-service files. This ensures unified authorization headers, error interceptors, and timeout handling.

---

## 4. Centralized Constants Classes
- **Single Sources of Truth:** All constants must be imported from centralized configuration or helper modules. No magic strings or inline hardcoded values for styling, APIs, or settings.
- **API Wrapper (`constants/ApiWrapper.js`):** Maintain a centralized class/object for all API endpoints, base URLs, and route mappings.
- **Colors Module (`constants/Colors.js`):** Centralize all theme colors, primary/secondary colors, gradients, and dark-mode color mappings.
- **Static Strings (`constants/Strings.js`):** Maintain all final/static/system-level string references (e.g., storage keys, configurations, non-translatable text) in a dedicated strings class/object.

---

## 5. Safe Hook Management & Best Practices
- **Dependency Arrays:** Always specify correct dependency arrays for `useEffect`, `useCallback`, and `useMemo`. Never leave them empty if they reference external scope variables.
- **Rule of Hooks:** Never call hooks conditionally, inside loops, or inside nested functions.
- **State Management:** Keep state close to where it's used. Lift state up only when necessary.

---

## 6. Platform-Specific Optimization (iOS & Android)
- **Use Platform API:** 
  - Always handle behavior/styling differences between iOS and Android using React Native's `Platform` module (`Platform.OS` or `Platform.select`).
- **Common Platform Checks:**
  - **Keyboard Handling:** Ensure `KeyboardAvoidingView` uses the correct behavior per platform:
    ```javascript
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    ```
  - **Safe Areas:** Utilize `SafeAreaView` from `react-native-safe-area-context` to safely handle notches/home-bars on iOS devices.
  - **Shadows and Elevations:** Style shadows using iOS-specific shadow styles combined with Android-specific `elevation`.

---

## 7. Agent Interaction Rules
- **Clarification:** Always ask clarifying questions before implementing any task that has ambiguous or underspecified requirements.
- **Minimal Response Style:** Keep code edits precise and keep text explanations concise and professional unless the user requests in-depth technical explanation.

---

## 8. Commenting Rules
- do not add comments on or in codes
