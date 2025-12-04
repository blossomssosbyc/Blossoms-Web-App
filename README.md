# Blossoms Web App

**Blossoms Web App** is a comprehensive web platform designed to streamline the management of the Blossoms inter-school competition — handling event registrations, scheduling, results tracking, and administrative workflows.

## 🚀 Overview

Blossoms Web App provides an all-in-one solution for organizing large-scale inter-school competitions. The platform features role-based access for administrators, organizers, and students, making event management efficient, transparent, and user-friendly.

Built with a modern tech stack and modular architecture, the app aims to automate administrative tasks, reduce manual overhead, and improve the overall competition experience for all stakeholders.

---

## ✨ Key Features

- **🔐 User Authentication** — Secure login system with role-based access control
- **📋 Event Management** — Create, edit, and manage competition events seamlessly
- **📝 Registration System** — Simple and intuitive signup process for students and teams
- **📅 Scheduling & Timetables** — Automated event scheduling to avoid conflicts
- **🏆 Results Tracking** — Real-time results updates and dynamic leaderboards
- **📱 Responsive Design** — Optimized experience across desktop, tablet, and mobile devices
- **⚡ Modular Architecture** — Clean separation of concerns with client, server, and shared modules

---

## 📦 Tech Stack

- **Frontend:** React, Vite, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB / PostgreSQL (specify your choice)
- **Authentication:** JWT / OAuth (specify your method)
- **Deployment:** Vercel / Netlify / AWS (specify your platform)

---

## 🛠️ Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- MongoDB / PostgreSQL (if running locally)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/blossomssosbyc/Blossoms-Web-App.git
cd Blossoms-Web-App

# 2. Install dependencies for the client
cd client
npm install

# 3. Install dependencies for the server
cd ../server
npm install

# 4. Set up environment variables
# Create a .env file in both client and server directories
# See .env.example for required variables

# 5. Start the development servers

# Terminal 1 - Start the backend server
cd server
npm run dev

# Terminal 2 - Start the frontend client
cd client
npm run dev
```

### Environment Variables

Create `.env` files in both `client/` and `server/` directories:

**server/.env**

```env
PORT=3000
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

**client/.env**

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Blossoms Web App
```

---

## 🎯 Usage

1. Open your browser and navigate to `http://localhost:5173` (or the port displayed in your terminal)
2. **Sign up** or **log in** with your credentials
3. **Admins** can access the dashboard to create and manage events
4. **Students** can browse available events and register for competitions
5. View **schedules**, **results**, and **leaderboards** in real-time

---

## 📁 Project Structure

```
Blossoms-Web-App/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── utils/       # Helper functions
│   │   └── App.tsx      # Main app component
│   └── package.json
├── server/              # Backend Express API
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── models/      # Database models
│   │   ├── routes/      # API routes
│   │   └── middleware/  # Custom middleware
│   └── package.json
├── shared/              # Shared types and utilities
└── README.md
```

---

## 🧪 Running Tests

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

---

## 🚀 Deployment

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy the 'dist' folder to your hosting platform
```

### Backend (Heroku/Railway/AWS)

```bash
cd server
# Follow your platform's deployment guide
# Ensure environment variables are configured
```

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

For questions, issues, or feedback:

- Open an issue on [GitHub Issues](https://github.com/blossomssosbyc/Blossoms-Web-App/issues)
- Reach out via email: *blossoms.byc@gmail.com*

---

## 🙏 Acknowledgments

- Built with ❤️ for the Blossoms Competition
- Thanks to all contributors and supporters
- Special thanks to the open-source community

---

⭐ **If you find this project helpful, consider giving it a star!**
