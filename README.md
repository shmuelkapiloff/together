# together

Monorepo-style workspace for one server app and one client app.

## Structure

- `client/` - frontend app copied from your friend's repository
- `server/` - backend app for this project

## Working Agreement

- Keep shared project glue at the repo root when possible.
- Avoid changing `client/src/` without your friend's approval.
- Root-level scripts are safe places to make the two apps work together.

## Root Scripts

- `npm install` - install the root dev dependency for shared scripts
- `npm run install:all` - install client and server dependencies
- `npm run dev` - run client and server together
- `npm run build` - build client and server together

## Commit Style

Suggested commit prefixes:

- `feat(server): ...`
- `fix(server): ...`
- `feat(client): ...`
- `fix(client): ...`
- `chore(root): ...`

Use `chore(root)` for repo-level changes like scripts, README updates, or environment setup.