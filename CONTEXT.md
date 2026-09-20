# Plane (Legacynnn fork)

Project management fork of Plane organised as three modules — Work, Wiki, IA — plus an MCP server that lets external UIs control all of it.

## Modules

**Work**:
The project-management module: projects, work items, cycles, modules, views, intake.
_Avoid_: Projects module, PM

**Wiki**:
Workspace-level knowledge shared across all projects: authored pages plus content ingested from integrations (meetings, Slack, email, code).
_Avoid_: Docs, knowledge base

**IA**:
The module where agents live and act; every agentic interaction happens through it.
_Avoid_: AI module, Pi, assistant

## Agents

**Agent**:
A configured autonomous worker with its own bot identity, instructions, triggers and scope. A workspace has many agents, each with a distinct job.
_Avoid_: Bot, assistant

**General Agent**:
The workspace's default agent that people talk to; it answers directly or delegates to specialists.
_Avoid_: Orchestrator, main bot

**Specialist**:
An agent with one narrow job (e.g. Codebase Explorer, Web Researcher, Aligner, Triage). The General Agent calls specialists, and people can also talk to a specialist directly.
_Avoid_: Sub-agent, worker

**Trigger**:
What starts an agent: a mention, an assignment, a Slack message, a work-item event, or a schedule.

**Run**:
One execution of an agent from trigger to completion, failure or stop. Every run is logged.
_Avoid_: Session, job, execution

**Run Activity**:
A single step inside a run: prompt, thought, action, response, question to a human, or error.

**Mode**:
How much autonomy a chat Run has: Ask (read-only), Build (every change needs a Confirmation) or Autopilot (only guarded actions need a Confirmation). Runs started by triggers behave as Autopilot.

**Confirmation**:
A human approval an agent must obtain before a guarded action (delete, archive, bulk change, member/role or settings change). Unanswered after 24 hours, it expires and the Run stops.
_Avoid_: Approval (reserved for Work workflows)

**Triggering User**:
The human whose action started a run. A run they trigger can never do more than they are allowed to do.

**Agent defaults**:
The model, tool set and budget a new agent starts with in a workspace. A single Agent overrides them in the IA module.

**Workspace Preferences**:
Conventions every agent follows in a workspace (tone, definition of done, labeling rules). Admin-owned; agents may only propose changes.

**User Preferences**:
How one member wants agents to work with them (answer style, role, focus areas). User-owned; agents may only propose changes.

**Agent Memory**:
Facts an agent has learned across Runs. Agents write entries freely; people can view and delete them.

**Suggestion**:
A proposed change by an agent to something a human owns (a human-authored Wiki page, preferences) that takes effect only once accepted.
_Avoid_: Draft, proposal

**Assist Panel**:
The right-side panel available on every screen for quick, pointed help with what the person is looking at: drafting the work item being written, answering a question, creating a task from something passed in. It holds one Thread at a time and never runs in Autopilot; deeper or autonomous work belongs to the IA module.
_Avoid_: Sidebar chat, copilot

**Thread**:
One conversation with an agent. The Assist Panel keeps a single live Thread, so starting a new one drops the old; IA Threads are kept with history.
_Avoid_: Chat, session

**Handoff**:
Carrying a Thread's context into a new Thread, in the Assist Panel or in the IA module, so the work continues without the old conversation.

**Review**:
The IA inbox where people answer agents: pending Confirmations first, then Suggestions.

## Wiki sources

**Page**:
A Wiki document authored by a person or an agent; pages nest under one another.
_Avoid_: Doc, article, note

**Collection**:
A named top-level grouping of Wiki pages, the root of one tree in the Wiki sidebar.
_Avoid_: Folder, space, category

**Connector**:
A workspace's authorised link to an external service (Slack, GitHub, GitLab, later email and meeting tools), managed in Settings.
_Avoid_: Integration, connection

**Source**:
External content landed in the Wiki through a Connector or an upload (a meeting transcript, a Slack thread), read-mostly and linkable to work items and pages.
_Avoid_: Import, document

## Codebase

**Repository**:
A code repository connected once at workspace level through a Git provider app and mirrored read-only for agents.
_Avoid_: Repo connection, codebase

**Code Scope**:
The link between a project and a repository, optionally narrowed to paths, so one monorepo can serve several projects or one project can span several repositories.

**Repository Map**:
An auto-generated outline of a repository (packages, apps, languages, entrypoints) refreshed on every sync, combined with the repo's own agent docs, so agents understand monorepos before exploring.

## Models

**Provider**:
An external service we pay for AI work: language models, Jev decisions, web search, embeddings.

**Gateway**:
The in-process path every model call takes: it resolves the Model Assignment, builds the provider adapter, runs the call and reports what the provider charged for it.
_Avoid_: Proxy (we call providers directly, see ADR 0003)

**Feature**:
The named piece of product a model call serves (editor assist, triage, a specialist agent). A Model Assignment is made per feature.

**Model Catalog**:
The instance's list of providers and models with their capabilities and status (pending, active, deprecated, disabled), kept current by a daily sync and managed in God Mode.

**Model Price**:
A dated price for one model; a change never edits a price, it starts a new one, so past usage keeps the price it was charged at.

**Model Assignment**:
Which model (and fallback) serves a feature or agent at instance, workspace or agent level.

**Markup**:
The multiplier applied to provider cost when turning it into credits: one instance default, optionally overridden per provider. It is 1.0 on self-hosted instances.
_Avoid_: Margin, fee

**Usage Event**:
The record of one metered call: who and what caused it, which model and price, provider-reported tokens or calls, cost and credits.
_Avoid_: Log, charge

## Evals

**Eval Run**:
A developer-started run of datasets against a prompt and model, whose results are shown read-only in God Mode and never to workspaces.
_Avoid_: Test run, benchmark

**Dataset**:
A versioned set of eval cases for one feature or specialist, stored in git with its fixtures.

**Feedback Signal**:
Implicit quality evidence collected from production for free: thumbs, Suggestion accept/reject, Confirmation rejects, spec edits.

## Credits

**Credit**:
The unit every AI action is metered in, on hosted and self-hosted alike.
_Avoid_: Token (tokens are the provider's unit, not ours)

**Personal Allowance**:
A member's monthly credits, spent by anything that member triggered, including Slack runs.

**Workspace Pool**:
A workspace's shared monthly credits, spent by scheduled and event-triggered runs.

**Agent Cap**:
An optional monthly credit ceiling on a single agent, on top of whichever budget pays.
