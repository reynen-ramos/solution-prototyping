# Solution Prototyping

**Design your architecture visually. Generate production-ready code in any stack. Deploy to any cloud.**

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![React Flow](https://img.shields.io/badge/React_Flow-12-purple)](https://reactflow.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)

A visual architecture design tool where software engineers and solution architects drag-and-drop services onto a canvas, configure them, and generate a complete working application as downloadable source code.

> Think AWS Application Composer meets full-stack code generation with AI.

---

## Features

### Visual Architecture Canvas
- Drag and drop **7 service types** onto an interactive React Flow canvas
- Connect services with validated edges (rules prevent invalid connections)
- Snap-to-grid alignment and auto-layout (dagre)
- Undo/redo with full history stack

### Service Components

| Component | Icon | What it configures |
|-----------|------|--------------------|
| **API Service** | Server | Tech stack (.NET/Node.js/Python), endpoints, models, auth |
| **Database** | Database | Engine (PostgreSQL/SQL Server), tables, columns, seeds |
| **Frontend** | Monitor | Framework (React), pages, styling, routing |
| **Auth Service** | Shield | Provider (JWT/OAuth2/Session), registration, sessions |
| **Message Queue** | Messages | Engine (RabbitMQ/Kafka/Redis), topics |
| **Storage** | HardDrive | Provider (S3/Azure Blob/Local), buckets, file limits |
| **Serverless** | Zap | Runtime (Node.js/Python/.NET), functions, triggers |

### Multi-Stack Code Generation
- **Node.js** (Express + TypeScript + Prisma)
- **Python** (FastAPI + SQLAlchemy + Pydantic)
- **.NET 8** (ASP.NET Core + Entity Framework)
- Choose your stack **per service** — mix and match in a single project

### Infrastructure as Code
- **AWS Terraform** generation: VPC, ECS Fargate, RDS, S3, IAM, security groups
- Azure and GCP coming soon
- Docker + docker-compose for local development

### AI-Enhanced Generation
- Optional Claude AI integration for business logic
- Template-based scaffolding for deterministic boilerplate
- AI fills in route handlers, database queries, and API clients
- Your API key is never stored — used once per generation

### Starter Templates
- **SaaS Starter**: React + Node.js API + PostgreSQL + Auth
- **Microservices**: Multiple APIs + Queue + Shared DB + Frontend
- **E-Commerce**: Storefront + API + DB + Storage + Payment Queue
- **.NET Web API**: ASP.NET Core + SQL Server + React

### Additional Features
- Code preview with file tree before download
- Connection intelligence (auto-suggest tables from models)
- Dark mode with system preference detection
- Landing page at `/` with feature overview
- Keyboard shortcuts for power users

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/reynen-ramos/solution-prototyping.git
cd solution-prototyping

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page, then click **Start Designing** to open the designer.

---

## Project Structure

```
solution-prototyping/
├── apps/
│   └── web/                          # Next.js 16 application
│       └── src/
│           ├── app/                   # Pages and API routes
│           │   ├── designer/          # Main designer canvas page
│           │   └── api/generate/      # Code generation API endpoint
│           ├── components/
│           │   ├── canvas/            # React Flow canvas + suggestion bar
│           │   ├── nodes/             # Custom node components (7 types)
│           │   ├── edges/             # Custom edge component
│           │   ├── palette/           # Left sidebar component picker
│           │   ├── properties/        # Right sidebar config forms
│           │   ├── toolbar/           # Top toolbar + template gallery
│           │   ├── generation/        # Generate dialog + code preview
│           │   └── landing/           # Landing page
│           ├── stores/                # Zustand state (design, UI)
│           ├── types/                 # TypeScript type definitions
│           ├── lib/                   # Auto-layout, connection rules, Claude client
│           └── hooks/                 # Drag-drop, persistence, shortcuts, dark mode
├── packages/
│   └── templates/                    # Code generation template library
│       └── src/
│           ├── nodejs/               # Node.js/Express templates
│           ├── python/               # Python/FastAPI templates
│           ├── dotnet/               # .NET 8 templates
│           ├── react/                # React frontend templates
│           ├── database/             # SQL schema templates
│           ├── terraform/            # AWS Terraform templates
│           └── shared/               # Dockerfiles, docker-compose, configs
├── LICENSE
├── CONTRIBUTING.md
└── package.json                      # npm workspaces root
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16 (App Router) | SSR, API routes, routing |
| UI Library | React 19 | Component rendering |
| Canvas | React Flow (@xyflow/react 12) | Drag-and-drop node graph |
| State | Zustand 5 | Lightweight state management |
| Styling | Tailwind CSS 4 + shadcn/ui | UI components and design system |
| Templates | Handlebars 4 | Code scaffolding engine |
| AI | Claude API (Anthropic) | Business logic generation |
| Layout | dagre | Automatic node arrangement |
| Packaging | JSZip | ZIP assembly for downloads |

---

## How Code Generation Works

```
DesignDocument (your visual diagram as JSON)
    │
    ▼
[1. Validation]      ← required fields, valid connections
    │
    ▼
[2. Schema Builder]  ← transforms design into per-service contexts
    │
    ▼
[3. Template Engine]  ← Handlebars renders configs, Dockerfiles, boilerplate
    │
    ▼
[4. Claude AI]       ← (optional) generates route handlers, queries, API clients
    │
    ▼
[5. Merge & ZIP]     ← combines template + AI output, packages as ZIP
    │
    ▼
Download ready-to-run project (docker compose up)
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |
| `Ctrl+L` | Auto-layout |
| `Ctrl+G` | Open generate dialog |
| `Delete` / `Backspace` | Delete selected node or edge |
| `Escape` | Deselect |

---

## Roadmap

- [ ] Live in-browser preview of generated apps
- [ ] Azure and GCP Terraform generation
- [ ] Community template sharing
- [ ] Collaboration and team workspaces
- [ ] Go and Java tech stack support
- [ ] One-click deploy to Railway/Vercel/Fly.io

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and guidelines.

---

## License

[MIT](LICENSE)
