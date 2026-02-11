# System Architecture & Infrastructure Manual

## Overview

GlobalTrade BI follows a **"Local Cloud"** architecture paradigm. Unlike traditional SaaS solutions, this platform is designed to run entirely on-premise within a secure Micro-Datacenter. This ensures complete data sovereignty, low-latency access for local staff, and strict security controls.

The infrastructure leverages industry-standard open-source software to provide enterprise-grade virtualization, containerization, and identity management without recurring licensing fees.

---

## 🏗️ Hardware Architecture: The Micro-Datacenter

The entire platform is hosted on a single high-performance workstation or rack-mounted server acting as the host node.

**Recommended Hardware Specs:**
*   **CPU:** 64-bit Multi-core Processor (Intel Xeon or AMD EPYC/Ryzen with VT-x/AMD-V support).
*   **RAM:** 32GB minimum (64GB+ recommended for future scaling).
*   **Storage:** 
    *   1x 500GB NVMe SSD (Host OS & VMs)
    *   2x 4TB HDD (RAID 1) for Data Storage & Backups.
*   **Network:** Dual Gigabit Ethernet NICs (One for WAN/Mgmt, one for LAN).

---

## 🧩 Software Stack Map

The software stack is organized into layers, starting from the bare metal up to the user interface.

### Layer 1: Bare Metal Virtualization
*   **Software:** **Proxmox VE**
*   **Role:** Type-1 Hypervisor.
*   **Function:** Converts the physical hardware into a flexible private cloud. It manages Virtual Machines (VMs) and LXC containers, allowing network isolation and resource quotas.
*   **Configuration:**
    *   Bridge Network (`vmbr0`) for LAN access.
    *   Scheduled snapshots for disaster recovery.

### Layer 2: Operating System (Guest)
*   **Software:** **Ubuntu Server LTS**
*   **Role:** Guest OS.
*   **Function:** Runs inside a Proxmox VM. Provides the stable Linux kernel required to host the Docker engine.
*   **Configuration:**
    *   SSH secured (Key-based auth only).
    *   UFW Firewall enabled (Allow 22, 80, 443).

### Layer 3: Container Orchestration
*   **Software:** **Docker + Portainer**
*   **Role:** Application Runtime & Management UI.
*   **Function:** 
    *   **Docker:** Runs the application components (Frontend, Backend, DB) as isolated containers.
    *   **Portainer:** Provides a web-based GUI for IT staff to manage containers, view logs, and deploy updates without using the command line.

### Layer 4: Infrastructure Services

#### 🛡️ Identity & Access Management (IAM)
*   **Software:** **Keycloak**
*   **Role:** SSO & RBAC Provider.
*   **Function:** Centralized authentication server.
    *   Manages Users, Roles (e.g., "Manager", "Warehouse Staff"), and Groups.
    *   Issues JWT (JSON Web Tokens) to the frontend upon successful login.
    *   Enforces password policies and 2FA.

#### 🗄️ Data Persistence
*   **Software:** **PostgreSQL**
*   **Role:** Relational Database.
*   **Function:** Stores all structured data including:
    *   Inventory catalogs and stock levels.
    *   Financial ledgers and journal entries.
    *   User activity logs.
*   **Security:** Not exposed to the LAN. Only accessible by the Backend API container via an internal Docker network.

#### 🚦 Internal Routing & Security
*   **Software:** **Nginx Proxy Manager**
*   **Role:** Reverse Proxy & SSL Termination.
*   **Function:** 
    *   The single entry point for all network traffic.
    *   Routes `http://bi.local` to the Frontend Container.
    *   Routes `http://bi.local/api` to the Backend Container.
    *   Manages SSL certificates (Self-signed or Let's Encrypt) to ensure HTTPS encryption.

### Layer 5: Application Logic

#### ⚙️ Backend API
*   **Software:** **Node.js / Express.js**
*   **Role:** Business Logic Layer.
*   **Function:** 
    *   RESTful API endpoints.
    *   Validates JWT tokens from Keycloak.
    *   Executes complex business rules (e.g., "If stock < 10, trigger alert").
    *   Connects to PostgreSQL to fetch/save data.

#### 🖥️ Frontend UI
*   **Software:** **React + Vite**
*   **Role:** User Interface.
*   **Function:** 
    *   Single Page Application (SPA) served to client browsers.
    *   Renders interactive dashboards using Recharts.
    *   Connects to Google Gemini API (via secure gateway) for AI features.

---

## 🔒 Security Model

### Zero-Trust Local Access
Even though the server is on the local network (LAN), "Zero-Trust" principles are applied:
1.  **HTTPS Everywhere:** All traffic between client browsers and the server is encrypted.
2.  **API Gateway:** The Database is never exposed directly. All data requests must pass through the API layer which validates permissions.
3.  **Role-Based Access Control (RBAC):** Keycloak ensures that a Warehouse user cannot query Financial API endpoints.

### Data Flow
1.  **User Request:** User opens `https://bi.local`.
2.  **Routing:** Nginx Proxy Manager receives request -> serves React App.
3.  **Auth:** User logs in. React App redirects to Keycloak -> User enters creds -> Keycloak returns Token.
4.  **Data Fetch:** React App sends request to `https://bi.local/api/inventory` with Token in Header.
5.  **Validation:** Backend Node.js verifies Token signature.
6.  **Query:** Backend queries PostgreSQL -> Returns JSON data.
7.  **Render:** React App renders the Inventory Dashboard.

---

## 🤖 AI Integration Note

The **AI Analyst (Prof. Fad)** feature utilizes Google's Gemini API. 
*   **Requirement:** The Micro-Datacenter requires an internet gateway to communicate with `generativelanguage.googleapis.com`.
*   **Privacy:** Only aggregated metrics and anonymized prompt data are sent to the AI model. PII (Personally Identifiable Information) is filtered out before transmission.
*   **Offline Mode:** If the internet connection is severed, the BI app continues to function fully, with only the AI features being disabled.
