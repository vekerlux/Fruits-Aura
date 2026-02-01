## 2025-05-14 - Route-based Code Splitting Impact
**Learning:** In this Vite-based React application, implementing route-based code splitting using `React.lazy` and `Suspense` resulted in a >50% reduction of the main bundle size (from 893 kB to 413 kB). This is highly effective due to the large number of page components that were previously bundled into a single file.
**Action:** Always check for route-based code splitting opportunities in monolithic SPAs.

## 2025-05-14 - Blocked by Pre-existing Syntax Errors
**Learning:** A syntax error in `src/pages/Menu.jsx` (`object- fit` instead of `objectFit` in a style object) prevented the production build from succeeding, even though the dev server might sometimes handle it.
**Action:** Always run a full production build (`npm run build`) early to identify syntax or type errors that might be hidden during development.
