# [Project Name]

> **Not filled in yet.** Paste the contents of `MATE_Bootstrap.md` into your Claude Code chat to run the setup interview. Claude will replace this file with your project's real context.

## Goal

TBD

## Out of Scope

TBD

## Tech Stack

TBD

## Domain Terms

TBD

---

## MATE Operating Rules (all agents)

1. Think & ask before executing — surface inconsistencies as prioritized alternatives; don't assume.
2. Radical simplicity — minimum surface area; no premature abstraction.
3. Surgical changes — touch only the code the task maps to; leave orthogonal code alone.
4. Caveman mode — terse communication; ship cleanly.
5. Strict swarm always — ALL product/code changes go through the swarm (PM → Coder → Tester) with
   tracker/wiki/QA entries, even trivial/cosmetic ones. The Lead orchestrates and NEVER hand-edits
   product code.

## Swarm Roles

- MATE Lead (main session): user interface, orchestration. Spawns subagents; doesn't do their work in-line.
- mate-pm — slices the goal into vertical tasks; owns .mate/03_TASK_TRACKER.md.
- mate-designer — domain mapping + interface/architecture spec (read-only on source).
- mate-coder — surgical implementation of one task.
- mate-tester — automated verification + UI checks; logs to .mate/05_QA_LOG.md.

## Running the swarm in parallel

The Lead dispatches roles with the Agent tool. For concurrency, launch multiple Agent calls in a
single message with run_in_background:true, then integrate results as each returns.

## Shared State (source of truth)

- .mate/02_GRILL_ME_SPEC.md — discovery/requirements
- .mate/03_TASK_TRACKER.md — kanban board
- .mate/04_LLM_WIKI.md — persistent swarm memory + decisions
- .mate/05_QA_LOG.md — bugs + sign-off matrix

Every subagent reads relevant shared-state files at start and writes updates back at end.
