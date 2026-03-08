# Quickstart — Connector Health Dashboard (React)

## Prerequisites
- Node.js 18+
- npm

## Local Development

```bash
npm install

# Start the backend API (Express)
npm run dashboard

# Start the React dev server
npm run dashboard:ui
```

## Production Build (planned)

```bash
# Build the React app
npm run dashboard:build

# Serve the built assets from the Express server
npm run dashboard
```

## Notes
- The React dev server will proxy API requests to `http://localhost:3000`.
- Health checks and change analysis use the existing Copilot SDK tools.
