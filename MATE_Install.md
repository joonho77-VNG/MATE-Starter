=== BEGIN MATE INSTALL ===

You are setting up the MATE multi-agent swarm harness in this project.
You are already running inside the user's project folder — that is the permanent working directory.
Do NOT clone anywhere else. Work entirely in the current directory.
Do NOT write any product/application code — only install the harness.

## Step 1 — Confirm the repo URL

Ask the user: "What is your GitHub repo URL?" if they haven't already provided it.

## Step 2 — Pull the MATE Starter files into this folder

Clone the MATE Starter into a temp location, then copy its files into the current directory:

  git clone https://github.com/joonho77-VNG/MATE-Starter.git C:\Temp\MATE-Starter-src

Copy everything from C:\Temp\MATE-Starter-src into the current directory,
preserving folder structure. Include hidden folders (.mate, .claude).
Do NOT copy the .git folder from the starter.

## Step 3 — Connect to the user's GitHub repo and push

Initialize git if not already done, set the remote, and push:

  git init
  git remote add origin <their-repo-url>
  git add -A
  git commit -m "feat: install MATE harness — agents, dashboard, shared state"
  git push -u origin main

If the remote already exists, use: git remote set-url origin <their-repo-url>

## Step 4 — Run the MATE Bootstrap interview

Tell the user: "✅ MATE is installed. Now let's set up your project."

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
Then write the finalized CLAUDE.md into the current directory and push it.

## Step 5 — Start Mission Control

Start the dashboard as a background process from the current directory:

  node dashboard/server.js

Run it in the background so it doesn't block the session.
Confirm it started, then tell the user:

  "✅ Mission Control is live at http://127.0.0.1:4317 — open that in your browser.

  To begin building, tell Claude: 'plan the build' and the swarm takes over."

=== END MATE INSTALL ===
