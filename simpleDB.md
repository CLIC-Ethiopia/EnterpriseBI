
# Rapid Prototype: Local PostgreSQL Setup Guide

**Goal:** Run the GlobalTrade BI database locally on your machine without Docker, Virtual Machines, or complex security tools.
**Architecture:** `Local PostgreSQL` <-> `Simple Node.js Script` <-> `React Frontend`

---

## 🛠️ Step 1: Install Software

1.  **Download PostgreSQL:**
    *   Visit [postgresql.org/download](https://www.postgresql.org/download/).
    *   Download the installer for your OS (Windows or macOS).
    *   **Important during installation:**
        *   You will be asked to set a password for the `postgres` superuser. **Write this down!** (e.g., `root` or `admin`).
        *   Keep the default port as `5432`.
        *   Install **pgAdmin 4** (usually selected by default). This is the visual tool to manage the DB.

2.  **Download Node.js:**
    *   If you haven't already, install Node.js (LTS version) from [nodejs.org](https://nodejs.org/).

---

## 🗄️ Step 2: Create the Database

1.  Open **pgAdmin 4** from your Start Menu / Applications.
2.  In the left sidebar, double-click "Servers". You may need to enter the password you set during installation.
3.  Right-click **Databases** -> **Create** -> **Database...**
4.  Name it: `globaltrade_bi`
5.  Click **Save**.

---

## 📝 Step 3: Run the Schema & Data Script

1.  In pgAdmin, right-click your new `globaltrade_bi` database.
2.  Select **Query Tool**.
3.  Copy the **entire** SQL block below and paste it into the Query Tool.
4.  Click the **Play** button (Execute) in the toolbar.

```sql
-- 1. CLEANUP (If re-running)
DROP TABLE IF EXISTS budget_records CASCADE;
DROP TABLE IF EXISTS cross_dept_risks CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS sales_leads CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS financial_records CASCADE;
DROP TABLE IF EXISTS kpis CASCADE;
DROP TABLE IF EXISTS system_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS ledger_entries CASCADE;
DROP TABLE IF EXISTS tax_schedule CASCADE;
DROP TABLE IF EXISTS import_costings CASCADE;
DROP TABLE IF EXISTS hr_job_postings CASCADE;
DROP TABLE IF EXISTS logistics_routes CASCADE;

-- 2. CORE TABLES
CREATE TABLE departments (
    id VARCHAR(50) PRIMARY KEY, 
    name VARCHAR(100),
    theme_color VARCHAR(20),
    icon_name VARCHAR(50)
);

CREATE TABLE roles (id SERIAL PRIMARY KEY, name VARCHAR(50));

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20),
    full_name VARCHAR(100),
    email VARCHAR(100),
    role VARCHAR(50),
    department_id VARCHAR(50),
    status VARCHAR(20),
    last_login VARCHAR(100)
);

CREATE TABLE kpis (
    id SERIAL PRIMARY KEY,
    department_id VARCHAR(50),
    label VARCHAR(100),
    value VARCHAR(50), 
    change_pct VARCHAR(20),
    trend VARCHAR(10)
);

CREATE TABLE financial_records (
    id SERIAL PRIMARY KEY,
    period VARCHAR(20),
    revenue DECIMAL(15,2),
    expenses DECIMAL(15,2),
    profit DECIMAL(15,2)
);

CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200),
    category VARCHAR(50),
    price DECIMAL(12,2),
    unit VARCHAR(20),
    stock_status VARCHAR(20),
    quantity INT,
    location VARCHAR(50),
    supplier VARCHAR(100),
    incoming_qty INT DEFAULT 0,
    image_url TEXT
);

CREATE TABLE customers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    tier VARCHAR(20),
    credit_limit DECIMAL(15,2),
    available_credit DECIMAL(15,2),
    total_spent DECIMAL(15,2)
);

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50),
    order_date DATE,
    status VARCHAR(20),
    total_amount DECIMAL(15,2),
    po_number VARCHAR(50),
    item_count INT
);

CREATE TABLE ledger_entries (
    id VARCHAR(50) PRIMARY KEY,
    entry_date DATE,
    description TEXT,
    account_name VARCHAR(100),
    entry_type VARCHAR(10),
    amount DECIMAL(12,2),
    status VARCHAR(20)
);

CREATE TABLE tax_schedule (
    id SERIAL PRIMARY KEY,
    tax_name VARCHAR(100),
    amount DECIMAL(12,2),
    due_date DATE
);

CREATE TABLE import_costings (
    id VARCHAR(50) PRIMARY KEY,
    item_name VARCHAR(200),
    fob_usd DECIMAL(12,2),
    landed_cost_etb DECIMAL(15,2),
    status VARCHAR(50)
);

CREATE TABLE hr_job_postings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    department VARCHAR(50),
    status VARCHAR(20),
    applicants INT
);

CREATE TABLE logistics_routes (
    id VARCHAR(50) PRIMARY KEY,
    origin VARCHAR(100),
    destination VARCHAR(100),
    transport_type VARCHAR(20),
    status VARCHAR(50),
    coordinates JSONB,
    goods_desc VARCHAR(100),
    cargo_value VARCHAR(50)
);

CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    event VARCHAR(200),
    user_name VARCHAR(100),
    timestamp VARCHAR(50),
    status VARCHAR(50)
);

-- NEW: Budget Analysis Table for Pivot Tables
CREATE TABLE budget_records (
    id SERIAL PRIMARY KEY,
    dept VARCHAR(50),
    category VARCHAR(100),
    month VARCHAR(20),
    budget_amount DECIMAL(15,2),
    actual_amount DECIMAL(15,2),
    variance DECIMAL(15,2)
);

-- NEW: Cross-Department Risk Data for Analysis
CREATE TABLE cross_dept_risks (
    id SERIAL PRIMARY KEY,
    dept VARCHAR(50),
    category VARCHAR(100),
    month VARCHAR(20),
    amount DECIMAL(15,2),
    risk_score INT
);

-- 3. SEED DATA (Populating with Mock Data)

-- Departments
INSERT INTO departments (id, name, theme_color, icon_name) VALUES
('GENERAL', 'Executive Command Center', 'indigo', 'LayoutDashboard'),
('FINANCE', 'Strategic Finance', 'blue', 'BadgeDollarSign'),
('INVENTORY', 'Warehouse & Inventory', 'emerald', 'Package'),
('SALES', 'Sales & Distribution', 'violet', 'TrendingUp'),
('HR', 'HR & Administration', 'rose', 'Users'),
('ACCOUNTING', 'Accounting & Control', 'cyan', 'Calculator'),
('SYSTEM_ADMIN', 'System Administration', 'gray', 'ShieldAlert'),
('IMPORT_COSTING', 'Cost Estimation', 'emerald', 'Banknote'),
('CUSTOMER', 'Customer Portal', 'blue', 'Users'),
('DATA_ADMIN', 'Data Administration', 'slate', 'Database');

-- KPIs (General)
INSERT INTO kpis (department_id, label, value, change_pct, trend) VALUES
('GENERAL', 'Global Net Profit', 'Bir 8.4M', '+6.2%', 'up'),
('GENERAL', 'Supply Chain Vol', '124k', '+3.1%', 'up'),
('FINANCE', 'EBITDA', 'Bir 3.2M', '+2.5%', 'up'),
('INVENTORY', 'Stock Value', 'Bir 4.2M', '+5.4%', 'up');

-- Products
INSERT INTO products (id, name, category, price, unit, stock_status, quantity, location, supplier, image_url) VALUES
('TEX-RAW-001', 'Raw Cotton Bales (Giza 86)', 'Raw Fiber', 18500.00, 'Bale', 'In Stock', 450, 'Zone A-01', 'Nile Cotton Co.', 'https://images.unsplash.com/photo-1614806687350-1c5c645b2049?auto=format&fit=crop&q=80&w=400'),
('CHEM-DYE-R19', 'Reactive Blue 19 Dye', 'Dyes & Pigments', 450.00, 'Drum', 'In Stock', 85, 'Zone C-15', 'Huntsman', 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400'),
('CHEM-PROC-50', 'Hydrogen Peroxide 50%', 'Process Chemicals', 850.00, 'IBC Tank', 'In Stock', 12, 'Zone H-01', 'Solvay', 'https://images.unsplash.com/photo-1605333144182-4e45d625d886?auto=format&fit=crop&q=80&w=400');

-- Financials
INSERT INTO financial_records (period, revenue, expenses, profit) VALUES
('Jan', 8500, 6200, 2300), ('Feb', 7800, 5900, 1900), ('Mar', 9200, 6100, 3100), 
('Apr', 8900, 6300, 2600), ('May', 9800, 6500, 3300), ('Jun', 10500, 6800, 3700);

-- Customers
INSERT INTO customers (id, name, email, tier, credit_limit, available_credit, total_spent) VALUES
('CUST-001', 'MegaCorp Industries', 'procurement@megacorp.com', 'Platinum', 500000, 324500, 1250000),
('CUST-002', 'Apex Textiles', 'orders@apextextiles.co', 'Gold', 250000, 120000, 850000);

-- Orders
INSERT INTO orders (id, customer_id, order_date, status, total_amount, po_number, item_count) VALUES
('ORD-2024-8821', 'CUST-001', '2024-10-24', 'Processing', 45200.00, 'PO-9921', 12),
('ORD-2024-8755', 'CUST-001', '2024-10-15', 'Shipped', 12500.00, 'PO-9844', 4);

-- Ledger
INSERT INTO ledger_entries (id, entry_date, description, account_name, entry_type, amount, status) VALUES
('JE-1001', '2024-10-25', 'Payment for Inv #9921', 'Cash', 'Debit', 12500.00, 'Posted'),
('JE-1002', '2024-10-24', 'Office Supplies', 'Expense', 'Debit', 450.00, 'Posted');

-- Tax Schedule
INSERT INTO tax_schedule (tax_name, amount, due_date) VALUES
('VAT Q3 Return', 124500.00, '2024-10-30'),
('Payroll Tax Oct', 45000.00, '2024-11-05');

-- Import Costings
INSERT INTO import_costings (id, item_name, fob_usd, landed_cost_etb, status) VALUES
('SHP-001', 'Industrial Solvents', 15000, 2400000, 'Cleared'),
('SHP-002', 'Cotton Yarn', 12000, 1850000, 'Active');

-- HR Jobs
INSERT INTO hr_job_postings (title, department, status, applicants) VALUES
('Senior Chemist', 'R&D', 'Critical', 2),
('Warehouse Manager', 'Logistics', 'Open', 12);

-- Logistics Routes
INSERT INTO logistics_routes (id, origin, destination, transport_type, status, coordinates, goods_desc, cargo_value) VALUES
('R-101', 'Shanghai', 'Addis Ababa', 'Sea', 'In Transit', '{"x1": 75, "y1": 35, "x2": 55, "y2": 52}', 'Raw Textiles', '$450k'),
('R-102', 'Mumbai', 'Addis Ababa', 'Sea', 'Customs', '{"x1": 65, "y1": 42, "x2": 55, "y2": 52}', 'Chemical Dyes', '$120k');

-- Users
INSERT INTO users (employee_id, full_name, email, role, department_id, status, last_login) VALUES
('EMP-1001', 'Frehun Adefris', 'f.adefris@globaltrade.co', 'Director', 'GENERAL', 'Active', 'Today'),
('EMP-5200', 'Dawit Kebede', 'd.kebede@globaltrade.co', 'Manager', 'INVENTORY', 'Active', 'Yesterday');

-- Logs
INSERT INTO system_logs (event, user_name, timestamp, status) VALUES
('Login Success', 'Frehun Adefris', '09:15 AM', 'Success'),
('Failed Login', 'Dawit Kebede', 'Yesterday', 'Warning');

-- NEW: Populate Budget Records
INSERT INTO budget_records (dept, category, month, budget_amount, actual_amount, variance) VALUES
('Sales', 'Travel', 'Jan', 20000, 15000, 5000),
('Sales', 'Marketing', 'Jan', 50000, 48000, 2000),
('IT', 'Hardware', 'Jan', 40000, 45000, -5000),
('HR', 'Training', 'Jan', 15000, 8000, 7000),
('Ops', 'Logistics', 'Jan', 100000, 120000, -20000),
('Sales', 'Travel', 'Feb', 20000, 18500, 1500),
('IT', 'Software', 'Feb', 15000, 12000, 3000),
('HR', 'Recruiting', 'Feb', 10000, 15000, -5000),
('Ops', 'Maintenance', 'Feb', 25000, 22000, 3000);

-- NEW: Populate Cross-Department Risks
INSERT INTO cross_dept_risks (dept, category, month, amount, risk_score) VALUES
('Sales', 'Travel', 'Jan', 15000, 85),
('Sales', 'Software', 'Jan', 4200, 20),
('IT', 'Hardware', 'Jan', 45000, 10),
('HR', 'Training', 'Jan', 8000, 5),
('Ops', 'Logistics', 'Jan', 120000, 60),
('Sales', 'Travel', 'Feb', 18500, 90),
('Sales', 'Software', 'Feb', 4200, 20),
('IT', 'Cloud', 'Feb', 12000, 30),
('HR', 'Recruiting', 'Feb', 15000, 40),
('Ops', 'Logistics', 'Feb', 95000, 55),
('Sales', 'Entertainment', 'Mar', 5000, 95),
('IT', 'Software', 'Mar', 6000, 15);
```

---

## 🌉 Step 4: Create the "Bridge" (Backend API)

React runs in the browser. Postgres runs on your OS. Browsers cannot talk to Postgres directly for security. We need a tiny "bridge" script.

1.  Create a folder named `simple-api` inside your project directory (or anywhere on your computer).
2.  Open that folder in a terminal.
3.  Run `npm init -y` to create a package file.
4.  Install the bridge tools:
    ```bash
    npm install express pg cors
    ```
5.  Create a file named `server.js` inside `simple-api` and paste this code:

```javascript
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow React to talk to us
app.use(express.json());

// ⚠️ CHANGE PASSWORD HERE TO MATCH YOUR POSTGRES INSTALLATION
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'globaltrade_bi',
  password: 'your_password_here', // <--- UPDATE THIS
  port: 5432,
});

// The "Get Everything" Endpoint
app.get('/api/departments', async (req, res) => {
  try {
    // Fetch Data from DB Tables
    const depts = await pool.query('SELECT * FROM departments');
    const kpis = await pool.query('SELECT * FROM kpis');
    const financials = await pool.query('SELECT * FROM financial_records');
    const products = await pool.query('SELECT * FROM products');
    const customers = await pool.query('SELECT * FROM customers');
    const orders = await pool.query('SELECT * FROM orders');
    const ledger = await pool.query('SELECT * FROM ledger_entries');
    const tax = await pool.query('SELECT * FROM tax_schedule');
    const costings = await pool.query('SELECT * FROM import_costings');
    const hrJobs = await pool.query('SELECT * FROM hr_job_postings');
    const routes = await pool.query('SELECT * FROM logistics_routes');
    const users = await pool.query('SELECT * FROM users');
    const logs = await pool.query('SELECT * FROM system_logs');
    
    // NEW: Fetch Pivot Data
    const budgetRecords = await pool.query('SELECT * FROM budget_records');
    const crossDeptRisks = await pool.query('SELECT * FROM cross_dept_risks');

    // Map DB rows to Frontend Structure
    const mappedDepartments = depts.rows.map(d => {
      let specificData = {};

      // Attach department specific data
      if (d.id === 'GENERAL') {
         // Use financial records for main chart
         d.mainChartData = financials.rows.map(f => ({
             name: f.period, Revenue: Number(f.revenue), Expenses: Number(f.expenses), Profit: Number(f.profit)
         }));
      }
      else if (d.id === 'INVENTORY') {
         d.inventoryData = { products: products.rows.map(p => ({...p, price: Number(p.price)})) };
      }
      else if (d.id === 'ACCOUNTING') {
         d.accountingData = { 
             ledger: ledger.rows.map(l => ({...l, amount: Number(l.amount)})),
             upcomingTax: tax.rows.map(t => ({...t, amount: Number(t.amount)})),
             // Inject new pivot data sets for the Comparative Pivot feature
             budgetAnalysis: budgetRecords.rows.map(b => ({
                 ...b,
                 budget: Number(b.budget_amount),
                 actual: Number(b.actual_amount),
                 variance: Number(b.variance)
             })),
             crossDeptAnalysis: crossDeptRisks.rows.map(r => ({
                 ...r,
                 amount: Number(r.amount),
                 riskScore: Number(r.risk_score)
             }))
         };
      }
      else if (d.id === 'IMPORT_COSTING') {
         d.summaryTableData = costings.rows.map(c => ({
             id: c.id, item: c.item_name, category: 'Import', status: c.status, value: `Bir ${c.landed_cost_etb}`, completion: 100
         }));
      }
      else if (d.id === 'HR') {
         d.summaryTableData = hrJobs.rows.map(j => ({
             id: j.id, item: j.title, category: j.department, status: j.status, value: `${j.applicants} Applicants`, completion: 50
         }));
      }
      else if (d.id === 'SALES') {
         d.logisticsRoutes = routes.rows;
      }
      else if (d.id === 'SYSTEM_ADMIN') {
         d.systemAdminData = { users: users.rows, logs: logs.rows };
      }
      else if (d.id === 'CUSTOMER') {
         d.customerData = {
             creditLimit: customers.rows[0]?.credit_limit || 0,
             availableCredit: customers.rows[0]?.available_credit || 0,
             outstandingBalance: 0,
             loyaltyTier: customers.rows[0]?.tier || 'Bronze',
             products: products.rows,
             orders: orders.rows
         };
      }

      // Attach Generic KPIs
      const myKpis = kpis.rows.filter(k => k.department_id === d.id);
      
      return {
        ...d, // name, theme_color, etc
        kpis: myKpis.length > 0 ? myKpis : [], 
        // Fallback for visual charts if not specifically loaded above
        mainChartData: d.mainChartData || [],
        secondaryChartData: [],
        recentActivity: [],
        barChartData: [],
        summaryTableData: d.summaryTableData || []
      };
    });

    res.json({ status: 'success', data: mappedDepartments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Bridge running at http://localhost:3000");
});
```

6.  **Run the Bridge:**
    In the terminal inside `simple-api`, run: `node server.js`
    You should see: "Bridge running at http://localhost:3000"

---

## 🔗 Step 5: Connect Frontend

1.  Go to your main application code.
2.  Open `services/api.ts`.
3.  Change the `GAS_API_URL` to your local bridge:

```typescript
// services/api.ts

// Replace the Google Sheet URL with your local bridge address
const GAS_API_URL = 'http://localhost:3000/api/departments'; 

// Note: The rest of the fetchDepartments function handles the "action=getAllDepartments" parameter.
// Since our simple server ignores extra params and just returns data on GET /api/departments, 
// this URL change is sufficient.
```

4.  **Restart your React App** (`npm run dev`).
5.  You are now pulling live data from your local PostgreSQL database!

---

## 🚀 Phase 6: Production Deployment via Docker & Google Drive

This section guides you on how to package your entire app (Frontend + Backend + Database) from your laptop and deploy it to the client's PC using **Docker** and **Google Drive** for file transfer.

### 📋 A. Preparation on Laptop

1.  **Update API Logic:** We need the backend to be flexible. Open `simple-api/server.js` and modify the `pool` configuration to look like this:
    ```javascript
    const pool = new Pool({
      user: process.env.POSTGRES_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.POSTGRES_DB || 'globaltrade_bi',
      password: process.env.POSTGRES_PASSWORD || 'your_password_here',
      port: 5432,
    });
    ```

2.  **Create Docker Configuration Files:**
    Create a file named `docker-compose.prod.yml` in the root of your project folder:

    ```yaml
    version: '3.8'

    services:
      # 1. Database
      db:
        image: postgres:15-alpine
        container_name: globaltrade_db
        restart: always
        environment:
          POSTGRES_USER: admin
          POSTGRES_PASSWORD: secure_client_password_2024
          POSTGRES_DB: globaltrade_bi
        volumes:
          - db_data:/var/lib/postgresql/data
          # Map the initialization script to run automatically on first boot
          - ./db_init.sql:/docker-entrypoint-initdb.d/init.sql

      # 2. Backend API
      api:
        image: node:18-alpine
        container_name: globaltrade_api
        restart: always
        working_dir: /app
        # Build context points to the simple-api folder
        build: ./simple-api
        environment:
          DB_HOST: db
          POSTGRES_USER: admin
          POSTGRES_PASSWORD: secure_client_password_2024
          POSTGRES_DB: globaltrade_bi
        ports:
          - "3000:3000"
        depends_on:
          - db

      # 3. Frontend UI
      web:
        image: node:18-alpine
        container_name: globaltrade_web
        restart: always
        working_dir: /app
        # Mount the current directory to build the React app
        volumes:
          - ./:/app
          - /app/node_modules
        ports:
          - "80:5173"
        # We use a simple command to run Vite in preview mode for simplicity
        # In a strict enterprise scenario, we would use Nginx, but this works for a PC deployment.
        command: sh -c "npm install && npm run build && npm run preview -- --host 0.0.0.0 --port 5173"
        environment:
          - VITE_API_URL=http://localhost:3000
    
    volumes:
      db_data:
    ```

3.  **Create Backend Dockerfile:**
    Create a file named `Dockerfile` **inside the `simple-api` folder**:
    ```dockerfile
    FROM node:18-alpine
    WORKDIR /app
    COPY package*.json ./
    RUN npm install
    COPY . .
    CMD ["node", "server.js"]
    ```

4.  **Export Database Script:**
    Save the large SQL script from **Step 3** into a file named `db_init.sql` in your project root. Docker will use this to automatically create tables on the client's PC.

### 📦 B. Packaging & Transfer (Google Drive)

1.  **Clean Up:** Delete the `node_modules` folders in your root directory and inside `simple-api` to make the zip file smaller. (They will be re-installed by Docker).
2.  **Zip It:** Compress your entire project folder into `GlobalTradeBI_App.zip`.
3.  **Upload:** Upload this zip file to your Google Drive.

### 🖥️ C. Deployment on Client PC

1.  **Install Docker:**
    *   Download and install **Docker Desktop** for Windows/Mac on the client's PC.
    *   Ensure Docker is running.

2.  **Download App:**
    *   Open Google Drive on the client PC.
    *   Download `GlobalTradeBI_App.zip`.
    *   Extract it to a folder (e.g., `C:\GlobalTradeBI`).

3.  **Launch:**
    *   Open Terminal (Command Prompt or PowerShell) and navigate to the folder:
        ```bash
        cd C:\GlobalTradeBI
        ```
    *   Run the application:
        ```bash
        docker-compose -f docker-compose.prod.yml up -d --build
        ```

4.  **Access:**
    *   Open the browser on the client PC.
    *   Go to: `http://localhost`
    *   The app is now live, connected to a local Dockerized database!

---
---

# GlobalTrade BI: Complete Database Migration Manual v3.0

**Version:** 3.0 (Full 10-Department Support)  
**Target Audience:** System Administrators & Deployment Teams

---

## 📖 Executive Summary

This manual guides you through transitioning **GlobalTrade BI** from static mock data to a production-ready **PostgreSQL** database hosted in a local Docker environment.

It specifically covers data requirements for all 10 functional dashboards:
1.  **General Management** (Aggregated KPIs)
2.  **Finance** (Budgets & Forecasts)
3.  **Cost Estimation** (Landed Cost Logic)
4.  **Accounting** (Ledger & Tax)
5.  **Sales** (Leads & Distribution)
6.  **Inventory** (Warehouse & Products)
7.  **HR & Admin** (Recruitment & Headcount)
8.  **Customer View** (B2B Portal)
9.  **Data Admin** (Registry Control)
10. **System Admin** (Users & Security)

---

## 🏗️ Phase 1: Infrastructure Setup (Docker)

**Prerequisites:** Docker Desktop installed.

1.  **Create Folder:** Make a folder named `globaltrade-infrastructure`.
2.  **Create File:** Inside it, create `docker-compose.yml`.
3.  **Paste Configuration:**

```yaml
version: '3.8'

services:
  # 1. The Database Engine
  postgres:
    image: postgres:15-alpine
    container_name: globaltrade_db
    restart: always
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secure_password_123
      POSTGRES_DB: globaltrade_bi
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - bi_network

  # 2. Database Management UI (PGAdmin)
  pgadmin:
    image: dpage/pgadmin4
    container_name: globaltrade_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@globaltrade.co
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    networks:
      - bi_network

  # 3. The API Server (Node.js)
  backend:
    build: ./backend
    container_name: globaltrade_api
    restart: always
    environment:
      DB_HOST: postgres
      DB_USER: admin
      DB_PASS: secure_password_123
      DB_NAME: globaltrade_bi
      PORT: 3000
    ports:
      - "3000:3000"
    depends_on:
      - postgres
    networks:
      - bi_network

volumes:
  pgdata:

networks:
  bi_network:
    driver: bridge
```

4.  **Launch:** Open terminal in the folder and run `docker-compose up -d`.

---

## 🗄️ Phase 2: Database Schema & Seed (SQL)

We need to create tables that map to every dashboard feature.

**Instructions:**
1.  Go to `http://localhost:5050` (PGAdmin). Login with `admin@globaltrade.co` / `admin`.
2.  Register Server: Host: `postgres`, User: `admin`, Pass: `secure_password_123`.
3.  Open Query Tool on `globaltrade_bi` database and run these scripts.

### A. Full Schema Script (`schema.sql`)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CORE & ADMIN (System Admin / Data Admin)
CREATE TABLE departments (
    id VARCHAR(50) PRIMARY KEY, 
    name VARCHAR(100),
    theme_color VARCHAR(20),
    icon_name VARCHAR(50)
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    pin_hash VARCHAR(255), 
    role_id INT REFERENCES roles(id),
    department_id VARCHAR(50) REFERENCES departments(id),
    status VARCHAR(20) DEFAULT 'Active',
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    event VARCHAR(200),
    user_id INT,
    timestamp TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50)
);

