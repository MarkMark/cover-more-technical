<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## AI Development Logs

For each implementation task, create an AI development log after brainstorming and/or planning is complete, before writing implementation code. Store logs in `docs/dev-logs/` using the filename format `YYYY-MM-DD-<task-slug>-ai-development-log.md`, matching the date-and-slug style used by Superpowers documents.

The log should give reviewers useful context about how AI was used. Include the task, user intent or acceptance criteria, relevant brainstorming summary, plan summary, prompts or context given to AI, AI proposals, human review decisions, accepted and rejected changes, tradeoffs, and any implementation notes to revisit.

At the end of each AI development log, include a `Prompt Log` section containing the transcript for that implementation task. Record the user's initial prompt and subsequent user responses with enough detail to preserve the request and decisions. Summarize AI responses as high-level overviews rather than full verbatim assistant messages.

Do not invent missing context. If a section has not happened yet, write `Not yet defined` or omit it when that is clearer. Update the log after implementation only when decisions or context materially change.

## Required Skills

Always use `$karpathy-guidelines` when writing, reviewing, or refactoring code.

## Styling

Follow the Tailwind class grouping convention in `docs/styling.md` for new and edited UI code.
