# Specification

## Summary
**Goal:** Replace the placeholder Login flows by implementing Email+Password and OTP authentication end-to-end, and ensure Admin users are redirected to the Admin panel after login.

**Planned changes:**
- Add backend (single Motoko actor) Email+Password login API that validates credentials, associates the caller Principal with the authenticated email for role checks, and seeds/ensures the bootstrap Admin credentials (jogoshree@gmail.com / Admin@123) work exactly.
- Add backend OTP APIs to request an OTP for an email or mobile identifier (with a limited validity window) and verify the OTP to authenticate the caller, without any external delivery integration.
- Update the frontend /login page to wire Email+Password and OTP tabs to the new backend APIs and replace placeholder/toast-only behavior with clear English success/failure messaging.
- Ensure post-login routing across Internet Identity, Email+Password, and OTP: Admin users go to /admin and non-admin users go to /, using non-render navigation (effects/router actions).
- Run a focused full build pass (frontend + backend) and fix any compile/runtime blockers introduced or revealed by these auth changes.

**User-visible outcome:** Users can log in using Email+Password or OTP (in addition to Internet Identity) from the /login page with real backend validation and clear English messages; Admin users are redirected to /admin after successful login while others go to /.
