# Design

## Decisions

- Visual language stays Plane's propel tokens and components; the shell stays as close to original Plane as possible, and only new screens are new design.
- The shell keeps Plane's three parts: top bar (workspace switcher, search with ⌘K, inbox, help, Assist Panel button, avatar), App Rail with icon above label, module sidebar headed by the module name.
- The App Rail is the module switcher: Work, Wiki, IA, divider, Settings. No other rail items.
- The active rail item comes from the first path segment after the workspace slug (`/wiki`, `/ia`, `/settings`, anything else is Work); the inbox marks no module.
- Module names Work, Wiki and IA stay untranslated in every locale. Rail labels may hyphenate onto a second line, never truncate.
- A module without screens yet shows its icon, name and one line saying what will live there, in CONTEXT.md nouns.
- The inbox lives in the top bar and collects notifications from all three modules.
- Each module owns its sidebar: Work keeps today's; Wiki shows Pages, Sources and a Collections tree; IA shows Threads, Agents, Runs, Review, Memory & Preferences, Usage.
- Every module sidebar item points at a real route; a section without screens yet shows its own name and the module's one-line description.
- The Wiki Collections tree carries one filter, Agent-authored, kept in the sidebar header rather than in the page list.
- The Assist Panel opens from the top bar button (or its shortcut) on the right of any screen, with its context set to what is on screen, and stays minimal: one live Thread, Ask and Build only, Handoff to carry context onward.
- The IA module is for deep and autonomous work: scheduled Agents, long analyses, building many work items or epics, Thread history.
- Humans answer agents in one Review inbox inside IA, Confirmations above Suggestions; the main inbox links there.
- Connectors are managed in Settings, never inside Wiki.
- Workspace Settings groups: Workspace, Connectors, Codebase, IA, Developer. Agents are configured in the IA module, not in Settings.
- Account settings gain User Preferences, linked accounts and personal usage.
- God Mode groups: Providers, Model Catalog, Pricing & Markup, Usage, Eval results, Feature flags.
- Every new component ships with a Storybook story; existing components get one when touched.
