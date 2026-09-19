# Agent runtime is Pydantic AI + DBOS inside Django

Agents run in-process in the Django backend on Pydantic AI, executed by Celery workers on a dedicated `agents` queue, with DBOS durable steps on the existing Postgres so a crashed Run resumes from its last completed step. We rejected a TypeScript sidecar (eve, Cloudflare Agents) because it would duplicate auth and permissions in a second backend, and Cloudflare/Vercel-bound runtimes break self-hosting. We rejected the OpenAI Agents SDK because non-OpenAI models are second-class there.

**Consequences**: model-agnostic by default; OpenAI built-in web search is used for OpenAI models, a Tavily-backed tool for others; mutating tools must carry idempotency keys so step replay never duplicates writes.