-- 2. GENERAL MANAGEMENT & FINANCE
CREATE TABLE kpis (
    id SERIAL PRIMARY KEY,
    department_id VARCHAR(50) REFERENCES departments(id),
    label VARCHAR(100),
    value VARCHAR(50), 
    change_pct VARCHAR(20),
    trend VARCHAR(10) -- 'up', 'down', 'neutral'
);

CREATE TABLE financial_records (
    id SERIAL PRIMARY KEY,
    period VARCHAR(20), -- 'Q1 2024', 'Jan 2024'
    revenue DECIMAL(15,2),
    expenses DECIMAL(15,2),
    profit DECIMAL(15,2),
    capex DECIMAL(15,2),
    opex DECIMAL(15,2)
);

-- 3. INVENTORY (Warehouse)
CREATE TABLE products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200),
    category VARCHAR(50),
    price DECIMAL(12,2),
    unit VARCHAR(20),
    stock_status VARCHAR(20),
    quantity INT,
    location VARCHAR(50),
    supplier VARCHAR(100),
    incoming_qty INT DEFAULT 0,
    specs JSONB, -- Technical specs
    image_url TEXT
);

-- 4. SALES & CUSTOMER PORTAL
CREATE TABLE customers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    tier VARCHAR(20), -- 'Platinum', 'Gold'
    credit_limit DECIMAL(15,2),
    available_credit DECIMAL(15,2),
    total_spent DECIMAL(15,2)
);

