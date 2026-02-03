## 2025-05-15 - [Package-lock churn and dead code]
**Learning:** Running `npm install` to fix linting errors can modify `package-lock.json` significantly if the environment's npm version or configuration differs from the original. Also, while removing dead code is generally good, it can be mistaken for a regression by reviewers if they don't see that the variable was unused.
**Action:** Always revert `package-lock.json` changes before submitting. Double-check usage of any variable before removing it, and perhaps keep it (memoized) if its removal might be controversial, even if unused.
