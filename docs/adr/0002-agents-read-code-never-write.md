# Agents read code, never write it

Agents reach code only through our own read-only Codebase Explorer toolset (tree, glob, grep, read range, symbols, git log/blame/diff) over server-side mirrors of connected Repositories, path-jailed to the Run's Code Scope. No tool executes code or writes files, so "agents never write code" holds by construction rather than by prompt, and no execution sandbox is needed. Mirrors are kept fresh by Git provider push webhooks so agents are always connected to the codebase, including when no human is online.
