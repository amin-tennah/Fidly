# Rézone — Règles agent (Antigravity)

Les règles complètes et OBLIGATOIRES du projet sont dans `.cursorrules` (source unique, partagée avec Cursor).
Si l'import ci-dessous n'est pas développé, lis `.cursorrules` intégralement avant toute action.

Rappel critique : à la fin de chaque tâche modifiant le projet, mettre à jour `Documentation/CHANGELOG_ET_DECISIONS.md` (section 14). Sans cela, la tâche est NON TERMINÉE.

@[.cursorrules](.cursorrules)


<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
