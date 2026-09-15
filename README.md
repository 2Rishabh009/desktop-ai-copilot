# Desktop AI Copilot

Windows-first desktop AI Copilot built with Electron + React + TypeScript and a FastAPI backend.

## What is included

- Frameless transparent always-on-top Copilot window
- Global show/hide shortcut: `Ctrl + Shift + Space`
- User-initiated window/display and rectangular-region capture
- Screenshot understanding through a vision-capable AI provider
- Streaming chat responses
- Microphone speech-to-text integration
- PDF/text document extraction scaffold
- FastAPI backend with provider abstraction
- JWT/Argon2 authentication MVP
- PostgreSQL schema and Alembic migration
- Redis Docker configuration
- Security and threat-model documentation
- Automated Windows NSIS installer workflow

## Windows installer

The repository contains `.github/workflows/windows-release.yml`. GitHub Actions builds `AI-Copilot-Setup-<version>.exe` on Windows and uploads it as a workflow artifact. Pushing a `v*` tag also publishes the installer to a GitHub Release.

The current installer is an MVP/developer distribution. It is **not yet a production SaaS client** until a hosted backend, licensing/subscription enforcement, production authentication/session storage, monitoring, privacy policy, terms, and Windows code signing are configured.

## Backend requirement

The desktop client currently defaults to `http://localhost:8000`. For customer distribution, configure the GitHub Actions repository variable `BACKEND_URL` to the HTTPS URL of your hosted FastAPI backend before producing a customer release. Do not put an AI provider secret/API key inside the desktop application.

## Screen-capture protection limitation

The desktop app enables Electron/OS content protection as a best-effort privacy control. It cannot guarantee that the Copilot window is invisible to every screen recorder, remote-desktop system, camera, capture card, compositor, or future OS capture path. Capture is explicitly user initiated; the application does not perform covert continuous screen monitoring.

## Production checklist

1. Host FastAPI behind HTTPS.
2. Move users/sessions/usage from the in-memory MVP implementation to PostgreSQL.
3. Add license activation and subscription entitlement checks.
4. Add Stripe or another payment provider on the server side.
5. Add rate limits, quotas, audit logging, monitoring and backups.
6. Configure a real Windows code-signing certificate or Azure Trusted Signing.
7. Add updater/release-channel support and signed releases.
8. Publish Terms of Service and Privacy Policy.
9. Perform a Windows security/privacy review before selling access.
