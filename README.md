# 🧠 Blockchain Investigator

**Blockchain Investigator** is an interactive web app for visualizing Bitcoin wallet transactions.  
Enter any Bitcoin address and instantly explore its **connected wallets**, see **incoming/outgoing transactions**, and view how much each address has **sent** and **received**.  
The app is fully written in **TypeScript** with **Next.js**, supports **Docker**, and uses **react-force-graph-2d** for beautiful interactive visualization.

---

## 🚀 Quick Start (Run with Docker)

You can run this entire project with **one single Docker command** — no setup required.

##  1. Build the image
```bash
docker build -t blockchain-investigator .

##  2.run the container
docker run -p 3000:3000 blockchain-investigator

##  3.open your browser
http://localhost:3000


---

### If you prefer to run it manually using Node.js:
   git clone https://github.com/<your-username>/blockchain-investigator.git
   cd blockchain-investigator
   npm install
   npm run dev
   http://localhost:3000


---
