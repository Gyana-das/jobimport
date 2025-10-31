# System Architecture – Artha Job Importer

## Overview

The **Artha Job Importer** is a scalable and modular system that automatically imports job listings from external XML APIs on a schedule using **Node Cron**, queues them using **Redis + BullMQ**, processes them asynchronously with worker threads, and stores them in **MongoDB**.
The entire system is monitored and managed through an **Admin Dashboard built with Next.js**.

---

## 🧩 High-Level Architecture

```
          ┌───────────────────────────────┐
          │       External Job APIs        │
          │ (Jobicy, HigherEdJobs, etc.)   │
          └──────────────┬────────────────┘
                         │
                (1) Fetch via Axios
                         │
                         ▼
          ┌───────────────────────────────┐
          │  Node.js Express Backend       │
          │  (app.js / server.js)          │
          │  - Handles routes, controllers │
          │  - Runs Node-Cron scheduler    │
          └──────────────┬────────────────┘
                         │
           (2) Push jobs to Redis queue
                         │
                         ▼
          ┌───────────────────────────────┐
          │   BullMQ Queue (Redis)         │
          │   - Manages job queue state    │
          │   - Supports retries/backoff   │
          └──────────────┬────────────────┘
                         │
              (3) Worker consumes queue
                         │
                         ▼
          ┌───────────────────────────────┐
          │   Worker Process (jobWorker)   │
          │   - Validates & transforms data│
          │   - Inserts/updates MongoDB    │
          │   - Logs failures & successes  │
          └──────────────┬────────────────┘
                         │
              (4) Save to MongoDB
                         │
                         ▼
          ┌───────────────────────────────┐
          │   MongoDB Database             │
          │   - jobs collection            │
          │   - import_logs collection     │
          └──────────────┬────────────────┘
                         │
              (5) API → Frontend Fetch
                         │
                         ▼
          ┌───────────────────────────────┐
          │  Next.js Admin Dashboard       │
          │  - Displays import history     │
          │  - Shows job stats & failures  │
          │  - Allows manual triggers      │
          └───────────────────────────────┘
```

---

## 🧱 Component Breakdown

### 1. **Cron Job Scheduler (Node-Cron)**

* Uses the `node-cron` package to schedule automatic job imports.
* Runs at defined intervals (e.g., every hour) to fetch job data.
* Fetches data from multiple XML feeds using **Axios**.
* Converts XML → JSON using **xml2js**.
* Pushes jobs into the BullMQ queue for background processing.

---

### 2. **Queue Management (BullMQ + Redis)**

* Uses **BullMQ** with **ioredis** to manage job queues.
* Each job is added to the queue with structured metadata.
* Failed jobs are automatically retried using exponential backoff.
* Redis serves as the persistent job store.

---

### 3. **Worker Service**

* Located in `/server/workers/jobWorker.js`.
* Continuously listens to Redis queues.
* Processes jobs concurrently:

  * Validates incoming data.
  * Inserts new jobs or updates existing ones in MongoDB.
  * Records success/failure metrics in `import_logs`.
* Provides fault-tolerant asynchronous job processing.

---

### 4. **Database Layer (MongoDB)**

* **jobs collection** → Stores imported job listings.
* **import_logs collection** → Tracks every import operation with:

  * Timestamp
  * Total fetched
  * New records
  * Updated records
  * Failed records (with reasons)
* Managed via **Mongoose models** under `/server/model/`.

---

### 5. **Backend API Layer**

* Built using **Express.js**.
* Structure follows:

  ```
  /server/
   ├── config/        # MongoDB, Redis, environment config
   ├── controller/    # Handles business logic for routes
   ├── model/         # MongoDB schemas
   ├── routes/        # Express routes (jobs, history)
   ├── services/      # Helper and integration logic
   ├── workers/       # Queue consumers
   ├── app.js         # Express app setup
   └── server.js      # Entry point
  ```
* Provides REST endpoints for:

  * Fetching job data
  * Triggering manual imports
  * Retrieving import history

---

### 6. **Frontend (Next.js – App Router)**

* Located under `/client/`.
* Built using **Next.js (App Router)** for improved performance.
* Key directories:

  ```
  client/
   ├── app/          # Application routes
   ├── components/   # Reusable UI components
   ├── utils/        # Helper utilities
   ├── public/       # Static assets
   └── .env          # API URL config
  ```
* Fetches import logs and job data from backend API.
* Displays:

  * Total imported, new, updated, failed jobs
  * Feed URL name (fileName)
  * Timestamp of import
* Optionally supports WebSocket updates for live status.

---

## ⚙️ Data Flow Summary

1. **Cron Trigger:** `node-cron` automatically triggers job fetching.
2. **Fetch Phase:** Axios retrieves XML job feeds → parsed via `xml2js`.
3. **Queue Phase:** Fetched jobs are queued in **Redis (BullMQ)**.
4. **Processing Phase:** Worker consumes queue, validates & saves data.
5. **Logging Phase:** Results are written to `import_logs` in MongoDB.
6. **UI Phase:** Next.js frontend fetches and displays import stats.

---

## 🧠 Design Decisions

| Component          | Choice           | Reason                                             |
| ------------------ | ---------------- | -------------------------------------------------- |
| **Cron Scheduler** | Node-Cron        | Lightweight and reliable task scheduling           |
| **Queue Manager**  | BullMQ + Redis   | Handles concurrency, retries, and failure recovery |
| **Database**       | MongoDB          | Flexible schema for job data                       |
| **Frontend**       | Next.js          | SSR + modern UI capabilities                       |
| **XML Parser**     | xml2js           | Easy conversion from XML to JSON                   |
| **Deployment**     | AWS EC2 +  | Scalable and production-ready setup                |

---

## ⚡ Scalability & Future Enhancements

* 🧩 Convert job fetcher and worker into microservices.
* 📡 Add real-time job progress updates using **Socket.IO**.
* 🐳 Containerize services using **Docker**.
* ☁️ Use **Redis Cloud** & **MongoDB Atlas** for global availability.
* 🔄 Support multiple feed sources dynamically from the database.

---

## 👨‍💻 Maintainer

**Gyana Ranjan Das**
Full Stack Developer (MERN)
📧 [ranjangyana259@gmail.com](mailto:ranjangyana259@gmail.com)
🌐 [GitHub – Gyana-das](https://github.com/Gyana-das)
