## 2025-05-14 - Route-based code splitting
**Learning:** Implementing route-based code splitting using `React.lazy` and `React.Suspense` for all major page components in this project resulted in a significant reduction of the initial bundle size (from ~893 kB to ~413 kB, a 54% decrease). This confirms that a monolithic bundle was a major bottleneck for initial load performance.
**Action:** Always check `App.jsx` for monolithic page imports in large React projects and implement code splitting as an early performance win.
