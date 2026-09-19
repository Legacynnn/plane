# Architecture overview

## Boundaries

- Agent runtime lives inside the Django backend, not a separate service — ADR 0001.
- Agents touch code only through the read-only Codebase Explorer over mirrored Repositories — ADR 0002.
- All model calls go through the in-process gateway and credits ledger; no external LLM proxy — ADR 0003.
- Evals are started by developers from the CLI only; the product never runs them — ADR 0006.
- A human-triggered Run acts with agent scope ∩ Triggering User rights, enforced in the Tool Registry — ADR 0004.
- Agents, Slack triggers and Jev are gated off on self-hosted instances — ADR 0005.