CREATE TABLE sales_leads (
    id SERIAL PRIMARY KEY,
    client_name VARCHAR(100),
    industry VARCHAR(50),
    deal_value DECIMAL(15,2),
    probability INT, -- 0-100%
    status VARCHAR(20) -- 'Good', 'Warning'
);

CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    customer_id VARCHAR(50) REFERENCES customers(id),
    order_date DATE,
    status VARCHAR(20),
    total_amount DECIMAL(15,2),
    po_number VARCHAR(50)
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50) REFERENCES orders(id),
    product_id VARCHAR(50) REFERENCES products(id),
    quantity INT,
    unit_price DECIMAL(12,2)
);

-- 5. ACCOUNTING
CREATE TABLE ledger_entries (
    id VARCHAR(50) PRIMARY KEY,
    entry_date DATE,
    description TEXT,
    account_name VARCHAR(100),
    entry_type VARCHAR(10), -- 'Debit', 'Credit'
    amount DECIMAL(12,2),
    status VARCHAR(20) -- 'Posted', 'Pending'
);

CREATE TABLE tax_schedule (
    id SERIAL PRIMARY KEY,
    tax_name VARCHAR(100),
    amount DECIMAL(12,2),
    due_date DATE,
    status VARCHAR(20)
);

-- NEW TABLES FOR PIVOT ANALYSIS --
CREATE TABLE budget_records (
    id SERIAL PRIMARY KEY,
    dept VARCHAR(50),
    category VARCHAR(100),
    month VARCHAR(20),
    budget_amount DECIMAL(15,2),
    actual_amount DECIMAL(15,2),
    variance DECIMAL(15,2)
);

