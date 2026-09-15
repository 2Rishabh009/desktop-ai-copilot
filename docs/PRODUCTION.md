# Production architecture

- Desktop: Electron signed installers + auto-update channel; React renderer; strict CSP; OS-specific capture modules.
- API: FastAPI behind TLS load balancer/API gateway.
- Auth: database-backed users, Argon2id, short-lived access tokens + rotating refresh tokens, device/session revocation.
- Data: PostgreSQL with row-level ownership checks; object storage for user documents; Redis for rate limiting and ephemeral job state.
- AI gateway: provider adapters with model routing, retries, timeouts, circuit breakers, budget enforcement and per-tenant quotas.
- RAG: document ingestion workers -> parsing/OCR -> chunking -> embeddings -> vector store -> retrieval/reranking -> context budgeter.
- Jobs: background queue for PDF/OCR/embedding tasks; never block API workers on large files.
- Observability: metrics/traces and redacted logs; prompt/screenshot bodies excluded by default.
- Billing: subscription service emits entitlement events; AI layer reads plan/entitlement state but contains no payment-provider SDK logic.
