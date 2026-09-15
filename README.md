# Desktop AI Copilot

Windows-first desktop AI Copilot built with Electron + React + TypeScript and a FastAPI backend.

## Windows customer distribution

Version **0.2.1** is configured for an automated Windows NSIS installer. The workflow in `.github/workflows/windows-release.yml` builds `AI-Copilot-Setup-0.2.1.exe` on a Windows GitHub Actions runner and uploads it as an artifact. A version tag such as `v0.2.1` also publishes the installer to a GitHub Release.

## Included MVP capabilities

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

## Important: this is not yet a production SaaS release

The installer can be built and distributed, but customer use requires a hosted HTTPS backend. The desktop client currently defaults to `http://localhost:8000`. Before selling licenses, configure the GitHub Actions repository variable `BACKEND_URL` to the production FastAPI URL.

Do **not** embed an AI provider API key in the desktop app. Provider credentials must remain on the server.

For a real commercial release we still need to finish: persistent production authentication/session storage, license activation and subscription entitlement enforcement, payment integration, quotas/rate limits, monitoring/backups, privacy policy and terms, Windows code signing, update strategy, and production security testing.

## Screen-capture protection

The desktop app enables Electron/OS content protection as a best-effort privacy control. It cannot guarantee that the Copilot window is invisible to every screen recorder, remote-desktop system, camera, capture card, compositor, or future OS capture path. Capture is explicitly user initiated; the application does not perform covert continuous screen monitoring.
