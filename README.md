# Blossoms Web App

![Blossoms Banner](https://img.shields.io/badge/Blossoms-2025--26-purple?style=for-the-badge&logo=sparkles)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Drizzle](https://img.shields.io/badge/drizzle-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)

**Blossoms Web App** is the next-generation platform for managing the "Blossoms" inter-school competition. It combines a stunning neon aesthetic with powerful administrative tools to handle events, live scoring, reporting, and real-time visualization of results.

---

## ✨ Features

### 📅 Interactive Events Timeline

- **Immersive Interface:** A beautiful, scroll-triggered timeline showcasing all events.
- **Winner Announcements:** "View Results" integration allows instant access to event winners directly from the timeline card.
- **Live Status:** Visual indicators for Upcoming, Ongoing, and Completed events.

### 📊 Points Dashboard

- **Live Calculations:** Real-time aggregation of scores from AWS/Database.
- **Matrix Mode:** A cyberpunk-inspired "Matrix" view for raw data analysis.
- **Dynamic Visuals:** Interactive charts and graphs powered by **Recharts**.
- **Visual Loader:** A sleek, custom-built "Trophy" loader animation for data fetching states.

### 📄 Administrative Tools

- **Report Generation:** Automated tools to generate detailed event reports.
- **Registration Management:** Streamlined workflow for tracking student and school registrations.

### 🎨 UX & Engineering

- **Smooth Scrolling:** Custom physics-based smooth scrolling hook (`useSmoothScroll`) for a premium "app-like" feel.
- **Modern Animations:** Extensive use of **GSAP** and **Framer Motion** for revealing elements, modal transitions, and hover effects.
- **Responsive Design:** Fully optimized for all screen sizes with a mobile-first approach.

---

## 📦 Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (via Neon Serverless), Drizzle ORM
- **State/Data:** TanStack Query
- **Visualization:** Recharts, Lucide React
- **Authentication:** Passport.js, Express Session

---

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js** (v18+)
- **npm** (v9+)
- **Git**

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/blossomssosbyc/Blossoms-Web-App.git
    cd Blossoms-Web-App
    ```

2.  **Install Dependencies**
    Root directory handles both client and server dependencies.

    ```bash
    npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory.

    ```env
    # Database
    DATABASE_URL=postgres://user:password@host/dbname

    # Server
    PORT=5000
    SESSION_SECRET=your_super_secret_key

    # App
    NODE_ENV=development
    ```

4.  **Run Development Server**
    This command starts the backend server, which also serves the frontend.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5000`.

---

## 📁 Project Structure

```bash
Blossoms-Web-App/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components from Shadcn/Custom
│   │   ├── hooks/       # Custom hooks (e.g., useSmoothScroll)
│   │   ├── pages/       # Main pages (EventsTimeline, PointsCalculation, etc.)
│   │   └── App.tsx      # Main entry point
├── server/              # Backend Express application
│   ├── routes.ts        # API Routes
│   └── storage.ts       # Database storage interface
├── shared/              # Shared Zod schemas and types
├── drizzle.config.ts    # Drizzle ORM config
├── package.json         # Root dependencies and scripts
└── vite.config.ts       # Vite configuration
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  **Fork** the repository.
2.  Create a feature branch: `git checkout -b feature/awesome-feature`
3.  **Commit** your changes: `git commit -m 'Add awesome feature'`
4.  **Push** to the branch: `git push origin feature/awesome-feature`
5.  Open a **Pull Request**.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ by the Blossoms Tech Team</sub>
  <br />
  <br />
  <a href="https://github.com/Shashwat-19">
    <img src="https://img.shields.io/badge/Shashwat--19-181717?style=for-the-badge&logo=github&logoColor=white" alt="Shashwat-19" />
  </a>
  &nbsp;
  <a href="https://github.com/vishnuu-s">
    <img src="https://img.shields.io/badge/Vishnuu--s-181717?style=for-the-badge&logo=github&logoColor=white" alt="vishnuu-s" />
  </a>
  &nbsp;
  <a href="https://github.com/Shruthi-Chhabhaiya">
    <img src="https://img.shields.io/badge/Shruthi--Chhabhaiya-181717?style=for-the-badge&logo=github&logoColor=white" alt="Shruthi-Chhabhaiya" />
  </a>
</div>
