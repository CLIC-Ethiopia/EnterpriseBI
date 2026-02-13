-- 1. CLEANUP
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

-- 3. SEED DATA

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