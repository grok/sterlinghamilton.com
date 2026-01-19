# Sterling Hamilton's Website

## Table of Contents

- [Setup](#setup)
- [Development Tools](#️-development-tools)
  - [Terminal & Editor](#terminal--editor)
  - [AI Assistants & LLMs](#ai-assistants--llms)
  - [AI Prompt System](#ai-prompt-system)
- [Project Structure](#-project-structure)
- [Commands](#-commands)
- [Upgrading Dependencies and Runtime](#-upgrading-dependencies-and-runtime)
  - [Checking for Updates](#checking-for-updates)
  - [Upgrading Bun Runtime](#upgrading-bun-runtime)
  - [Upgrading Project Dependencies (Astro)](#upgrading-project-dependencies-astro)
  - [Committing Upgrade Changes](#committing-upgrade-changes)
  - [Verification After Upgrades](#verification-after-upgrades)
  - [Files That May Change During Upgrades](#files-that-may-change-during-upgrades)
  - [Troubleshooting](#troubleshooting)

## Setup

This project was created with astro using a command like: `bun create astro@latest -- --template basics`

## 🛠️ Development Tools

This project is developed using modern AI-assisted development tools and workflows.

### Terminal & Editor

- **Warp**: Modern terminal with AI agent capabilities
  - Used for running commands and AI-assisted terminal workflows
  - Agent mode supports executing complex multi-step tasks
- **Cursor**: AI-powered code editor
  - Primary IDE for this project
  - Provides AI code completion, chat, and codebase understanding
  - Supports context-aware suggestions and refactoring

### AI Assistants & LLMs

This project leverages Large Language Models (LLMs) for development assistance:

- **Cursor AI**: Integrated AI assistant in the editor
- **Warp AI Agent**: Terminal-based AI agent for command execution
- **Other AI Tools**: Compatible with GitHub Copilot, Claude, and other AI coding assistants

### AI Prompt System

This project includes a reusable prompt system in the `prompts/` directory:

- **Purpose**: Standardized prompts for common development tasks
- **Location**: See `prompts/README.md` for available prompts
- **Usage**: Prompts can be used with Warp AI, Cursor, or other AI assistants
- **Available Prompts**:
  - `start-development.md` - Start development environment
  - `upgrade-dependencies.md` - Upgrade dependencies and runtime

These prompts help maintain consistency and enable AI assistants to follow project-specific conventions and workflows.

## 🚀 Project Structure

@TODO: This is a work in progress.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`                 | Starts local dev server at `localhost:4321`      |
| `bun build`               | Build your production site to `./dist/`          |
| `bun preview`             | Preview your build locally, before deploying     |
| `bun astro ...`           | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help`     | Get help using the Astro CLI                     |

## 🔄 Upgrading Dependencies and Runtime

This project uses Bun as the runtime and package manager, and Astro as the framework. Follow these processes to keep everything up to date.

### Checking for Updates

First, check what needs updating:

```bash
# Check current versions
bun --version
bunx astro --version

# Check for outdated dependencies
bun outdated
```

### Upgrading Bun Runtime

Bun can upgrade itself:

```bash
# Check if Bun update is available (this will also upgrade if available)
bun upgrade --dry-run

# If an update is available, upgrade Bun
bun upgrade

# Verify the upgrade
bun --version
```

**Note**: The `--dry-run` flag may actually perform the upgrade. This is expected behavior.

### Upgrading Project Dependencies (Astro)

Use Astro's official upgrade tool to handle migrations automatically:

```bash
# Upgrade Astro and all related dependencies
bunx @astrojs/upgrade

# Verify the upgrade
bunx astro --version
```

This tool automatically:
- Updates `package.json` with the latest version
- Updates `bun.lockb` lock file
- Handles any necessary migration steps
- Checks for compatibility issues

### Committing Upgrade Changes

After upgrading, commit the changes using the project's commit format:

```bash
# Check what changed
git status

# Review the changes
git diff package.json

# Stage and commit
git add package.json bun.lockb README.md  # Add any other changed files
git commit -m "[chore] Upgrade astro from X.X.X to Y.Y.Y."
```

**Commit Message Format**: `[type] Description.`
- Use square brackets around the type (e.g., `[chore]`)
- Always end with a period
- Include specific version numbers for upgrades

### Verification After Upgrades

Always verify everything still works:

```bash
# Confirm all dependencies are current
bun outdated

# Test that the project starts
bun dev
# (Press Ctrl+C to stop after verifying it starts)
```

### Files That May Change During Upgrades

- `package.json` - Dependency versions
- `bun.lockb` - Lock file (binary format)
- `README.md` - May be updated by upgrade tools
- `.astro/` directory - May be regenerated

### Troubleshooting

- If `bun outdated` shows no output, all dependencies are current
- If the project fails to start after upgrade, check the console for specific errors
- The `@astrojs/upgrade` tool handles most migration steps automatically
- If Bun upgrade says "already on latest", you're already up to date


