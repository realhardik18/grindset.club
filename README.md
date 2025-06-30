# grindset.club

## Overview

grindset.club is an AI-powered productivity web app designed to help users achieve their goals through incremental, personalized task breakdowns. You simply enter your goal, and the AI agent analyzes your current capabilities and desired timeframe, then generates a step-by-step plan. The app guides you by providing one actionable task at a time, collects your feedback, and adapts the next task to be slightly more challenging, ensuring continuous progress.

### Key Features
- **AI Goal Breakdown:** Enter any goal and the AI will decompose it into the smallest actionable steps tailored to your skills and timeline.
- **Adaptive Task Progression:** Receive one task at a time; as you complete tasks and provide feedback, the next task is generated to be more challenging, promoting growth.
- **Progress Tracking:** Visual dashboards show your progress, completion rates, and days remaining.
- **Goal Editing & Deletion:** Easily update or remove goals with confirmation modals.
- **Task History:** Review completed and pending tasks for each goal.
- **Integrated Chat:** Chat with the AI agent for debriefs, advice, or web search assistance (powered by Tavily).

## Tech Stack
- **Next.js (App Router):** Modern React framework for server-side rendering and routing.
- **React:** Component-based UI development.
- **Tailwind CSS:** Utility-first CSS framework for rapid, responsive design.
- **MongoDB:** NoSQL database for storing user goals, tasks, and progress.
- **Clerk:** Authentication and user management.
- **Lucide-react:** Icon library for a modern UI.
- **Tavily API:** Enables AI-powered web search within the chat feature.

## Project Structure
- `app/` — Main Next.js app directory, including pages, API routes, and components.
- `models/` — Mongoose models for goals and tasks.
- `lib/` — Database connection utilities.
- `public/` — Static assets (icons, images).
- `components/` — Reusable React components (e.g., Sidenav, GoalModal).

