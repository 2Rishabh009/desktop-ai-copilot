# Security model

1. **Capture consent:** no continuous or covert screen capture.
2. **Renderer isolation:** `contextIsolation=true`, `nodeIntegration=false`, sandbox enabled.
3. **Secrets:** provider API keys stay in FastAPI, never renderer/preload.
4. **Transport:** localhost in development; HTTPS/WSS in production.
5. **Retention:** do not persist screenshots by default. If temporary files are required, delete after processing.
6. **Content protection:** best-effort OS capture exclusion; never promise universal invisibility.
7. **Auth:** Argon2 password hashing via `pwdlib`; production should use a database and refresh-token rotation.
8. **Logging:** never log screenshot bytes, prompts, tokens, or document contents by default.
9. **Authorization:** enforce ownership on every conversation/document/usage record.
10. **Packaging:** code-sign Windows/macOS installers and protect update channels.
