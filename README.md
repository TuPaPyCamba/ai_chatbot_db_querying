# Next.js Chatbot Architecture Skeleton 🤖

This project is a fully structured, full-stack Next.js web application designed as the foundation for an AI-powered chatbot. It enforces strict structural patterns for both the frontend (App Router) and the backend (API routes), ensuring modularity, scalability, and clean code separation.

> **🚧 Development State:** Currently, all database connections and authentication flows are **mocked**. This skeleton focuses on structural integrity, UI orchestration, and routing before integrating real data persistence.

---

## 🛠️ Technology Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Theming:** Dark/Light mode support (via `next-themes` or native Tailwind)
* **Internationalization (i18n):** Structural configuration for English (EN) and Spanish (ES)

---

## 🏗️ Frontend Architecture

The frontend is divided into two primary logical zones using Next.js Route Groups. Global components are strictly limited; instead, components are scoped locally to their respective routes.

* **`/(public)`:** Contains the Landing Page (`/`), Sign In (`/signin`), and Sign Up (`/signup`).
* **`/(private)`:** Contains the authenticated Dashboard (`/dashboard`).

### Strict Rendering Pattern

Every route follows a rigid 3-part file structure to separate metadata, layout orchestration, and UI components:

```plaintext
/app/(sector)/route-name/
├── page.tsx               # 1. ONLY defines and exports Metadata. Renders the View.
├── ViewName.tsx           # 2. Defines page layout and orchestrates local components.
└── /components/           # 3. Contains ONLY components specific to this route.
    ├── HeroSection.tsx
    ├── FeatureSection.tsx
    └── ...

```

---

## ⚙️ Backend Architecture

The backend follows a microservices approach organized by Features/Objects. It separates routing, orchestration, and business logic into distinct layers.

### Separation of Concerns

* **`routes.ts`**: Defines the HTTP method (GET, POST), applies middleware (auth/validation), and connects the request to the controller.
* **`endpoints.ts`**: The controller. It orchestrates the logic by calling services, but does not perform the heavy lifting itself.
* **`services/`**: Pure functions containing the core business logic (e.g., calling an LLM or a database).

### Directory Structure

```plaintext
/server (or /src/server)
├── /features/
│   └── /chatbot/
│       ├── routes.ts      # HTTP definitions and middleware
│       └── endpoints.ts   # Request/response orchestration
├── /services/
│   ├── /ai/               # Functions for LLM interaction
│   └── /database/         # Mocked data returns (Pending real DB)
└── /utils/
    └── /local_functions/  # Shared utilities (parsers, formatters, etc.)

```

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18.x or higher
* npm, pnpm, or yarn

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/TuPaPyCamba/ai_chatbot_db_querying>
cd <ai_chatbot_db_querying>

```


2. Install dependencies:
```bash
pnpm install

```


3. Run the development server:
```bash
pnpm run dev

```


4. Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) with your browser to see the result.

---

## 📋 Current Implementation Roadmap

* [x] **Initialization:** Next.js + Tailwind + TypeScript configured.
* [x] **Theming:** Dark/Light mode implemented.
* [x] **i18n:** Basic EN/ES dictionaries established.
* [x] **Public Sector:** Landing page, Sign-in, and Sign-up routes generated following the strict pattern.
* [x] **Private Sector:** Dashboard layout created (Sidebar for history + Main chat window).
* [x] **Mocked Auth:** Simulated login flow (redirects to `/dashboard` upon mock success).
* [x] **Backend Skeleton:** `/server` folders generated.
* [x] **Mocked DB:** Dummy JSON services implemented in `/services/database`.

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

```

```