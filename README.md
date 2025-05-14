# 🗳️ Real-Time Polling Application

A responsive real-time polling app built with **React + TypeScript** on the frontend and **Node.js + Socket.IO** on the backend. Users can create or join poll rooms and vote on binary questions, with live updates and countdown timers.

## 🚀 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Styling**: Tailwind CSS
- **Real-Time**: WebSockets via Socket.IO

---

## ✨ Core Features

- ✅ **Name-only authentication** — no passwords, just enter your name to join or create a room.
- 🏠 **Create or Join Poll Rooms** — unique room codes allow multiple users to vote together.
- 📊 **Live Voting & Results** — vote on one of two options and instantly see the live tally update.
- ⏳ **60-Second Countdown** — each poll auto-locks after one minute of voting.
- 🔁 **Duplicate Vote Prevention** — voting is locked per user using `localStorage`.
- 📱 **Responsive Design** — optimized layout for mobile, tablet, and desktop.
- 🎨 **Minimalist UI** — subtle animations, clear user feedback, and micro-interactions.

---

## 🎨 Design System

- **Primary Color**: `#3B82F6` (Blue)
- **Accent Color**: `#8B5CF6` (Purple)
- **Success Color**: `#10B981` (Green)
- **Neutral Grays**: for backgrounds, borders, and muted text

The interface uses card-based layouts with soft shadows, responsive typography, and animated vote bars for an engaging experience.

---

## 📁 Folder Structure

project-root/
│
├── .config/                 # Custom configuration directory (if used)
├── node_modules/            # Installed dependencies
├── server/                  # Backend (Node.js + Socket.IO)
├── src/                     # Frontend source code (React + TypeScript)
│
├── .gitignore               # Git ignored files
├── eslint.config.js         # Linting rules
├── index.html               # Entry HTML for Vite (React)
├── package-lock.json        # Lock file
├── package.json             # Project metadata and scripts
├── postcss.config.js        # PostCSS config
├── tailwind.config.js       # Tailwind CSS config
├── tsconfig.app.json        # TypeScript config for app
├── tsconfig.json            # Base TypeScript config
├── tsconfig.node.json       # TypeScript config for Node server
├── vite.config.ts           # Vite config for frontend bundling

2. Install Dependencies
Backend
----bash----
cd server
npm install
Frontend
----bash----
cd ../client
npm install

Start Backend Server
----bash----
cd ../server
node index.js
Start Frontend
----bash----
cd ../client
npm run dev
