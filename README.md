# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

# Editorially

Editorially is a React-based editorial and content management system for a student publication workflow. It supports article creation, review, publishing, user management, project tracking, and reader-facing content pages.

## Table of Contents

- [Overview](#overview)
- [Purpose](#purpose)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [Building for Production](#building-for-production)
- [Using the System](#using-the-system)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

Editorially is structured as a multi-role application with separate views for:

- readers
- editors
- admins
- members
- superadmins

It is designed to manage the full publication workflow in one system.

## Purpose

The system is intended to help a publication team:

- publish and read articles
- manage editorial requests
- assign tasks to team members
- organize projects and deadlines
- review content before publication
- manage different user roles and permissions

## Features

### Reader-side

- article listing and discovery
- featured content sections
- recent articles
- public-facing pages and layouts

### Editorial and admin tools

- article management
- content editing and review
- approval and rejection workflows
- request and change management
- member and user administration
- project and task tracking
- modal-based add/edit/confirm/delete actions

### System features

- role-based templates and routes
- reusable UI components
- shared context and state management
- dark mode support
- Supabase integration

## Tech Stack

- React
- Vite
- JavaScript / JSX
- CSS
- Supabase

## Project Structure

Key folders inside `src/`:

- `components/` - reusable UI components
- `pages/` - route-level pages for admin, reader, login, CMS, members, and more
- `templates/` - shared layout templates
- `context/` - global state and hooks
- `functions/` - database helpers and business logic
- `assets/` - images and static assets
- `AlertModals/` - shared alert and confirm dialogs

Examples:

- `pages/admin/` - admin dashboard and admin pages
- `pages/reader/` - public reading experience
- `pages/login_register/` - authentication screens
- `components/articleManagement/` - article workflow tools
- `components/project/` - project and task management tools

## Prerequisites

Before setting up the project, make sure you have:

- Node.js installed
- npm, pnpm, or yarn
- access to the required Supabase project
- Visual Studio Code or another code editor

Recommended versions:

- Node.js 18+
- npm 9+

Verify your installation:

```bash
node -v
npm -v
```

## Setup Instructions

### 1) Clone the repository

```bash
git clone <repository-url>
cd Editorially
```

If the project is already on your machine, open the folder in VS Code.

### 2) Install dependencies

Using npm:

```bash
npm install
```

Using pnpm:

```bash
pnpm install
```

Using yarn:

```bash
yarn install
```

### 3) Configure environment variables

Create a `.env` file in the project root and add the required Supabase credentials.

Example:

```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If additional environment variables are used in the codebase, add them here as well.

### 4) Set up Supabase

Make sure your Supabase project includes:

- required tables and columns
- authentication configuration
- storage buckets, if image uploads are used
- row-level security policies, if applicable

### 5) Run the development server

Start the app:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```bash
http://localhost:5173
```

## Environment Variables

The exact variable names may vary depending on the implementation. The Supabase client commonly expects:

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Check `src/supabaseClient.js` to confirm the required values.

## Running the App

### Development mode

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

If your `package.json` uses different scripts, use those instead.

## Building for Production

To generate a production-ready build, run:

```bash
npm run build
```

Then verify it locally:

```bash
npm run preview
```

## Using the System

### Reader workflow

1. Open the public reader pages.
2. Browse featured and recent articles.
3. Open an article to read its full content.

### Editorial workflow

1. Log in with an editorial account.
2. Open the article management page.
3. Create or edit content.
4. Submit for review or request changes.
5. Track status through the workflow.

### Admin workflow

1. Log in as an admin.
2. Open the dashboard.
3. Manage members, projects, and tasks.
4. Review and approve content.
5. Use modals for create, edit, and delete actions.

### Superadmin workflow

1. Log in with elevated permissions.
2. Access system-level administration pages.
3. Manage global settings and organizational data.

## Troubleshooting

### Dependencies fail to install

- confirm the Node.js version
- delete `node_modules` and reinstall
- clear the npm cache if needed:

```bash
npm cache clean --force
npm install
```

### App does not connect to Supabase

- verify `.env` values
- restart the dev server after editing environment variables
- confirm the Supabase project is active

### App does not load correctly

- check the terminal for build errors
- inspect the browser console
- confirm all imports and asset paths are correct

### Missing styles or images

- verify file names and paths
- restart the dev server after renaming files
- check for case-sensitive import issues

## Contributing

When contributing to this project:

1. Create a branch for your change.
2. Make focused updates.
3. Test locally.
4. Update documentation if behavior changes.
5. Keep components reusable and consistent with the existing structure.

Example branch names:

```bash
feature/article-editor
fix/supabase-auth
chore/readme-update
```

## License

Add the appropriate license for your organization or publication before distributing this project publicly.

If no license has been defined, treat the repository as private and internal by default.
