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


