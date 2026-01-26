# Upgrade Dependencies Prompt

## Project Context
This is an Astro project using Bun as the package manager. The project follows a conventional commit message format (e.g., `chore(deps): upgrade astro from 5.6.1 to 5.13.7.`).

## Task
Perform a comprehensive upgrade of all project dependencies and tools, following the established patterns and commit conventions.

## Steps to Execute

### 1. Check Current Project Status
- Run `bun --version` to check current Bun version
- Run `bunx astro --version` to check current Astro version
- Run `bun outdated` to check for outdated dependencies

### 2. Upgrade Project Dependencies
- If Astro needs upgrading, use: `bunx @astrojs/upgrade`
- This automatically updates package.json and bun.lockb
- Verify upgrade with `bunx astro --version`

### 3. Upgrade Bun Runtime (if needed)
- Check for Bun updates: `bun upgrade --dry-run`
- If update available, run: `bun upgrade`
- Verify with `bun --version`

### 4. Commit Changes
- Check what files changed: `git --no-pager status`
- Review staged changes: `git --no-pager diff --cached`
- Commit with format: `chore(deps): upgrade astro from X.X.X to Y.Y.Y.`
- Example: `git commit -m "chore(deps): upgrade astro from 5.6.1 to 5.13.7."`

### 5. Final Verification
- Run `bun outdated` to confirm all dependencies are current
- Test that project still starts: `bun dev` (then Ctrl+C to stop)

## Key Files That May Change
- `package.json` - Dependency versions
- `bun.lockb` - Lock file (binary)
- `.astro/` directory - May be regenerated

## Commit Message Format
This project uses the format: `type(scope): message.`
- Always end with a period
- Use lowercase `type` and `scope`
- For upgrades: use `chore(deps)` and include version numbers

## Expected Tools and Versions
- **Bun**: Latest stable version (check with `bun upgrade`)
- **Astro**: Latest stable version (check with `bun outdated`)
- **Node.js**: As specified by Bun requirements

## Troubleshooting Notes
- If `bun list` fails, use `bunx astro --version` instead
- The `@astrojs/upgrade` tool handles complex migration steps automatically
- Always verify the project starts after upgrades
- If Bun upgrade says "already on latest", it may have been upgraded recently

## Usage for Other AIs
When prompted to "upgrade dependencies" or "check for updates" in this project:
1. Follow the steps above in sequence
2. Respect the commit message format
3. Don't skip the verification steps
4. Report what was upgraded and to which versions