CREATE TABLE cross_dept_risks (
    id SERIAL PRIMARY KEY,
    dept VARCHAR(50),
    category VARCHAR(100),
    month VARCHAR(20),
    amount DECIMAL(15,2),
    risk_score INT
);

-- 6. COST ESTIMATION (Import Costing)
CREATE TABLE import_costings (
    id VARCHAR(50) PRIMARY KEY, -- Shipment ID
    item_name VARCHAR(200),
    hs_code VARCHAR(20),
    fob_usd DECIMAL(12,2),
    freight_usd DECIMAL(12,2),
    exchange_rate DECIMAL(10,4),
    duties_etb DECIMAL(15,2),
    landed_cost_etb DECIMAL(15,2),
    status VARCHAR(50) -- 'Simulated', 'Active', 'Cleared'
);

-- 7. HR & ADMIN
CREATE TABLE hr_stats (
    id SERIAL PRIMARY KEY,
    period VARCHAR(20),
    headcount INT,
    retention_rate DECIMAL(5,2),
    training_hours INT
);

CREATE TABLE hr_job_postings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    department VARCHAR(50),
    status VARCHAR(20), -- 'Open', 'Critical'
    applicants INT
);

-- 8. LOGISTICS
CREATE TABLE logistics_routes (
    id VARCHAR(50) PRIMARY KEY,
    origin VARCHAR(100),
    destination VARCHAR(100),
    transport_type VARCHAR(20),
    status VARCHAR(50),
    coordinates JSONB -- Map drawing data
);
```

### B. Seed Data Script (`seed.sql`)

```sql
-- Departments
INSERT INTO departments (id, name, theme_color, icon_name) VALUES
('GENERAL', 'Executive Command Center', 'indigo', 'LayoutDashboard'),
('FINANCE', 'Strategic Finance', 'blue', 'BadgeDollarSign'),
('INVENTORY', 'Warehouse & Inventory', 'emerald', 'Package'),
('SALES', 'Sales & Distribution', 'violet', 'TrendingUp'),
('HR', 'HR & Administration', 'rose', 'Users'),
('ACCOUNTING', 'Accounting & Control', 'cyan', 'Calculator'),
('SYSTEM_ADMIN', 'System Administration', 'gray', 'ShieldAlert'),
('IMPORT_COSTING', 'Cost Estimation', 'emerald', 'Banknote'),
('CUSTOMER', 'Customer Portal', 'blue', 'Users'),
('DATA_ADMIN', 'Data Administration', 'slate', 'Database');

