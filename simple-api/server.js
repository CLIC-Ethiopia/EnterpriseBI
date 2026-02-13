const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // Allow React to talk to us
app.use(express.json());

// Flexible connection: Uses Env vars if available (Docker/Prod), else defaults (Local Dev)
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'globaltrade_bi',
  password: process.env.POSTGRES_PASSWORD || 'your_password_here', // UPDATE THIS FOR LOCAL DEV
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

    // Map DB rows to Frontend Structure
    const mappedDepartments = depts.rows.map(d => {
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
             upcomingTax: tax.rows.map(t => ({...t, amount: Number(t.amount)}))
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

// Endpoint to add products (for Customer View / Inventory)
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

app.listen(3000, () => {
  console.log("Bridge running at http://localhost:3000");
});