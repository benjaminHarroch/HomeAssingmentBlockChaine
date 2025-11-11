# 🔗 Blockchain Investigator Tool

## 📖 Overview

This project is a graphical tool for blockchain investigators.  
It allows users to input a Bitcoin wallet address and visualize the related transactions as a dynamic directed graph.  
Each node represents a wallet address, and each edge represents a transaction (asset transfer).  
Users can click on nodes to expand and load additional connected wallets dynamically.

The tool also provides:
- A collapsible log window showing all API calls to the blockchain provider  
- A wallet details panel that updates when selecting a new node  
- Loading indicators and error handling  

---

## 🧰 Technologies Used

- **Next.js 14 (App Router Architecture)** — Fullstack framework for both frontend and backend routes  
- **TypeScript** — Type-safe and maintainable code  
- **React / Hooks** — State management and reactivity  
- **react-force-graph** — Interactive graph visualization with directional arrows  
- **Material-UI (MUI)** — Responsive UI components  
- **Axios / Fetch API** — Data fetching  
- **Jest + React Testing Library** — Unit and component testing  
- **Docker** — Containerized environment for easy setup and deployment  

---

## 🚀 Getting Started

### 1️⃣ Install Dependencies
```bash
npm install
npm run dev

---

###🧪 Running Tests
This project includes unit and component tests to ensure reliability and maintainability.
Tests cover core modules such as API routes, hooks, and React components.
Run all tests

npm run test

---

