# Desktop AI Copilot MVP

Electron + React + TypeScript desktop client with a FastAPI backend, provider-neutral AI interfaces, explicit screen capture, document upload, JWT authentication, usage metering, PostgreSQL and optional Redis.

## Important screen-sharing limitation

The MVP enables Electron/OS content-protection (`setContentProtection(true)`) on the assistant window as a best-effort privacy control. This can prevent the window from appearing in some OS capture paths, but **cannot guarantee invisibility across every screen recorder, remote-desktop product, camera, capture card, compositor, or future OS behavior**. The operating system and capture API determine what is actually shared.

The app never performs covert continuous screen monitoring. Screen capture is user initiated.