-- Products
INSERT INTO products (id, name, category, price, unit, stock_status, quantity, location) VALUES
('TEX-RAW-001', 'Raw Cotton Bales (Giza 86)', 'Raw Fiber', 18500.00, 'Bale', 'In Stock', 450, 'Zone A-01'),
('CHEM-DYE-R19', 'Reactive Blue 19 Dye', 'Dyes & Pigments', 450.00, 'Drum', 'In Stock', 85, 'Zone C-15');

-- Financials
INSERT INTO financial_records (period, revenue, expenses, profit) VALUES
('Jan', 8500, 6200, 2300), ('Feb', 7800, 5900, 1900), ('Mar', 9200, 6100, 3100);

-- Cost Estimation Mock
INSERT INTO import_costings (id, item_name, fob_usd, landed_cost_etb, status) VALUES
('SHP-001', 'Industrial Solvents', 15000, 2400000, 'Cleared'),
('SHP-002', 'Cotton Yarn', 12000, 1850000, 'Active');

-- HR Data
INSERT INTO hr_job_postings (title, department, status, applicants) VALUES
('Senior Chemist', 'R&D', 'Critical', 2),
('Warehouse Manager', 'Logistics', 'Open', 12);

-- Customers
INSERT INTO customers (id, name, credit_limit, available_credit) VALUES
('CUST-001', 'MegaCorp Industries', 500000, 324500),
('CUST-002', 'Apex Textiles', 250000, 120000);

