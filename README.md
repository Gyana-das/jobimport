#  Artha Job Importer – Scalable Job Queue System

A full-stack MERN-based **Job Importer System** designed to fetch job data from external APIs, queue them for background processing using **Redis + Bull**, store them in **MongoDB**, and display import history via a **Next.js** admin panel.

---

##  Tech Stack

| Layer               | Technology           | Description                           |
| ------------------- | -------------------- | ------------------------------------- |
| **Frontend**        | Next.js (JavaScript) | Admin UI for import tracking using pagination|
| **Backend**         | Node.js + Express    | REST APIs for job import and tracking |
| **Database**        | MongoDB              | Job and import logs storage           |
| **Queue**           | Bull / BullMQ        | Job queue and worker management       |
| **Queue Store**     | Redis                | Queue state persistence               |
| **Deployment**      | AWS EC2              | Deployed backend & frontend           |
| **Version Control** | Git + GitHub         | Code management                       |

---

## 📁 Project Structure

├── client/                        # Next.js frontend
│   ├── app/                       # App router pages
│   ├── components/                # Reusable UI components
│   ├── utils/                     # Helper functions
│   ├── public/                    # Static assets (logos, images, etc.)
│   └── .env                       # Frontend environment variables
│
├── server/                        # Express backend
│   ├── config/                    # Configuration files (DB, Redis, etc.)
│   ├── controller/                # Route controllers
│   ├── model/                     # MongoDB schemas (Job, ImportLog)
│   ├── routes/                    # API routes
│   ├── services/                  # Business logic and helpers
│   ├── workers/                   # Bull queue workers
│   ├── app.js                     # Express app setup
│   ├── server.js                  # Entry point
│   └── .env                       # Backend environment variables
│
├── docs/
│   └── architecture.md            # Architecture documentation
│
├── README.md
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the **server/** directory:

```bash
PORT=5001
MONGODB_URI=mongodb+srv://ranjangyana259:ranjangyana259@cluster1.xw3ri.mongodb.net/job_import
REDIS_URL=redis://127.0.0.1:6379

```

---

## 🚀 Installation & Setup

### Backend Setup

```bash
cd server
npm install
npm run start
```
### Backend Setup for worker

```bash
cd server/worker
node jobWorkers.js

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🧠 Core Features

### 1. **Job Source API Integration**

* Fetches XML job feeds from external sources.
* Converts XML → JSON.
* Inserts or updates jobs in MongoDB every hour using cron.

### 2. **Queue-Based Processing**

* Redis + Bull handles background job queues.
* Configurable concurrency for scalable processing.
* Error handling and retry logic built in.

### 3. **Import History Tracking**

* Each import run logs:

  * Timestamp
  * Total fetched, new, updated, and failed jobs
  * Failure reasons
* Stored in `import_logs` collection.

### 4. **Admin UI (Next.js)**

* Displays import logs and job data.
* Visual metrics for tracking import performance.

---

## 📊 Example Import Log

| File Name   | Total | New | Updated | Failed | Date       |
| ----------- | ----- | --- | ------- | ------ | ---------- |
| jobicy_feed | 250   | 180 | 60      | 10     | 2025-10-30 |

---

## 🧠 Bonus Implementations
* Retry + exponential backoff for failed jobs
* Environment-configurable concurrency

---

## ☁️ Deployment

Deployed on **AWS EC2**:

* Backend: Node.js + PM2
* Frontend: Next.js served via Nginx proxy
* MongoDB Atlas + Redis Cloud

---

## 🧑‍💻 Author

**Gyana Ranjan Das**
📧 [ranjangyana259@gmail.com](mailto:ranjangyana259@gmail.com)
🌐 [GitHub – Gyana-das](https://github.com/Gyana-das)

---
