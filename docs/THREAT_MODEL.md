# Threat model

Assets include API credentials, user prompts, screenshots, documents, conversation history, auth tokens and billing state.

Primary threats: malicious renderer content, compromised dependency, token theft, unauthorized conversation access, accidental screenshot retention, prompt injection from captured pages/documents, and over-privileged desktop IPC.

Mitigations: isolated renderer, narrow IPC surface, backend-only provider secrets, authenticated ownership checks, ephemeral screenshots, MIME/size validation, malware scanning for production uploads, prompt-injection-aware RAG boundaries, dependency pinning/SBOM, signed builds, and redacted logs.