-- Logistics
INSERT INTO logistics_routes (id, origin, destination, status, transport_type) VALUES
('R-101', 'Shanghai', 'Addis Ababa', 'In Transit', 'Sea');

-- Budget Records
INSERT INTO budget_records (dept, category, month, budget_amount, actual_amount, variance) VALUES
('Sales', 'Travel', 'Jan', 20000, 15000, 5000),
('IT', 'Hardware', 'Jan', 40000, 45000, -5000);

-- Cross Dept Risks
INSERT INTO cross_dept_risks (dept, category, month, amount, risk_score) VALUES
('Sales', 'Travel', 'Jan', 15000, 85),
('Ops', 'Logistics', 'Jan', 120000, 60);
```

---

## 💻 Phase 3: The Backend Logic (Node.js)

Create `backend/server.js`. This API acts as the "Switchboard", routing requests to the correct SQL tables based on the department.

```javascript
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
});

// --- UNIVERSAL DATA AGGREGATOR ---
// This endpoint powers the Dashboard by fetching relevant data for specific departments
app.get('/api/departments', async (req, res) => {
  try {
    const deptResult = await pool.query('SELECT * FROM departments');
    const departments = deptResult.rows;

    for (let dept of departments) {
      // 1. Attach Generic KPIs
      const kpis = await pool.query('SELECT * FROM kpis WHERE department_id = $1', [dept.id]);
      dept.kpis = kpis.rows;

      // 2. Attach Specific Data based on ID
      if (dept.id === 'GENERAL') {
         const finances = await pool.query('SELECT * FROM financial_records ORDER BY id ASC LIMIT 6');
         dept.mainChartData = finances.rows; 
      }
      
      else if (dept.id === 'INVENTORY') {
         const products = await pool.query('SELECT * FROM products');
         dept.inventoryData = { products: products.rows };
      }
      
      else if (dept.id === 'SALES') {
         const leads = await pool.query('SELECT * FROM sales_leads');
         const routes = await pool.query('SELECT * FROM logistics_routes');
         dept.salesData = { leads: leads.rows }; 
         dept.logisticsRoutes = routes.rows;
      }
      
      else if (dept.id === 'ACCOUNTING') {
         const ledger = await pool.query('SELECT * FROM ledger_entries LIMIT 50');
         const tax = await pool.query('SELECT * FROM tax_schedule');
         const budget = await pool.query('SELECT * FROM budget_records');
         const risks = await pool.query('SELECT * FROM cross_dept_risks');
         
         dept.accountingData = { 
             ledger: ledger.rows, 
             upcomingTax: tax.rows,
             budgetAnalysis: budget.rows,
             crossDeptAnalysis: risks.rows
         };
      }
      
      else if (dept.id === 'HR') {
         const jobs = await pool.query('SELECT * FROM hr_job_postings');
         dept.summaryTableData = jobs.rows.map(j => ({
             id: j.id, item: j.title, category: j.department, status: j.status, value: `${j.applicants} Applicants`, completion: 50
         }));
      }
      
      else if (dept.id === 'IMPORT_COSTING') {
         const costings = await pool.query('SELECT * FROM import_costings');
         dept.summaryTableData = costings.rows.map(c => ({
             id: c.id, item: c.item_name, category: 'Import', status: c.status, value: `Bir ${c.landed_cost_etb}`, completion: 100
         }));
      }
      
      else if (dept.id === 'SYSTEM_ADMIN') {
         const users = await pool.query('SELECT * FROM users');
         const logs = await pool.query('SELECT * FROM system_logs ORDER BY timestamp DESC LIMIT 20');
         dept.systemAdminData = { users: users.rows, logs: logs.rows };
      }
      
      else if (dept.id === 'CUSTOMER') {
         const cust = await pool.query('SELECT * FROM customers LIMIT 1');
         const orders = await pool.query('SELECT * FROM orders LIMIT 5');
         const products = await pool.query('SELECT * FROM products LIMIT 10');
         if(cust.rows.length > 0) {
             dept.customerData = {
                 creditLimit: cust.rows[0].credit_limit,
                 availableCredit: cust.rows[0].available_credit,
                 outstandingBalance: cust.rows[0].total_spent,
                 loyaltyTier: cust.rows[0].tier,
                 orders: orders.rows,
                 products: products.rows
             };
         }
      }
    }

    res.json({ status: 'success', data: departments });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database Error', details: err.message });
  }
});

