# Working Together Guide (Simple + Safe)

## Goal
Work in parallel without overriding each other.

## 1) Ownership Rules
- Server owner edits only `server/**`.
- Client owner edits only `client/**`.
- Shared files (root files like `package.json`, `README.md`) require coordination before editing.

## 2) Never Work Directly on `main`
Always create a branch per task.

Branch naming:
- `feat/server/<short-topic>`
- `fix/server/<short-topic>`
- `feat/client/<short-topic>`
- `fix/client/<short-topic>`
- `chore/root/<short-topic>`

## 3) Daily Flow (Both Developers)
1. Update local `main`.
2. Create a new branch.
3. Do focused changes only.
4. Commit with clear message.
5. Push branch.
6. Open PR.
7. Get review from teammate.
8. Merge only after approval.

Commands:

```powershell
git checkout main
git pull origin main
git checkout -b feat/server/example-task

# work...

git add .
git commit -m "feat(server): short description"
git push -u origin feat/server/example-task
```

## 4) Required Checks Before Push
- `git status` shows only relevant files.
- Build commands pass:

```powershell
npm run client:build
npm run server:build
```

## 5) Conflict Prevention Rules
- If you need to edit teammate-owned area, ask first.
- Keep PRs small.
- Pull `main` before creating any new branch.
- Do not use force-push on shared branches.

## 6) If Conflict Happens

```powershell
git fetch origin
git rebase origin/main
# resolve files
git add .
git rebase --continue
git push --force-with-lease
```

Use `--force-with-lease` only on your own feature branch.

## 7) Security Rules
- Never commit `.env` files.
- Commit only `.env.example`.
- Rotate credentials immediately if exposed.
