# Windows/macOS limitations

## Windows
- Windows Graphics Capture and Electron's desktop capture paths are controlled by Windows permissions and compositor behavior.
- A capture source can differ from what the user visually sees depending on the recording application.
- Electron `setContentProtection(true)` is a best-effort control and must not be marketed as universal capture invisibility.
- DPI scaling means production region selection must transform CSS pixels to physical capture pixels.

## macOS
- Screen Recording permission is required for screen/window capture.
- TCC permissions can change behavior between first run and subsequent runs; the user may need to grant permission in System Settings.
- Window capture and display capture are subject to macOS privacy/compositor rules.
- `setContentProtection(true)` is not a guarantee that every recording/sharing path excludes the window.
- Production packaging requires hardened runtime, entitlements, notarization and code signing.

## Product rule
The product should always describe capture protection as **best effort**, not as an undetectable or universally invisible overlay. A camera pointed at the display, a capture card, or a capture mechanism that ignores OS-level protection can still record the assistant.