// --- WRITE OPERATIONS ---

app.post('/api/products', async (req, res) => {
  const { id, name, category, price, quantity, location } = req.body;
  try {
    await pool.query(
      `INSERT INTO products (id, name, category, price, quantity, location) VALUES ($1, $2, $3, $4, $5, $6)`,
      [id, name, category, price, quantity, location]
    );
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/ledger', async (req, res) => {
  const { id, date, description, account, type, amount, status } = req.body;
  try {
    await pool.query(
      `INSERT INTO ledger_entries (id, entry_date, description, account_name, entry_type, amount, status) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, date, description, account, type, amount, status]
    );
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('API Server running on port 3000'));
```

---

## 🔗 Phase 4: Frontend Connection

1.  Open `services/api.ts` in your React project.
2.  Change the base URL:
    ```typescript
    const API_BASE_URL = 'http://localhost:3000/api'; 
    ```
3.  Ensure your `fetchDepartments` function calls `${API_BASE_URL}/departments`.

---

## 📋 Checklist for Deployment

- [ ] **Docker:** Containers for Postgres, API, and PGAdmin are running (green in Portainer).
- [ ] **Schema:** All create table scripts ran successfully in PGAdmin.
- [ ] **Seed:** Initial data is visible in tables (e.g., `SELECT * FROM products` returns rows).
- [ ] **Network:** The backend container can reach the postgres container (using hostname `postgres`).
- [ ] **Frontend:** `api.ts` is pointing to the Node.js server, not Google Sheets.
