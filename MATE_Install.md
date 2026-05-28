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

Tell the user:
  "Your MATE project is ready. Here's how to run it:

  1. Clone your repo locally (if you haven't already) and open it in Claude Code.
  2. Start Mission Control: node dashboard/server.js → http://127.0.0.1:4317
  3. To begin building: tell Claude 'plan the build' and the swarm takes over."

=== END MATE INSTALL ===
