# Habit Tracker Pro

A habit tracking app built with vanilla JavaScript, HTML, and CSS — no frameworks, no build tools. Built as a learning project to practice core JavaScript fundamentals before moving on to React.

**[Live demo](https://habits-app-navy.vercel.app/)**

<img width="1887" height="950" alt="image" src="https://github.com/user-attachments/assets/08a0f00f-cb26-45bd-a9ff-f2743b1d9b59" />




## Features

- Add, edit, and delete habits, organized by category (Health, Learning, Work, Home, Personal)
- Mark habits complete/incomplete for the day, with undo
- Daily streak tracking and a 7-day mini calendar per habit (click any day to toggle it)
- Filter by All / Active / Completed
- Dashboard with total habits, completions today, total completions, best streak, and weekly progress
- Data persists locally via `localStorage`
- Keyboard support (press Enter to add a habit)
- Accessible: labeled form fields, `aria-label`s on icon buttons, visible focus states

## Tech stack

- HTML, CSS, vanilla JavaScript (ES Modules)
- [Vitest](https://vitest.dev/) for unit testing pure logic functions
- Deployed on [Vercel](https://vercel.com/)

## Architecture

The app is split into five ES modules by responsibility:

- `dom.js` — DOM element references
- `logic.js` — pure functions (streaks, progress calculations, filtering), fully unit tested, no DOM access
- `storage.js` — `localStorage` persistence and habit state mutations
- `render.js` — all DOM creation and rendering
- `script.js` — wiring: event listeners and app bootstrap

## Running locally

\`\`\`bash
git clone https://github.com/Horlivka/habits-app.git
cd habits-app
open index.html
\`\`\`

No build step required.

## Running tests

\`\`\`bash
npm install
npm test
\`\`\`

## What I'd improve next

- Rewrite in React + TypeScript
- Add more test coverage
- Add a backend/API-backed version
