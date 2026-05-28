=== BEGIN MATE INSTALL ===

You are about to set up the MATE multi-agent swarm harness in a new project repo.
The user will provide their new (empty) GitHub repo URL. Do everything below in order.
Do NOT write any product/application code — only install the harness.

## Step 1 — Confirm the repo URL

Ask the user: "What is your new GitHub repo URL?" if they haven't already provided it.
Extract the owner and repo name from the URL.

## Step 2 — Clone the MATE Starter template

Clone the MATE Starter into a local temp folder:

  git clone https://github.com/joonho77-VNG/MATE-Starter.git C:\Temp\MATE-Starter-src

If C:\Temp\MATE-Starter-src already exists, delete it first and re-clone so it's fresh.

## Step 3 — Clone the user's new repo

Clone their repo into a temp folder:

  git clone <their-repo-url> C:\Temp\MATE-New-Project

## Step 4 — Copy all starter files into their repo

Copy everything from C:\Temp\MATE-Starter-src into C:\Temp\MATE-New-Project,
preserving folder structure. Include hidden folders (.mate, .claude).
Do NOT copy the .git folder from the starter.

## Step 5 — Commit and push

Inside C:\Temp\MATE-New-Project:

  git add -A
  git commit -m "feat: install MATE harness — agents, dashboard, shared state"
  git push origin main

If the default branch is not main, use the correct branch name.

## Step 6 — Confirm and hand off

Tell the user:
  "✅ MATE is installed in your repo. Now let's set up your project."

Then immediately run the MATE Bootstrap interview (Phase 1 of MATE_Bootstrap.md):

Ask:
1. What are you building, in one sentence?
2. Who is the end user and what friction does this remove?
3. What is explicitly OUT of scope for this iteration?

Then branch follow-up questions by project type:
- Web/UI: target browsers/devices, real vs mocked data, styling approach, key screens, auth?
- CLI/tool: install/distribution, target OS/runtimes, input→output contract, config format?
- Data/pipeline: sources & volume, batch vs streaming, latency, output destination, schema?
- Library/API: public surface, consumers, versioning/compat, language + packaging?

Play back a compact summary (Goal / Out-of-scope / Tech stack / Domain terms) and get confirmation.
Then write the finalized CLAUDE.md into C:\Temp\MATE-New-Project and push it.

## Step 7 — Final instructions to the user

IMPORTANT: Do NOT start the dashboard or run any servers in this session.
The files are currently in a temporary install folder (C:\Temp\MATE-New-Project) that is not
the user's permanent working directory. Starting anything from here would be misleading.

Tell the user exactly this:

  "✅ Your MATE project is ready at: <their-repo-url>

  This install session is done — the temp files here are throwaway.

  Next steps (do these in order):
  1. Close or ignore this session.
  2. Clone your repo to wherever you actually want to work:
       git clone <their-repo-url>
  3. Open that folder in Claude Code as a new session.
  4. In that new session, start Mission Control:
       node dashboard/server.js  →  http://127.0.0.1:4317
  5. To begin building, tell Claude: 'plan the build' and the swarm takes over.

  Do not run the dashboard from this session — it would point at the wrong folder."

Then STOP. Do not start any servers, open any URLs, or do anything further.

=== END MATE INSTALL ===
