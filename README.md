# Aionda OrgChart

> **Experimental** — Not ready for production use.

> Build an AI-native company with [OpenClaw](https://openclaw.org) — where most of your workforce are AI agents.

## What is this?

**Aionda OrgChart** is a real-time organizational chart editor designed for companies that employ both human and AI workers. Built on the premise that modern organizations can leverage AI agents (powered by OpenClaw) as first-class team members, this tool provides:

- **Visual Org Chart Editor** — Drag, drop, and manage your entire organization in a beautiful dark-themed interface
- **AI & Human Employees** — Create and manage both AI agents and human team members side by side
- **Real-time Matrix Integration** — See who's online/offline in real-time via the Matrix protocol
- **Direct Chat** — Chat with any team member directly from the org chart via Matrix
- **GraphQL Subscriptions** — Live updates when employees come online, go offline, or when the org structure changes
- **Department Management** — Organize your workforce into departments with drag-and-drop support

## The AI-Native Company

With OpenClaw, you can deploy AI agents that communicate and collaborate via Matrix. These agents can:

- Perform research, development, content creation, sales, and more
- Operate 24/7 with real-time status monitoring
- Be organized into departments just like human employees
- Be chatted with directly from the org chart

This tool is the control center for managing your AI-native workforce.

## Tech Stack

- **Backend**: Node.js, Express, Apollo Server (GraphQL), GraphQL Subscriptions (WebSocket)
- **Frontend**: React, TypeScript, Apollo Client, Framer Motion
- **Protocol**: Matrix (for presence detection and messaging)
- **Testing**: Jest, Vitest, Playwright

## Getting Started

### Prerequisites

- Node.js 20+
- A Matrix homeserver account (optional, for presence features)

### Installation

```bash
git clone https://github.com/AiondaDotCom/orgchart.git
cd orgchart
npm install
```

### Configuration

Copy the environment template and configure your Matrix credentials:

```bash
cp .env.example server/.env
```

Edit `server/.env` with your Matrix homeserver details.

### Development

```bash
npm run dev
```

This starts both the backend (port 4000) and frontend (port 5173).

### Testing

```bash
# Unit tests
npm test

# With coverage
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e
```

## Architecture

```
orgchart/
├── server/          # GraphQL API server
│   └── src/
│       ├── index.ts           # Express + Apollo Server
│       ├── schema.ts          # GraphQL type definitions
│       ├── resolvers.ts       # Query, Mutation, Subscription resolvers
│       └── services/
│           ├── dataStore.ts   # In-memory data store
│           └── matrixService.ts # Matrix SDK integration
├── client/          # React frontend
│   └── src/
│       ├── components/        # React components
│       ├── graphql/           # GraphQL operations
│       ├── hooks/             # Custom React hooks
│       └── styles/            # Theme & styling
└── e2e/             # Playwright E2E tests
```

## License

MIT

## Credits

Built by [Aionda](https://aionda.com) with AI-powered development workflows.
