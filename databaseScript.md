
# GlobalTrade BI: Complete Database Migration Manual

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
         dept.salesData = { leads: leads.rows }; // You might need to map this in frontend
         dept.logisticsRoutes = routes.rows;
      }
      
      else if (dept.id === 'ACCOUNTING') {
         const ledger = await pool.query('SELECT * FROM ledger_entries LIMIT 50');
         const tax = await pool.query('SELECT * FROM tax_schedule');
         dept.accountingData = { ledger: ledger.rows, upcomingTax: tax.rows };
      }
      
      else if (dept.id === 'HR') {
         const jobs = await pool.query('SELECT * FROM hr_job_postings');
         // Map to summaryTableData structure expected by frontend
         dept.summaryTableData = jobs.rows.map(j => ({
             id: j.id, item: j.title, category: j.department, status: j.status, value: `${j.applicants} Applicants`, completion: 50
         }));
      }
      
      else if (dept.id === 'IMPORT_COSTING') {
         const costings = await pool.query('SELECT * FROM import_costings');
         // Frontend might expect this in summaryTableData or a specific field
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
         // Usually specific to logged in user, but for demo fetching generic
         const cust = await pool.query('SELECT * FROM customers LIMIT 1');
         const orders = await pool.query('SELECT * FROM orders LIMIT 5');
         const products = await pool.query('SELECT * FROM products LIMIT 10');
         if(cust.rows.length > 0) {
             dept.customerData = {
                 creditLimit: cust.rows[0].credit_limit,
                 availableCredit: cust.rows[0].available_credit,
                 outstandingBalance: cust.rows[0].total_spent, // Proxy
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

// Add Product (Inventory)
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

// Add Ledger Entry (Accounting)
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
- [ ] **Schema:** All 10 create table scripts ran successfully in PGAdmin.
- [ ] **Seed:** Initial data is visible in tables (e.g., `SELECT * FROM products` returns rows).
- [ ] **Network:** The backend container can reach the postgres container (using hostname `postgres`).
- [ ] **Frontend:** `api.ts` is pointing to the Node.js server, not Google Sheets.
