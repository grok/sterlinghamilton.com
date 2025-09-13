# AI Prompts for Sterling Hamilton Website

This folder contains reusable AI prompts that help maintain and develop this Astro project. These prompts work with various AI assistants including Warp AI, Cursor, GitHub Copilot, and others.

## Available Prompts

### 🚀 [start-development.md](./start-development.md)
**Purpose**: Start the development environment and verify everything is working  
**Use when**: Beginning a development session or troubleshooting startup issues  
**Key actions**: 
- Verify project setup
- Install dependencies if needed
- Start dev server
- Confirm everything is running correctly

### ⬆️ [upgrade-dependencies.md](./upgrade-dependencies.md)
**Purpose**: Comprehensively upgrade all project dependencies and tools  
**Use when**: Regular maintenance, security updates, or getting latest features  
**Key actions**: 
- Check current versions
- Upgrade Astro using official upgrade tool
- Upgrade Bun runtime
- Commit changes with proper format
- Verify everything still works

## How to Use These Prompts

### For Warp AI (Agent Mode)
1. Open the prompt file and copy the entire content
2. Paste into Warp's Agent Mode
3. The AI will execute the steps automatically

### For Cursor or Other AI Assistants
1. Reference the prompt by saying something like:
   - "Follow the upgrade-dependencies prompt in the prompts folder"
   - "Use the start-development procedure from prompts/start-development.md"
2. The AI will read the file and follow the documented steps

### Manual Use
You can also use these as checklists for manual execution of common tasks.

## Prompt Structure

Each prompt follows this structure:
- **Project Context**: Specific details about this project
- **Task**: Clear objective
- **Steps to Execute**: Numbered, actionable steps
- **Key Files**: What files might change
- **Troubleshooting**: Common issues and solutions
- **Usage for Other AIs**: Instructions for different AI systems

## Project-Specific Conventions

### Commit Message Format
This project uses: `[type] Description.`
- Square brackets around type
- Lowercase type (chore, feat, fix, etc.)
- Period at the end
- Specific version numbers for upgrades

### Package Manager
This project uses **Bun** exclusively:
- Use `bun` commands instead of `npm` or `yarn`
- Use `bunx` for running packages
- Lock file is `bun.lockb` (binary format)

### Development Server
- Runs on `http://localhost:4321/`
- Started with `bun dev`
- Supports hot reloading

## Adding New Prompts

When adding new prompts:
1. Follow the established structure above
2. Include project-specific context
3. Provide clear, actionable steps
4. Add troubleshooting notes
5. Include usage instructions for different AIs
6. Update this README with the new prompt

## Maintenance

Review and update these prompts when:
- Project structure changes
- New tools are added
- Development workflow changes
- Dependency management changes
- Issues are discovered in the current prompts