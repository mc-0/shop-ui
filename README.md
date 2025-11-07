# Shop UI

A modern recipe and grocery management application built with Next.js 14.

## Features

- **Recipe Management**: Browse, filter, edit recipes and view ingredients
- **Grocery Inventory**: Add, delete, and filter grocery items
- **Shopping List**: Organize items by store and generate formatted lists
- **Dark Mode**: Clean, readable dark theme optimized for extended use

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- PrimeReact UI Components
- Zustand State Management

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## API Configuration

The app connects to a backend API at `http://192.168.1.93:8080`. Update the API URL in `app/lib/api.ts` if needed.

## Project Structure

```
app/
├── components/       # React components
│   ├── recipes/     # Recipe management
│   ├── groceries/   # Grocery management
│   └── shopping-list/ # Shopping list
├── lib/            # Utilities and services
│   ├── api.ts      # API client
│   └── store.ts    # Zustand store
├── types/          # TypeScript types
├── globals.css     # Global styles
├── layout.tsx      # Root layout
└── page.tsx        # Main page
```
