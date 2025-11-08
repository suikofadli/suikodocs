# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the Indonesian documentation website for Inertia.js, built with Docusaurus. It's a comprehensive translation and localization project that provides Indonesian developers with complete Inertia.js documentation in their native language.

## Tech Stack & Architecture

- **Framework**: Docusaurus 3.9.2 with TypeScript
- **Styling**: Custom CSS with CSS variables and gradient themes
- **Syntax Highlighting**: Prism with Dracula theme, PHP support enabled
- **Typography**: Inter (sans-serif) and JetBrains Mono (code)
- **Deployment**: Vercel (primary), supports GitHub Pages and Netlify

### Key Architecture Points

- **Content Structure**: Documentation organized in `/docs/` with nested categories
- **Sidebar Configuration**: Manually defined in `sidebars.ts` with `inertiaSidebar` as the main sidebar
- **Theme Configuration**: Custom gradient theme with Dracula syntax highlighting always enabled
- **Internationalization**: Set to Indonesian (`id`) locale only
- **Code Syntax**: PHP highlighting explicitly configured via `additionalLanguages: ["php"]`

## Development Commands

```bash
# Start development server
npm start

# Build for production
npm run build

# Serve production build locally
npm run serve

# Type checking
npm run typecheck

# Clear Docusaurus cache
npm run clear

# Write translations (if needed)
npm run write-translations

# Deploy to GitHub Pages
npm run deploy
```

## Important Configuration Files

### `docusaurus.config.ts`
- Main configuration file with TypeScript support
- Dracula theme always enabled for both light and dark modes
- PHP syntax highlighting configured
- Indonesian locale (`id`) as default and only locale
- Custom navbar and footer structure

### `sidebars.ts`
- Defines `inertiaSidebar` with comprehensive documentation structure
- Organized into logical categories: Introduction, Installation, Core Concepts, The Basics, Data & Props, Security, Advanced
- Each doc has explicit `id` and `label` for proper navigation

### `src/css/custom.css`
- Custom gradient theme inspired by Inertia.js official design
- Comprehensive CSS variables for light/dark mode
- Enhanced styling for code blocks, tables, cards, and alerts
- Gradient animations and hover effects
- Responsive design adjustments

## Content Management

### Documentation Structure
- All documentation files are in `/docs/` directory
- Installation guide split into `server-side-setup.md` and `client-side-setup.md`
- Content follows Inertia.js official documentation structure
- Indonesian translations maintain technical English terms where appropriate

### Translation Guidelines
- Use proper Indonesian language while keeping technical terms in English
- Maintain original markdown structure and formatting
- Do not add or remove content - translate only
- Fix indentation and code formatting issues
- Keep code examples exactly as in original documentation

### Adding New Documentation
1. Create `.md` files in appropriate `/docs/` subdirectory
2. Add entries to `sidebars.ts` in relevant category
3. Use proper frontmatter with `sidebar_position` if needed
4. Ensure Indonesian language consistency

## Code Formatting Standards

### Code Blocks
- Use Dracula theme for syntax highlighting
- PHP support is enabled and configured
- Proper indentation (4 spaces for PHP, 2 spaces for other languages)
- Language identifiers must be specified (e.g., ```php, ```bash)

### Markdown Structure
- Maintain consistent heading hierarchy
- Use proper markdown syntax
- Keep frontmatter clean and minimal
- Ensure proper table formatting if used

## Theme Customization

### Custom CSS Variables
- `--inertia-primary`: Main brand color (#9553e9)
- `--gradient-start` and `--gradient-end`: Gradient colors
- Custom variables for navigation, sidebar, and footer styling
- Dark mode variants for all custom variables

### Utility Classes
- `.gradient-text`, `.gradient-bg`: Gradient styling
- `.card`, `.card-gradient`: Card components
- `.alert`, `.alert--gradient`: Notice components
- `.button`: Custom button styling

## Deployment Notes

- **Primary**: Vercel with automatic deployment from `main` branch
- **Build Output**: `build/` directory
- **Environment**: Node.js 20+ required
- **Base URL**: Configured for root domain (`/`)

## Content Translation Workflow

When translating new content from Inertia.js official docs:
1. Fetch the latest content from https://inertiajs.com
2. Translate to Indonesian while preserving code blocks
3. Fix code indentation and formatting
4. Update sidebar configuration if adding new pages
5. Test in development server before committing

## Special Considerations

- This is a documentation site - avoid modifying core functionality
- Maintain consistency with Inertia.js official structure
- Test all changes in both light and dark modes
- Ensure responsive design works on mobile devices
- Keep code examples functional and properly formatted