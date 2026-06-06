# Spotify Workspace

A containerized, multi-repository architecture simulating a Spotify clone ecosystem. This repository serves as the parent workspace orchestrating decoupled services managed via Git Submodules, featuring automated distributed CI/CD workflows.

---

## 🏗️ Architecture Overview

This project implements a classic three-tier enterprise architecture pattern, decoupled into independent micro-repositories to ensure separation of concerns and team autonomy.

* **Frontend:** Single Page Application (SPA) built with **Angular 21**.
* **Backend:** RESTful API built with **Node.js** and Express.
* **Database:** Relational data persistence layer driven by **MySQL 8.0**.
* **Orchestration:** Multi-container runtime managed via **Docker Compose**.

---

## 🛠️ Tech Stack

* **Frontend:** Angular 21, TailwindCSS, Jest
* **Backend:** Node.js, Express, Jest
* **Database:** MySQL 8.0 (with persistent volume masking)
* **DevOps & Infra:** Docker, Docker Compose, GitHub Actions (Distributed Event-Driven CI)

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed locally:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Git](https://git-scm.com/)

### Installation & Setup

Since this workspace utilizes **Git Submodules**, a standard clone will leave the service folders empty. You must clone recursively:

```bash
# Clone the repository along with all submodules
git clone --recursive https://github.com/sebastianarrue/spotify-workspace.git

# Navigate into the project root
cd spotify-workspace
```

If you already cloned the repository without the submodules flag, initialize them manually:
```bash
git submodule update --init --recursive
```

### Running Locally with Docker

The entire ecosystem is orchestrated via Docker Compose. To spin up the database, backend, and frontend environments simultaneously, run:

```bash
docker compose up --build
```

* **Frontend Access:** `http://localhost:8080`
* **Backend API Access:** `http://localhost:3000`
* **Database Internal Port:** `3306` (Mapped to host port `3307` to avoid local conflicts)

---

## 🔄 CI/CD Pipeline Architecture

This workspace implements an advanced **Event-Driven Continuous Integration** pipeline using GitHub Actions.

```text
[ Submodule Push ] ──> [ Repository Dispatch ] ──> [ Parent Workspace CI ]
                                                          │
   ┌──────────────────────────────────────────────────────┴─────────────────────────────────────────────────────┐
   ▼                                                      ▼                                                     ▼
[ Setup Node.js v22 ] ─────────────────────────> [ Run Test Suites (Jest) ] ──────────────────────────> [ Docker Compose Build ]
```

### Pipeline Flow:
1.  **Distributed Triggers:** A commit pushed to either `spotify-nodejs` or `spotify-angular` sends a secure `repository_dispatch` webhook to this parent repository.
2.  **Workspace Validation:** The parent workflow automatically catches the signal, updates its submodule pointers to the latest commits, and spins up a Linux runner.
3.  **Shift-Left Testing:** Installs Node.js v22, provisions dependency caching to minimize runtime overhead, and executes isolated unit tests via **Jest** for both frontend and backend.
4.  **Infrastructure Compilation:** If tests pass successfully, the runner validates the multi-container configuration by executing `docker compose build`.
