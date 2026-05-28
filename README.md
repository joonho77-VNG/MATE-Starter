# MATE Starter

A multi-agent swarm harness for Claude Code, with a live Mission Control dashboard.

## What's included

- **MATE Bootstrap** — interview prompt that sets up your project's `CLAUDE.md` and swarm config
- **4 Specialist Subagents** — PM, Designer, Coder, Tester (in `.claude/agents/`)
- **Mission Control Dashboard** — local web dashboard showing agent status, task board, and activity feed

## Quick start

1. Click **"Use this template"** → create your new repo
2. Clone it and open in Claude Code
3. Copy the full contents of `MATE_Bootstrap.md` and paste it into your Claude Code chat
4. Claude interviews you, fills in `CLAUDE.md`, and your swarm is ready
5. Start the dashboard: `node dashboard/server.js` → http://127.0.0.1:4317

## Swarm roles

| Role | Responsibility |
|---|---|
| **mate-pm** | Slices goals into tasks, maintains the task tracker |
| **mate-designer** | Maps domain, specifies architecture before any code |
| **mate-coder** | Surgical implementation of one task at a time |
| **mate-tester** | Verifies shipped slices, logs failures to QA log |

## Shared state files

| File | Purpose |
|---|---|
| `CLAUDE.md` | Project context — filled in by the bootstrap interview |
| `.mate/02_GRILL_ME_SPEC.md` | Discovery & requirements |
| `.mate/03_TASK_TRACKER.md` | Kanban task board |
| `.mate/04_LLM_WIKI.md` | Persistent swarm memory & decisions |
| `.mate/05_QA_LOG.md` | Bug log & sign-off matrix |
| `.mate/activity_log.jsonl` | Live activity feed for Mission Control |

## Dashboard

The Mission Control dashboard reads directly from your `.mate/` files — no config needed.

```bash
node dashboard/server.js
# → http://127.0.0.1:4317
```

To log agent activity to the feed manually:

```bash
node dashboard/log-event.js <role> <start|end|info|dispatch> "<task name>"
# e.g.
node dashboard/log-event.js coder start "build login form"
```
