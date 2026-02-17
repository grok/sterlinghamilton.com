# Start Development Prompt

## Project Context
This is Sterling Hamilton's website built with Astro and managed with Bun. It's a static site generator project.

## Task
Start the development environment and ensure everything is working correctly.

## Prerequisites Check
Before starting development, verify:
- Bun is installed and up to date
- Dependencies are installed (`node_modules` exists)
- Project structure is intact

## Steps to Execute

### 1. Verify Project Setup
```bash
# Check if dependencies are installed
ls -la | grep node_modules

# Check current versions
bun --version
bunx astro --version

# Verify project structure
ls -la
```

### 2. Install Dependencies (if needed)
```bash
# If node_modules doesn't exist or seems outdated
bun install
```

### 3. Start Development Server
```bash
# Start the dev server
bun dev

# The server will start at http://localhost:4321/
# Press Ctrl+C to stop the server
```

### 4. Available Commands
- `bun dev` - Start development server at localhost:4321
- `bun build` - Build production site to ./dist/
- `bun preview` - Preview built site locally
- `bun astro ...` - Run Astro CLI commands

## Expected Behavior
- Development server should start without errors
- Site should be accessible at http://localhost:4321/
- File watching should be active for hot reloading
- Any TypeScript/Astro compilation should complete successfully

## Troubleshooting
- If dependencies are missing: Run `bun install`
- If versions are outdated: Use the upgrade-dependencies prompt
- If port 4321 is busy: Astro will automatically try the next available port
- If build errors occur: Check the console output for specific issues

## Project Structure
```
/
├── .astro/          # Astro generated files
├── .git/           # Git repository
├── .vscode/        # VSCode settings
├── node_modules/   # Dependencies
├── public/         # Static assets
├── prompts/        # AI prompts (this folder)
├── src/           # Source code
│   └── pages/     # Astro pages
├── astro.config.mjs # Astro configuration
├── bun.lockb      # Bun lock file
├── package.json   # Project configuration
├── README.md      # Project documentation
└── tsconfig.json  # TypeScript configuration
```

## Development Workflow
1. Start with `bun dev`
2. Edit files in `src/` directory
3. Changes will hot-reload automatically
4. Build production version with `bun build` when ready
5. Preview production build with `bun preview`

## Usage for Other AIs
When asked to "start the project" or "begin development":
1. Follow the prerequisite checks
2. Start the development server
3. Confirm it's running correctly
4. Report the local URL and any issues found
