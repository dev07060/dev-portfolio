# Easy Contract Viewer Server Portfolio Evidence

- Source repository: easy_contract_viewer_server (private local repository)
- Source HEAD: bfaee10
- Source visibility: private
- Deployment status: configuration only
- Evaluation status: harness present, accepted score absent
- Uncommitted server changes: excluded

## Approved claims

- FastAPI routes separate v1 Gemini API Key and v2 Vertex AI IAM providers.
- HMAC-protected server requests and anonymous mobile requests use separate boundaries.
- Anonymous mobile requests are limited by Redis-backed quota, budget, and concurrency controls; single-flight runs as a separate in-process stage.
- The committed baseline masks sensitive text with regex-based detectors before token optimization.
- Synchronous summary and asynchronous job APIs return structured summary, key point, risk item, citation, provider, version, and estimated-cost fields.
- Docker Compose supports local services; Caddy and OCI-oriented files define a deployable configuration.
- A five-case JSONL harness measures keyword recall, but no score is published.

## Excluded claims

- Public source availability.
- A live production endpoint or production traffic.
- Accepted latency, quality, cost, or business-impact numbers.
- Uncommitted masking hardening, Play Integrity, App Attest, quota, or deployment changes.
