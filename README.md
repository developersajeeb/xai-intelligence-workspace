# Xai Intelligence Workspace

This folder holds both the persistent build-planning memory for the Xai frontend
challenge (since a single AI chat session can't hold the whole 5-day build) and the
Next.js project itself. Point any new Claude/Copilot chat at this folder before
continuing work.

## Files
- **PROJECT-BRIEF.md** — the full original challenge requirements, deliverables, and
  evaluation criteria. Read this once to understand the goal.
- **DESIGN-SYSTEM.md** — design tokens (color, type, spacing, radius, grid), component
  inventory, and animation conventions. Keep this in sync with the Figma file as design
  decisions get finalized.
- **TODO.md** — the actual build checklist, broken into phases (Setup → Static Layout →
  Hero 3D → Insight Flow → Dashboard → Signature Interaction → Polish → Deliverables).
  This is what gets updated as work progresses — it's the resume point for every new
  session.
- **CONTEXT-FOR-AI.md** — a ready-to-paste priming prompt that tells a fresh AI session
  what to read and how to behave (continue from TODO.md, follow existing conventions,
  update checkboxes, etc).

## Workflow across sessions
1. Start a new chat with Claude/Copilot.
2. Paste the block from `CONTEXT-FOR-AI.md` (or just say "read CONTEXT-FOR-AI.md in
   this folder and continue").
3. Work through the next unchecked items in `TODO.md`.
4. Before ending the session, make sure `TODO.md` checkboxes and the "Current phase"
   line reflect what actually got done.
5. If a decision was made that isn't captured anywhere (a library choice, a tradeoff),
   add one line to `DESIGN-SYSTEM.md` or `PROJECT-BRIEF.md` so it isn't lost.

## Where the actual code lives
Right here — `app/`, `components/`, `lib/`, `package.json` etc. sit alongside these
planning docs in this same folder. Run `npm install && npm run dev` from this folder
to work on the app locally.
