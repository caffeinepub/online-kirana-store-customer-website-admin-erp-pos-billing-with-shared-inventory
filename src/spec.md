# Specification

## Summary
**Goal:** Fix the Version 7 go-live (publish) failure by identifying and resolving build/deploy-blocking issues, then perform a clean rebuild to ensure stable startup and routing.

**Planned changes:**
- Run a clean full build for backend + frontend and fix any compile/build/runtime-blocking errors with minimal, stability-focused edits.
- Audit and correct routing/guard/redirect logic so navigation/redirects do not occur during render and are handled via safe patterns (e.g., effects/router hooks).
- Verify backend authorization and bootstrap-admin initialization so startup queries/mutations (role/profile/products) don’t trap and admin gating behaves correctly on clean deployment.

**User-visible outcome:** The app builds and publishes successfully, loads `/` and `/login` without console/runtime exceptions, redirects and access control behave correctly, and admin bootstrap/authorization works without startup traps.
