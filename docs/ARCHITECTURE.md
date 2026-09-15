# Architecture

```text
Electron Main/Preload
        |
        v
React Renderer ---> FastAPI ---> Context Manager ---> Provider interfaces
      |                |                 |             |-- LLM
      |                |                 |             |-- Vision
      |                |                 |             |-- Speech
      |                |                 |             |-- Embeddings
      |                |                 |             `-- Search
      |                |
      `-- explicit OS capture

FastAPI ---> PostgreSQL (durable state)
        ---> Redis (rate limits/cache/jobs)
```

## OS capture
Electron's `desktopCapturer` is used in the main process. Windows/macOS permission prompts and capture behavior remain OS-controlled. Region selection is a crop operation over an explicitly captured source in this MVP; a production implementation should add a native picker where available and DPI-aware coordinate transforms.

## Overlay
The window is transparent, always-on-top and draggable. Opacity is controlled in the main process. Click-through is exposed through the preload bridge. Content protection is also set in the main process.

## Security
Renderer has no Node.js access. IPC is allow-listed through `contextBridge`. API keys exist only in the backend environment. Sensitive screenshot data is sent only following the explicit capture action and should be treated as ephemeral. Production should add TLS, authenticated endpoints, encrypted-at-rest secrets, database-backed users, refresh-token rotation, CSRF/origin controls where applicable, strict CSP, signed installers, and structured audit logging without prompt/screenshot bodies.
