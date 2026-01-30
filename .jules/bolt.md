## 2025-05-15 - [Syntax Errors and Code Splitting]
**Learning:** React style objects with hyphenated keys (e.g., `object- fit`) are invalid JavaScript and will block the application from loading or building. This codebase had such an error in `Menu.jsx`. Also, with 20+ routes, the initial bundle was bloated; route-based code splitting with `React.lazy` is a high-impact, low-risk optimization here.
**Action:** Always check for CSS-in-JS syntax errors if the dev server fails to start. Use `React.lazy` for all page-level components in `App.jsx` to optimize the initial load.

## 2025-05-15 - [Clean PRs and package-lock.json]
**Learning:** Running `npm install` in the sandbox environment frequently modifies `package-lock.json` by adding/removing peer dependency flags. These changes are irrelevant to the task and clutter PRs.
**Action:** Revert `package-lock.json` before submission if no new packages were intentionally added.
