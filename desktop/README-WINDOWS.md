# Windows Desktop AI Copilot MVP

## What is implemented

- Frameless transparent Electron window
- Always-on-top toggle
- Adjustable opacity
- Draggable/resizable window
- Global Ctrl+Shift+Space show/hide shortcut
- Minimize/hide controls
- Optional click-through mode
- Windows-oriented content protection via Electron `setContentProtection`
- Explicit display/window capture using Electron `desktopCapturer`
- Explicit rectangular region picker overlay
- Microphone recording from the renderer
- Backend speech-to-text integration
- Streaming chat integration
- Optional screenshot passed to the vision endpoint
- Local JSON persistence for desktop preferences

## Important capture limitation

The region and source capture in this MVP uses Electron desktop capture thumbnails. For production-quality pixel-perfect capture, especially on mixed-DPI multi-monitor Windows systems, replace this implementation with a Windows Graphics Capture/native module and keep the same IPC contract.

`setContentProtection(true)` is a best-effort OS capture-protection mechanism. It does not guarantee invisibility to every recorder, remote desktop product, capture driver, camera, or capture card.

## Run on Windows

Install Node.js LTS and Git.

```powershell
cd desktop
npm install
npm run dev
```

The backend must be running at `http://localhost:8000` unless `VITE_BACKEND_URL` is set.

## Build Windows installer

```powershell
npm run package:win
```

The NSIS installer is written to `desktop/release/`.

## Recommended next production work

1. Replace thumbnail capture with native Windows Graphics Capture.
2. Add DPI-aware per-monitor region selection.
3. Add Windows app identity/icon and signed binaries.
4. Add auto-update with signed update metadata.
5. Move auth/session storage to the backend.
6. Add persistent conversations and encrypted local secrets.
7. Add upload scanning and document processing workers.
8. Test content-protection behavior against Teams, Zoom, Chrome tab sharing, OBS, Windows Snipping Tool, Remote Desktop and common capture APIs.
