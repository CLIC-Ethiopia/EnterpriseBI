// CONFIGURATION
// Replace this with your Google Sheet ID (found in the URL)
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; 

// ==========================================
// API HANDLERS
// ==========================================

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const action = e.parameter.action;
    const result = routeAction(action, e);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function routeAction(action, e) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  switch (action) {
    case 'getAllDepartments':
      return getAllDepartments(ss);
    default:
      return { status: 'error', message: 'Invalid Action' };
  }
}

// ==========================================
// READ LOGIC
// ==========================================

function getAllDepartments(ss) {
  // Fetch raw data from all sheets
  const deptsRaw = getSheetData(ss, 'Departments');
  const kpisRaw = getSheetData(ss, 'KPIs');
  const mainChartRaw = getSheetData(ss, 'MainChartData');
  const secChartRaw = getSheetData(ss, 'SecondaryChartData');
  const activityRaw = getSheetData(ss, 'Activity');
  const barChartRaw = getSheetData(ss, 'BarChartData');
  const tableRaw = getSheetData(ss, 'SummaryTable');
  
  // Specific Data
  const inventoryRaw = getSheetData(ss, 'Inventory');
  const ledgerRaw = getSheetData(ss, 'Ledger');
  const taxRaw = getSheetData(ss, 'TaxSchedule');
  const usersRaw = getSheetData(ss, 'Users');
  const logsRaw = getSheetData(ss, 'SystemLogs');
  const customerMetaRaw = getSheetData(ss, 'CustomerMeta');
  const ordersRaw = getSheetData(ss, 'CustomerOrders');
  const custProductsRaw = getSheetData(ss, 'CustomerProducts');

  // Reconstruct the nested Typescript object structure
  const departments = deptsRaw.map(d => {
    
    // 1. Basic Nested Arrays
    const kpis = kpisRaw.filter(k => k.deptId === d.id).map(k => ({
      label: k.label, value: k.value, change: k.change, trend: k.trend
    }));

    const recentActivity = activityRaw.filter(a => a.deptId === d.id).map(a => ({
      id: Number(a.id), action: a.action, time: a.time
    }));

    const secondaryChartData = secChartRaw.filter(s => s.deptId === d.id).map(s => ({
      name: s.name, value: Number(s.value)
    }));

    const summaryTableData = tableRaw.filter(t => t.deptId === d.id).map(t => ({
      id: Number(t.rowId), item: t.item, category: t.category, 
      status: t.status, value: t.value, completion: Number(t.completion)
    }));

    // 2. Complex Chart Data Reconstruction (Dynamic Keys)
    const mainChartData = mainChartRaw.filter(m => m.deptId === d.id).map(m => {
      const point = { name: m.name };
      if (m.key1) point[m.key1] = isNumeric(m.val1) ? Number(m.val1) : m.val1;
      if (m.key2) point[m.key2] = isNumeric(m.val2) ? Number(m.val2) : m.val2;
      if (m.key3) point[m.key3] = isNumeric(m.val3) ? Number(m.val3) : m.val3;
      if (m.key4) point[m.key4] = isNumeric(m.val4) ? Number(m.val4) : m.val4;
      return point;
    });

    const barChartData = barChartRaw.filter(b => b.deptId === d.id).map(b => {
      const point = { name: b.name };
      if (b.key1) point[b.key1] = Number(b.val1);
      if (b.key2) point[b.key2] = Number(b.val2);
      return point;
    });

    // 3. Construct Base Department Object
    const deptObj = {
      id: d.id,
      name: d.name,
      description: d.description,
      themeColor: d.themeColor,
      iconName: d.iconName,
      kpis,
      mainChartData,
      secondaryChartData,
      recentActivity,
      barChartTitle: d.barChartTitle,
      barChartData,
      tableTitle: d.tableTitle,
      summaryTableData,
      suggestedPrompts: d.suggestedPrompts ? JSON.parse(d.suggestedPrompts) : []
    };

    // 4. Attach Department Specific Data
    if (d.id === 'INVENTORY') {
      deptObj.inventoryData = { products: inventoryRaw.map(parseInventoryRow) };
    }
    
    if (d.id === 'ACCOUNTING') {
      deptObj.accountingData = { 
        ledger: ledgerRaw.map(l => ({...l, amount: Number(l.amount)})), 
        upcomingTax: taxRaw.map(t => ({...t, amount: Number(t.amount)}))
      };
    }
    
    if (d.id === 'SYSTEM_ADMIN') {
      deptObj.systemAdminData = { 
        users: usersRaw.map(u => ({...u, id: Number(u.id)})), 
        logs: logsRaw.map(l => ({...l, id: Number(l.id)})) 
      };
    }

    if (d.id === 'CUSTOMER') {
      const meta = customerMetaRaw[0] || {};
      deptObj.customerData = {
        creditLimit: Number(meta.creditLimit || 0),
        availableCredit: Number(meta.availableCredit || 0),
        outstandingBalance: Number(meta.outstandingBalance || 0),
        loyaltyTier: meta.loyaltyTier || 'Standard',
        orders: ordersRaw.map(o => ({...o, total: Number(o.total), items: Number(o.items)})),
        products: custProductsRaw.map(parseInventoryRow)
      };
    }

    return deptObj;
  });

  return { status: 'success', data: departments };
}

function getSheetData(ss, sheetName) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  
  const headers = data[0];
  const result = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    result.push(obj);
  }
  return result;
}

function parseInventoryRow(row) {
  let specs = [];
  try { specs = row.specs_json ? JSON.parse(row.specs_json) : []; } catch(e) {}
  
  return {
    ...row,
    price: Number(row.price),
    quantity: row.quantity ? Number(row.quantity) : undefined,
    incoming: row.incoming ? Number(row.incoming) : undefined,
    specs
  };
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// ==========================================
// DATABASE POPULATION SCRIPT (Run Once)
// ==========================================

function setupDatabase() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  // 1. Define Sheets and Headers
  const schemas = {
    'Departments': ['id', 'name', 'description', 'themeColor', 'iconName', 'barChartTitle', 'tableTitle', 'suggestedPrompts'],
    'KPIs': ['deptId', 'label', 'value', 'change', 'trend'],
    'MainChartData': ['deptId', 'name', 'key1', 'val1', 'key2', 'val2', 'key3', 'val3', 'key4', 'val4'],
    'SecondaryChartData': ['deptId', 'name', 'value'],
    'Activity': ['deptId', 'id', 'action', 'time'],
    'BarChartData': ['deptId', 'name', 'key1', 'val1', 'key2', 'val2'],
    'SummaryTable': ['deptId', 'rowId', 'item', 'category', 'status', 'value', 'completion'],
    'Inventory': ['id', 'name', 'category', 'price', 'unit', 'image', 'stockStatus', 'description', 'quantity', 'location', 'supplier', 'lastRestock', 'incoming', 'specs_json'],
    'Ledger': ['id', 'date', 'description', 'account', 'type', 'amount', 'status'],
    'TaxSchedule': ['name', 'amount', 'dueDate'],
    'Users': ['id', 'name', 'role', 'department', 'employeeId', 'pin', 'status', 'lastLogin', 'email'],
    'SystemLogs': ['id', 'event', 'user', 'time', 'ip', 'status'],
    'CustomerMeta': ['creditLimit', 'availableCredit', 'outstandingBalance', 'loyaltyTier'],
    'CustomerOrders': ['id', 'date', 'status', 'total', 'items', 'poNumber'],
    'CustomerProducts': ['id', 'name', 'category', 'price', 'unit', 'image', 'stockStatus', 'description', 'specs_json']
  };

  // 2. Create/Clear Sheets
  for (const [name, headers] of Object.entries(schemas)) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) { sheet = ss.insertSheet(name); }
    sheet.clear();
    sheet.appendRow(headers);
  }

  // 3. SAMPLE DATA (Mirrors data.ts)
  const departments = getSampleData();

  // 4. Populate Data
  const dataMap = {
    'Departments': [], 'KPIs': [], 'MainChartData': [], 'SecondaryChartData': [], 'Activity': [], 
    'BarChartData': [], 'SummaryTable': [], 'Inventory': [], 'Ledger': [], 'TaxSchedule': [],
    'Users': [], 'SystemLogs': [], 'CustomerMeta': [], 'CustomerOrders': [], 'CustomerProducts': []
  };

  departments.forEach(d => {
    // Departments
    dataMap['Departments'].push([
      d.id, d.name, d.description, d.themeColor, d.iconName, 
      d.barChartTitle, d.tableTitle, JSON.stringify(d.suggestedPrompts || [])
    ]);

    // KPIs
    d.kpis.forEach(k => {
      dataMap['KPIs'].push([d.id, k.label, k.value, k.change, k.trend]);
    });

    // Main Chart (Flatten dynamic keys)
    d.mainChartData.forEach(m => {
      const keys = Object.keys(m).filter(k => k !== 'name');
      dataMap['MainChartData'].push([
        d.id, m.name, 
        keys[0] || '', m[keys[0]] || '', 
        keys[1] || '', m[keys[1]] || '', 
        keys[2] || '', m[keys[2]] || '',
        keys[3] || '', m[keys[3]] || ''
      ]);
    });

    // Secondary Chart
    d.secondaryChartData.forEach(s => {
      dataMap['SecondaryChartData'].push([d.id, s.name, s.value]);
    });

    // Activity
    d.recentActivity.forEach(a => {
      dataMap['Activity'].push([d.id, a.id, a.action, a.time]);
    });

    // Bar Chart
    d.barChartData.forEach(b => {
      const keys = Object.keys(b).filter(k => k !== 'name');
      dataMap['BarChartData'].push([
        d.id, b.name, 
        keys[0] || '', b[keys[0]] || '', 
        keys[1] || '', b[keys[1]] || ''
      ]);
    });

    // Summary Table
    d.summaryTableData.forEach(t => {
      dataMap['SummaryTable'].push([d.id, t.id, t.item, t.category, t.status, t.value, t.completion]);
    });

    // Specific Data
    if (d.id === 'INVENTORY' && d.inventoryData) {
      d.inventoryData.products.forEach(p => {
        dataMap['Inventory'].push([
          p.id, p.name, p.category, p.price, p.unit, p.image, p.stockStatus, p.description, 
          p.quantity, p.location, p.supplier, p.lastRestock, p.incoming, JSON.stringify(p.specs)
        ]);
      });
    }

    if (d.id === 'ACCOUNTING' && d.accountingData) {
      d.accountingData.ledger.forEach(l => {
        dataMap['Ledger'].push([l.id, l.date, l.description, l.account, l.type, l.amount, l.status]);
      });
      d.accountingData.upcomingTax.forEach(t => {
        dataMap['TaxSchedule'].push([t.name, t.amount, t.dueDate]);
      });
    }

    if (d.id === 'SYSTEM_ADMIN' && d.systemAdminData) {
      d.systemAdminData.users.forEach(u => {
        dataMap['Users'].push([u.id, u.name, u.role, u.department, u.employeeId, u.pin, u.status, u.lastLogin, u.email]);
      });
      d.systemAdminData.logs.forEach(l => {
        dataMap['SystemLogs'].push([l.id, l.event, l.user, l.time, l.ip, l.status]);
      });
    }

    if (d.id === 'CUSTOMER' && d.customerData) {
      dataMap['CustomerMeta'].push([
        d.customerData.creditLimit, d.customerData.availableCredit, 
        d.customerData.outstandingBalance, d.customerData.loyaltyTier
      ]);
      d.customerData.orders.forEach(o => {
        dataMap['CustomerOrders'].push([o.id, o.date, o.status, o.total, o.items, o.poNumber]);
      });
      d.customerData.products.forEach(p => {
        dataMap['CustomerProducts'].push([
          p.id, p.name, p.category, p.price, p.unit, p.image, p.stockStatus, p.description, JSON.stringify(p.specs)
        ]);
      });
    }
  });

  // 5. Batch Write
  for (const [sheetName, rows] of Object.entries(dataMap)) {
    if (rows.length > 0) {
      const sheet = ss.getSheetByName(sheetName);
      sheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
    }
  }
  
  Logger.log('Database Populated Successfully!');
}

function getSampleData() {
  // Hardcoded sample data from frontend
  return [
  {
    id: 'GENERAL',
    name: "Executive Command Center",
    description: "Centralized oversight of all department metrics, approvals, and strategic KPIs.",
    themeColor: "indigo",
    iconName: "LayoutDashboard",
    kpis: [
      { label: "Global Net Profit", value: "Bir 8.4M", change: "+6.2%", trend: "up" },
      { label: "Total Supply Chain Vol", value: "124k", change: "+3.1%", trend: "up" },
      { label: "Operational Risks", value: "3", change: "-2", trend: "down" },
      { label: "Active Headcount", value: "450", change: "+12", trend: "neutral" }
    ],
    mainChartData: [
      { name: 'Jan', Revenue: 8500, Expenses: 6200, Profit: 2300 },
      { name: 'Feb', Revenue: 7800, Expenses: 5900, Profit: 1900 },
      { name: 'Mar', Revenue: 9200, Expenses: 6100, Profit: 3100 },
      { name: 'Apr', Revenue: 8900, Expenses: 6300, Profit: 2600 },
      { name: 'May', Revenue: 9800, Expenses: 6500, Profit: 3300 },
      { name: 'Jun', Revenue: 10500, Expenses: 6800, Profit: 3700 },
    ],
    secondaryChartData: [
      { name: 'Sales', value: 45 },
      { name: 'Inventory', value: 25 },
      { name: 'Operations', value: 20 },
      { name: 'HR/Admin', value: 10 },
    ],
    recentActivity: [
      { id: 1, action: "Q3 Board Report Generated", time: "1 hour ago" },
      { id: 2, action: "Compliance Audit Passed", time: "Yesterday" },
      { id: 3, action: "Strategy Meeting Scheduled", time: "2 days ago" }
    ],
    barChartTitle: "Departmental Performance Scorecard (vs Target)",
    barChartData: [
      { name: 'Sales', Target: 100, Actual: 95 },
      { name: 'Finance', Target: 100, Actual: 98 },
      { name: 'Ops', Target: 100, Actual: 88 },
      { name: 'HR', Target: 100, Actual: 92 },
    ],
    tableTitle: "Pending Operational Approvals",
    summaryTableData: [
      { id: 1, item: "Q4 Budget Expansion", category: "Finance", status: "Warning", value: "Bir 150,000", completion: 0 },
      { id: 2, item: "New Warehouse Lease", category: "Inventory", status: "Critical", value: "Bir 45,000/mo", completion: 0 },
      { id: 3, item: "Senior VP Hiring", category: "HR", status: "Stable", value: "Bir 180k Salary", completion: 0 },
      { id: 4, item: "Bulk Chemical Purchase", category: "Inventory", status: "Warning", value: "Bir 220,000", completion: 0 },
      { id: 5, item: "Sales Software Upgrade", category: "Sales", status: "Good", value: "Bir 12,000", completion: 0 },
    ],
    suggestedPrompts: [
      "Summarize the top operational risks affecting net profit.",
      "Compare Q1 vs Q2 efficiency ratios across departments.",
      "Draft a brief for the board meeting based on current profit trends."
    ]
  },
  {
    id: 'FINANCE',
    name: "Strategic Finance",
    description: "High-level financial planning, treasury management, and investment analysis.",
    themeColor: "blue",
    iconName: "BadgeDollarSign",
    kpis: [
      { label: "Net Revenue (YTD)", value: "Bir 12.8M", change: "+8.1%", trend: "up" },
      { label: "EBITDA", value: "Bir 3.2M", change: "+2.5%", trend: "up" },
      { label: "ROI (Marketing)", value: "145%", change: "+15%", trend: "up" },
      { label: "Debt-to-Equity", value: "0.45", change: "-0.05", trend: "down" }
    ],
    mainChartData: [
      { name: 'Q1', Projected: 3000, Actual: 3200 },
      { name: 'Q2', Projected: 4000, Actual: 4500 },
      { name: 'Q3', Projected: 4200, Actual: 4100 },
      { name: 'Q4', Projected: 5000, Actual: 5200 },
    ],
    secondaryChartData: [
      { name: 'Operations', value: 50 },
      { name: 'R&D', value: 20 },
      { name: 'Marketing', value: 15 },
      { name: 'Admin', value: 15 },
    ],
    recentActivity: [
      { id: 1, action: "Series B Funding Pitch Deck Updated", time: "1 hour ago" },
      { id: 2, action: "Q4 Forecasting Model Finalized", time: "Yesterday" },
      { id: 3, action: "Bank Credit Line Extended", time: "2 days ago" }
    ],
    barChartTitle: "Capital Allocation",
    barChartData: [
      { name: 'Capex', Budget: 80, Spent: 45 },
      { name: 'Opex', Budget: 120, Spent: 110 },
      { name: 'R&D', Budget: 50, Spent: 48 },
    ],
    tableTitle: "Investment Portfolio",
    summaryTableData: [
      { id: 1, item: "T-Bills 2025", category: "Low Risk", status: "Good", value: "Bir 500k", completion: 100 },
      { id: 2, item: "Growth Fund Alpha", category: "High Risk", status: "Stable", value: "Bir 250k", completion: 80 },
      { id: 3, item: "Forex Reserves", category: "Liquidity", status: "Warning", value: "Bir 1.2M", completion: 100 },
    ],
    suggestedPrompts: [
      "Analyze the variance between projected and actual revenue for Q3.",
      "Recommend portfolio adjustments to reduce liquidity risk.",
      "Calculate the impact of a 5% increase in Opex on EBITDA."
    ]
  },
  {
    id: 'ACCOUNTING',
    name: "Accounting & Control",
    description: "Detailed general ledger, accounts payable/receivable, audit trails, and ad-hoc analysis.",
    themeColor: "cyan",
    iconName: "Calculator",
    kpis: [
      { label: "Cash on Hand", value: "Bir 1.45M", change: "+2.1%", trend: "up" },
      { label: "Days Sales Outstanding", value: "42 Days", change: "-3 Days", trend: "up" },
      { label: "Current Ratio", value: "1.8", change: "+0.1", trend: "up" },
      { label: "Pending Reconciliations", value: "14", change: "+2", trend: "down" }
    ],
    mainChartData: [
      { name: 'Week 1', Payables: 12000, Receivables: 15000 },
      { name: 'Week 2', Payables: 8000, Receivables: 18000 },
      { name: 'Week 3', Payables: 15000, Receivables: 12000 },
      { name: 'Week 4', Payables: 9000, Receivables: 22000 },
    ],
    secondaryChartData: [
      { name: 'Payroll', value: 40 },
      { name: 'Inventory', value: 30 },
      { name: 'Rent/Utilities', value: 20 },
      { name: 'Tax', value: 10 },
    ],
    recentActivity: [
      { id: 1, action: "Monthly Close Process Started", time: "2 hours ago" },
      { id: 2, action: "Vendor Payment Batch #445 Processed", time: "4 hours ago" },
      { id: 3, action: "Payroll Audit Completed", time: "Yesterday" }
    ],
    barChartTitle: "Expense Categorization",
    barChartData: [
      { name: 'Travel', Budget: 5000, Actual: 4200 },
      { name: 'Office', Budget: 2000, Actual: 2500 },
      { name: 'Software', Budget: 8000, Actual: 7800 },
    ],
    tableTitle: "Recent Ledger Entries",
    summaryTableData: [
      { id: 1, item: "Inv #9921 Payment", category: "Receivable", status: "Good", value: "Bir 12,500", completion: 100 },
      { id: 2, item: "Office Supplies", category: "Expense", status: "Stable", value: "Bir 450", completion: 100 },
      { id: 3, item: "Q3 Tax Provision", category: "Liability", status: "Warning", value: "Bir 45,000", completion: 0 },
    ],
    accountingData: {
      ledger: [
        { id: "JE-1001", date: "2024-10-25", description: "Payment for Inv #9921", account: "Cash", type: "Debit", amount: 12500, status: "Posted" },
        { id: "JE-1001", date: "2024-10-25", description: "Payment for Inv #9921", account: "Accounts Receivable", type: "Credit", amount: 12500, status: "Posted" },
        { id: "JE-1002", date: "2024-10-24", description: "Office Supplies Purchase", account: "Office Expense", type: "Debit", amount: 450, status: "Posted" },
        { id: "JE-1002", date: "2024-10-24", description: "Office Supplies Purchase", account: "Cash", type: "Credit", amount: 450, status: "Posted" },
        { id: "JE-1003", date: "2024-10-23", description: "Utility Bill Oct", account: "Utilities Expense", type: "Debit", amount: 1200, status: "Pending" },
        { id: "JE-1004", date: "2024-10-22", description: "Consulting Fees", account: "Professional Services", type: "Debit", amount: 5000, status: "Flagged" },
      ],
      upcomingTax: [
        { name: "VAT Q3 Return", amount: 124500, dueDate: "2024-10-30" },
        { name: "Payroll Tax Oct", amount: 45000, dueDate: "2024-11-05" },
        { name: "Corporate Income Tax", amount: 550000, dueDate: "2024-12-31" },
      ]
    },
    suggestedPrompts: [
      "Identify any flagged journal entries that require immediate attention.",
      "Forecast cash flow based on the current Days Sales Outstanding.",
      "Summarize upcoming tax liabilities and due dates."
    ]
  },
  {
    id: 'SALES',
    name: "Sales & Distribution",
    description: "Track sales performance, leads, and distribution channels.",
    themeColor: "violet",
    iconName: "TrendingUp",
    kpis: [
      { label: "Total Sales", value: "Bir 3.4M", change: "+12.5%", trend: "up" },
      { label: "New Clients", value: "24", change: "+4", trend: "up" },
      { label: "Avg Deal Size", value: "Bir 45k", change: "-1.2%", trend: "down" },
      { label: "Lead Conversion", value: "18%", change: "+2.5%", trend: "up" }
    ],
    mainChartData: [
      { name: 'Mon', Leads: 120, Closed: 20 },
      { name: 'Tue', Leads: 132, Closed: 25 },
      { name: 'Wed', Leads: 101, Closed: 18 },
      { name: 'Thu', Leads: 154, Closed: 30 },
      { name: 'Fri', Leads: 190, Closed: 45 },
      { name: 'Sat', Leads: 80, Closed: 10 },
      { name: 'Sun', Leads: 40, Closed: 5 },
    ],
    secondaryChartData: [
      { name: 'Domestic', value: 70 },
      { name: 'Intl - EU', value: 20 },
      { name: 'Intl - Asia', value: 10 },
    ],
    recentActivity: [
      { id: 1, action: "Closed deal with MegaCorp", time: "30 mins ago" },
      { id: 2, action: "New Lead: StartUp Inc.", time: "1 hour ago" },
      { id: 3, action: "Distribution Partner Meeting", time: "3 hours ago" }
    ],
    barChartTitle: "Regional Sales Targets",
    barChartData: [
      { name: 'North', Target: 100, Achieved: 85 },
      { name: 'South', Target: 100, Achieved: 92 },
      { name: 'East', Target: 100, Achieved: 60 },
      { name: 'West', Target: 100, Achieved: 110 },
    ],
    tableTitle: "Key Account Status",
    summaryTableData: [
      { id: 1, item: "MegaCorp Industries", category: "Manufacturing", status: "Good", value: "Bir 1.2M", completion: 95 },
      { id: 2, item: "Apex Textiles", category: "Retail", status: "Warning", value: "Bir 450k", completion: 60 },
      { id: 3, item: "Global Chem", category: "Industrial", status: "Stable", value: "Bir 800k", completion: 80 },
      { id: 4, item: "FastFashion Inc.", category: "Retail", status: "Critical", value: "Bir 200k", completion: 25 },
      { id: 5, item: "BuildIt Group", category: "Construction", status: "Good", value: "Bir 600k", completion: 90 },
    ],
    suggestedPrompts: [
      "Which region is underperforming against sales targets?",
      "Analyze the trend of lead conversion rates over the last week.",
      "Identify key accounts that are at risk of churning."
    ]
  },
  {
    id: 'INVENTORY',
    name: "Warehouse & Inventory",
    description: "Manage stock levels across chemical and textile warehouses.",
    themeColor: "emerald",
    iconName: "Package",
    kpis: [
      { label: "Total Stock Value", value: "Bir 4.2M", change: "+5.4%", trend: "up" },
      { label: "Inventory Turnover", value: "8.2", change: "+1.2%", trend: "up" },
      { label: "Low Stock Alerts", value: "12", change: "-3", trend: "up" }, 
      { label: "Pending Shipments", value: "145", change: "+12", trend: "down" }
    ],
    mainChartData: [
      { name: 'Jan', Chemicals: 4000, Textiles: 2400 },
      { name: 'Feb', Chemicals: 3000, Textiles: 1398 },
      { name: 'Mar', Chemicals: 2000, Textiles: 9800 },
      { name: 'Apr', Chemicals: 2780, Textiles: 3908 },
      { name: 'May', Chemicals: 1890, Textiles: 4800 },
      { name: 'Jun', Chemicals: 2390, Textiles: 3800 },
      { name: 'Jul', Chemicals: 3490, Textiles: 4300 },
    ],
    secondaryChartData: [
      { name: 'Warehouse A', value: 400 },
      { name: 'Warehouse B', value: 300 },
      { name: 'Warehouse C', value: 300 },
      { name: 'Transit', value: 200 },
    ],
    recentActivity: [
      { id: 1, action: "Received shipment #4092 (Solvents)", time: "2 hours ago" },
      { id: 2, action: "Stock alert cleared: Textile Roll #55", time: "4 hours ago" },
      { id: 3, action: "Dispatched Order #9921 to Client X", time: "5 hours ago" }
    ],
    barChartTitle: "Monthly Shipment Volume",
    barChartData: [
      { name: 'Week 1', Inbound: 45, Outbound: 30 },
      { name: 'Week 2', Inbound: 50, Outbound: 40 },
      { name: 'Week 3', Inbound: 30, Outbound: 55 },
      { name: 'Week 4', Inbound: 60, Outbound: 45 },
    ],
    tableTitle: "High Priority Stock Items",
    summaryTableData: [
      { id: 1, item: "Industrial Acetone", category: "Chemicals", status: "Critical", value: "240 L", completion: 15 },
      { id: 2, item: "Cotton Yarn #40", category: "Textiles", status: "Stable", value: "1,200 Units", completion: 85 },
      { id: 3, item: "Dye Pigment Red", category: "Chemicals", status: "Warning", value: "50 kg", completion: 40 },
      { id: 4, item: "Polyester Sheets", category: "Textiles", status: "Good", value: "800 m", completion: 92 },
      { id: 5, item: "Safety Solvent", category: "Safety", status: "Stable", value: "120 Units", completion: 65 },
    ],
    inventoryData: {
      products: [
        {
          id: "TEX-RAW-001",
          name: "Raw Cotton Bales (Giza 86)",
          category: "Raw Fiber",
          price: 18500,
          unit: "Bale (225kg)",
          image: "https://images.unsplash.com/photo-1614806687350-1c5c645b2049?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Premium Extra Long Staple (ELS) Egyptian cotton. High tenacity and uniformity.",
          specs: [{label: "Staple Length", value: "33mm"}, {label: "Micronaire", value: "3.8-4.2"}, {label: "Strength", value: "45 g/tex"}],
          quantity: 450,
          location: "Zone A-01",
          supplier: "Nile Cotton Co.",
          lastRestock: "2024-10-15",
          incoming: 50
        },
        {
          id: "TEX-SYN-022",
          name: "Polyester Staple Fiber (PSF)",
          category: "Raw Fiber",
          price: 1250,
          unit: "Bag (50kg)",
          image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Semi-dull, high tenacity polyester fiber for blending with cotton or viscose.",
          specs: [{label: "Denier", value: "1.2D"}, {label: "Cut Length", value: "38mm"}, {label: "Color", value: "Raw White"}],
          quantity: 1200,
          location: "Zone A-04",
          supplier: "Sinopec Fibers",
          lastRestock: "2024-10-20",
          incoming: 200
        },
        {
          id: "CHEM-DYE-R19",
          name: "Reactive Blue 19 Dye",
          category: "Dyes & Pigments",
          price: 450,
          unit: "Drum (25kg)",
          image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "High-fastness brilliant blue reactive dye for cellulosic fibers and viscose.",
          specs: [{label: "Type", value: "Anthraquinone"}, {label: "Solubility", value: "High"}, {label: "Temp", value: "60°C"}],
          quantity: 85,
          location: "Zone C-15",
          supplier: "Huntsman",
          lastRestock: "2024-09-12",
          incoming: 0
        },
        {
          id: "CHEM-PROC-50",
          name: "Hydrogen Peroxide 50%",
          category: "Process Chemicals",
          price: 850,
          unit: "IBC Tank (1000L)",
          image: "https://images.unsplash.com/photo-1605333144182-4e45d625d886?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Industrial grade bleaching agent for textile preparation and pretreatment.",
          specs: [{label: "Concentration", value: "50% w/w"}, {label: "Appearance", value: "Clear Liquid"}, {label: "Grade", value: "Technical"}],
          quantity: 12,
          location: "Zone H-01",
          supplier: "Solvay",
          lastRestock: "2024-10-22",
          incoming: 4
        },
        {
          id: "YRN-SPX-40D",
          name: "Spandex/Elastane Yarn (40D)",
          category: "Yarn",
          price: 120,
          unit: "Cone (1kg)",
          image: "https://images.unsplash.com/photo-1617066860049-760c23c22b40?auto=format&fit=crop&q=80&w=400",
          stockStatus: "Low Stock",
          description: "High-stretch elastane yarn for activewear and stretch fabrics.",
          specs: [{label: "Denier", value: "40D"}, {label: "Elongation", value: "500%"}, {label: "Luster", value: "Dull"}],
          quantity: 45,
          location: "Zone B-11",
          supplier: "Hyosung",
          lastRestock: "2024-08-30",
          incoming: 100
        },
        {
          id: "CHEM-ALK-ASH",
          name: "Soda Ash Light",
          category: "Process Chemicals",
          price: 650,
          unit: "Sack (50kg)",
          image: "https://images.unsplash.com/photo-1588691885697-3ac790d81d24?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Sodium Carbonate used for pH control in dyeing and scouring processes.",
          specs: [{label: "Purity", value: "99.2% min"}, {label: "Form", value: "White Powder"}, {label: "pH", value: "11"}],
          quantity: 600,
          location: "Zone C-05",
          supplier: "Tata Chemicals",
          lastRestock: "2024-10-05",
          incoming: 0
        },
        {
          id: "CHEM-DYE-D60",
          name: "Disperse Red 60 Dye",
          category: "Dyes & Pigments",
          price: 520,
          unit: "Box (25kg)",
          image: "https://images.unsplash.com/photo-1627931336444-245c4302c019?auto=format&fit=crop&q=80&w=400",
          stockStatus: "Out of Stock",
          description: "Bright red disperse dye for polyester and acetate fibers with good leveling.",
          specs: [{label: "Class", value: "E-Type"}, {label: "Light Fastness", value: "6-7"}, {label: "Sublimation", value: "Good"}],
          quantity: 0,
          location: "Zone C-18",
          supplier: "DyStar",
          lastRestock: "2024-07-20",
          incoming: 50
        },
        {
          id: "LUB-KNIT-22",
          name: "Industrial Knitting Oil (ISO 22)",
          category: "Auxiliaries",
          price: 3200,
          unit: "Drum (200L)",
          image: "https://images.unsplash.com/photo-1622358896068-07cb12ab06c5?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Scourable needle oil for circular knitting machines to prevent friction and rust.",
          specs: [{label: "Viscosity", value: "ISO VG 22"}, {label: "Washability", value: "Excellent"}, {label: "Color", value: "Clear"}],
          quantity: 18,
          location: "Zone L-03",
          supplier: "TotalEnergies",
          lastRestock: "2024-09-15",
          incoming: 5
        },
        {
          id: "FAB-GRG-100",
          name: "Greige Woven Fabric (100% Cotton)",
          category: "Fabric",
          price: 15500,
          unit: "Roll (1000m)",
          image: "https://images.unsplash.com/photo-1520188741372-a4282361d15c?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Unfinished plain weave cotton fabric ready for dyeing or printing.",
          specs: [{label: "Construction", value: "60x60 / 20x20"}, {label: "Width", value: "63 inch"}, {label: "GSM", value: "140"}],
          quantity: 35,
          location: "Zone F-10",
          supplier: "WeaveMasters",
          lastRestock: "2024-10-18",
          incoming: 10
        },
        {
          id: "TEX-ROLL-DNM",
          name: "Heavyweight Denim Fabric Roll (14oz)",
          category: "Textile Roll",
          price: 18200,
          unit: "Roll (500m)",
          image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Durable 14oz raw indigo denim suitable for jeans and heavy-duty apparel.",
          specs: [{label: "Weight", value: "14oz"}, {label: "Width", value: "60 inch"}, {label: "Weave", value: "Twill"}],
          quantity: 22,
          location: "Zone F-12",
          supplier: "Denim Co.",
          lastRestock: "2024-09-25",
          incoming: 8
        },
        {
          id: "TEX-ROLL-CNV",
          name: "Water-Resistant Canvas Roll (Olive)",
          category: "Textile Roll",
          price: 14500,
          unit: "Roll (300m)",
          image: "https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f?auto=format&fit=crop&q=80&w=400",
          stockStatus: "Low Stock",
          description: "Heavy-duty waxed canvas, water-resistant finish for outdoor gear.",
          specs: [{label: "GSM", value: "340"}, {label: "Width", value: "58 inch"}, {label: "Finish", value: "Waxed"}],
          quantity: 8,
          location: "Zone F-15",
          supplier: "TechFabrics",
          lastRestock: "2024-08-10",
          incoming: 20
        },
        {
          id: "TEX-ROLL-SILK",
          name: "Pure Silk Satin Roll (Ivory)",
          category: "Textile Roll",
          price: 45000,
          unit: "Roll (200m)",
          image: "https://images.unsplash.com/photo-1563811802958-d784570624a1?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Luxurious 100% silk satin with high luster and soft drape for high-end fashion.",
          specs: [{label: "Momme", value: "19mm"}, {label: "Width", value: "44 inch"}, {label: "Grade", value: "6A"}],
          quantity: 12,
          location: "Zone S-01",
          supplier: "Silk Road Imports",
          lastRestock: "2024-10-01",
          incoming: 5
        },
        {
          id: "CHEM-ACID-ACE",
          name: "Acetic Acid Glacial (99.8%)",
          category: "Process Chemicals",
          price: 950,
          unit: "IBC Tank (1000kg)",
          image: "https://images.unsplash.com/photo-1629899732168-5a9d824d5570?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Essential pH regulator for dyeing and finishing processes.",
          specs: [{label: "Purity", value: "99.85%"}, {label: "Color", value: "Transparent"}, {label: "Grade", value: "Industrial"}],
          quantity: 45,
          location: "Zone C-12",
          supplier: "Global Chem Industries",
          lastRestock: "2024-10-10",
          incoming: 20
        },
        {
          id: "TEX-FIB-VIS",
          name: "Viscose Staple Fiber (VSF)",
          category: "Raw Fiber",
          price: 1450,
          unit: "Bale (200kg)",
          image: "https://images.unsplash.com/photo-1596395914147-380d19f6a100?auto=format&fit=crop&q=80&w=400", 
          stockStatus: "In Stock",
          description: "High-quality cellulosic fiber with silk-like aesthetic and excellent drape.",
          specs: [{label: "Denier", value: "1.5D"}, {label: "Cut", value: "38mm"}, {label: "Brightness", value: "Semi-Dull"}],
          quantity: 240,
          location: "Zone A-05",
          supplier: "Lenzing Group",
          lastRestock: "2024-09-28",
          incoming: 0
        },
        {
          id: "AUX-SOFT-FLK",
          name: "Cationic Softener Flakes",
          category: "Auxiliaries",
          price: 2200,
          unit: "Bag (25kg)",
          image: "https://images.unsplash.com/photo-1615560416962-d27c62d8544d?auto=format&fit=crop&q=80&w=400", 
          stockStatus: "Low Stock",
          description: "Concentrated softener for cotton and blended fabrics, imparting soft hand feel.",
          specs: [{label: "Ionicity", value: "Cationic"}, {label: "pH", value: "4.5-5.5"}, {label: "Solubility", value: "Hot Water"}],
          quantity: 15,
          location: "Zone B-22",
          supplier: "Archroma",
          lastRestock: "2024-08-15",
          incoming: 50
        },
        {
          id: "RAW-NYL-CHP",
          name: "Nylon 6 Chips (Semi-Dull)",
          category: "Raw Material",
          price: 1800,
          unit: "Bag (750kg)",
          image: "https://images.unsplash.com/photo-1623945032486-1329a147d33b?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "High viscosity nylon 6 chips for spinning high-tenacity industrial yarns.",
          specs: [{label: "Viscosity", value: "2.7"}, {label: "Moisture", value: "0.05%"}, {label: "Melting Pt", value: "220°C"}],
          quantity: 80,
          location: "Zone A-02",
          supplier: "BASF",
          lastRestock: "2024-10-01",
          incoming: 10
        }
      ]
    },
    suggestedPrompts: [
      "Predict next month's demand for chemicals based on historical data.",
      "List all items with 'Critical' stock status.",
      "Analyze the ratio of inbound to outbound shipments."
    ]
  },
  {
    id: 'HR',
    name: "HR & Administration",
    description: "Workforce analytics, payroll, and recruitment.",
    themeColor: "rose",
    iconName: "Users",
    kpis: [
      { label: "Total Headcount", value: "450", change: "+12", trend: "up" },
      { label: "Retention Rate", value: "94%", change: "-1%", trend: "down" },
      { label: "Open Positions", value: "18", change: "+3", trend: "neutral" },
      { label: "Training Hours", value: "1,240", change: "+15%", trend: "up" }
    ],
    mainChartData: [
      { name: 'Jan', Hires: 5, Exits: 1 },
      { name: 'Feb', Hires: 8, Exits: 2 },
      { name: 'Mar', Hires: 4, Exits: 1 },
      { name: 'Apr', Hires: 12, Exits: 3 },
      { name: 'May', Hires: 7, Exits: 0 },
      { name: 'Jun', Hires: 9, Exits: 2 },
    ],
    secondaryChartData: [
      { name: 'Engineering', value: 30 },
      { name: 'Sales', value: 40 },
      { name: 'Logistics', value: 20 },
      { name: 'Admin', value: 10 },
    ],
    recentActivity: [
      { id: 1, action: "New Hire Orientation", time: "Today" },
      { id: 2, action: "Payroll processed for Oct", time: "Yesterday" },
      { id: 3, action: "Policy update: Remote Work", time: "3 days ago" }
    ],
    barChartTitle: "Training & Development",
    barChartData: [
      { name: 'Q1', Targeted: 500, Completed: 480 },
      { name: 'Q2', Targeted: 600, Completed: 550 },
      { name: 'Q3', Targeted: 600, Completed: 620 },
      { name: 'Q4', Targeted: 700, Completed: 300 },
    ],
    tableTitle: "Recruitment Pipeline",
    summaryTableData: [
      { id: 1, item: "Senior Chemist", category: "R&D", status: "Critical", value: "2 Open", completion: 10 },
      { id: 2, item: "Warehouse Manager", category: "Logistics", status: "Warning", value: "1 Open", completion: 40 },
      { id: 3, item: "Sales Associate", category: "Sales", status: "Stable", value: "5 Open", completion: 70 },
      { id: 4, item: "HR Specialist", category: "Admin", status: "Good", value: "1 Open", completion: 90 },
      { id: 5, item: "Forklift Operator", category: "Logistics", status: "Stable", value: "3 Open", completion: 60 },
    ],
    suggestedPrompts: [
      "Analyze the correlation between training hours and retention rate.",
      "Identify the departments with the highest turnover.",
      "Draft a recruitment strategy for 'Critical' open positions."
    ]
  },
  {
    id: 'SYSTEM_ADMIN',
    name: "System Administration",
    description: "Manage user access, security protocols, and system logs.",
    themeColor: "gray",
    iconName: "ShieldAlert",
    kpis: [
      { label: "Active Users", value: "48", change: "+2", trend: "up" },
      { label: "Failed Login Attempts", value: "12", change: "+5", trend: "down" },
      { label: "System Uptime", value: "99.9%", change: "0%", trend: "neutral" },
      { label: "Pending Access Requests", value: "3", change: "-1", trend: "up" }
    ],
    mainChartData: [],
    secondaryChartData: [],
    recentActivity: [],
    barChartTitle: "",
    barChartData: [],
    tableTitle: "",
    summaryTableData: [],
    systemAdminData: {
      users: [
        { id: 1, name: "Frehun Adefris", role: "Director", department: "Executive", employeeId: "EMP-1001", pin: "1234", status: "Active", lastLogin: "Today, 09:15 AM", email: "f.adefris@globaltrade.co" },
        { id: 2, name: "Belete Chala", role: "Chief Financial Officer", department: "Finance", employeeId: "EMP-2023", pin: "9001", status: "Active", lastLogin: "Today, 08:00 AM", email: "b.chala@globaltrade.co" },
        { id: 3, name: "Anteneh Aseres", role: "Senior Accountant", department: "Accounting", employeeId: "EMP-3045", pin: "0007", status: "Active", lastLogin: "Today, 08:30 AM", email: "a.aseres@globaltrade.co" },
        { id: 4, name: "Tigist Bekele", role: "Sales Manager", department: "Sales", employeeId: "EMP-4100", pin: "9988", status: "Active", lastLogin: "2 hours ago", email: "t.bekele@globaltrade.co" },
        { id: 5, name: "Dawit Kebede", role: "Warehouse Manager", department: "Inventory", employeeId: "EMP-5200", pin: "1010", status: "Active", lastLogin: "Yesterday", email: "d.kebede@globaltrade.co" },
        { id: 6, name: "Hanna Alemu", role: "HR Director", department: "HR", employeeId: "EMP-6300", pin: "4455", status: "Active", lastLogin: "Today, 09:00 AM", email: "h.alemu@globaltrade.co" },
        { id: 7, name: "Abel Girma", role: "System Administrator", department: "System Admin", employeeId: "EMP-7000", pin: "0000", status: "Active", lastLogin: "Now", email: "a.girma@globaltrade.co" },
        { id: 8, name: "Sara Tefera", role: "Data Analyst", department: "Data Admin", employeeId: "EMP-8001", pin: "1111", status: "Active", lastLogin: "Yesterday", email: "s.tefera@globaltrade.co" },
        { id: 9, name: "Solomon Tesfaye", role: "Client Partner", department: "Customer", employeeId: "EXT-9000", pin: "1234", status: "Active", lastLogin: "Today, 10:45 AM", email: "solomon@partner.co" },
      ],
      logs: [
        { id: 1, event: "Login Success", user: "Frehun Adefris", time: "09:15 AM", ip: "192.168.1.10", status: "Success" },
        { id: 2, event: "Failed Login (3 attempts)", user: "Dawit Kebede", time: "Yesterday", ip: "192.168.1.45", status: "Warning" },
        { id: 3, event: "Password Reset", user: "Abel Girma", time: "Yesterday", ip: "192.168.1.5", status: "Success" },
        { id: 4, event: "New User Created", user: "Abel Girma", time: "Yesterday", ip: "192.168.1.5", status: "Success" },
      ]
    },
    suggestedPrompts: [
      "Review the security logs for any suspicious activity.",
      "List all users with 'Locked' status.",
      "Analyze the trend of failed login attempts."
    ]
  },
  {
    id: 'DATA_ADMIN',
    name: "Data Administration",
    description: "Centralized data registry for managing company-wide datasets and configurations.",
    themeColor: "slate",
    iconName: "Database",
    kpis: [], 
    mainChartData: [],
    secondaryChartData: [],
    recentActivity: [],
    barChartTitle: "",
    barChartData: [],
    tableTitle: "",
    summaryTableData: [],
    suggestedPrompts: [
      "Verify data consistency across all departmental datasets.",
      "Identify duplicate records in the master registry.",
      "Summarize the most frequently accessed data categories."
    ]
  },
  {
    id: 'CUSTOMER',
    name: "Customer Portal",
    description: "Client access for orders, tracking, and product catalog.",
    themeColor: "blue",
    iconName: "Users",
    kpis: [], 
    mainChartData: [],
    secondaryChartData: [],
    recentActivity: [],
    barChartTitle: "",
    barChartData: [],
    tableTitle: "",
    summaryTableData: [],
    customerData: {
      creditLimit: 500000,
      availableCredit: 324500,
      outstandingBalance: 175500,
      loyaltyTier: "Platinum Partner",
      orders: [
        { id: "ORD-2024-8821", date: "2024-10-24", status: "Processing", total: 45200, items: 12, poNumber: "PO-9921" },
        { id: "ORD-2024-8755", date: "2024-10-15", status: "Shipped", total: 12500, items: 4, poNumber: "PO-9844" },
        { id: "ORD-2024-8601", date: "2024-09-30", status: "Delivered", total: 89000, items: 25, poNumber: "PO-9100" },
        { id: "ORD-2024-8110", date: "2024-09-12", status: "Delivered", total: 28400, items: 8, poNumber: "PO-8822" },
      ],
      products: [
        {
          id: "TEX-RAW-001",
          name: "Raw Cotton Bales (Giza 86)",
          category: "Raw Fiber",
          price: 18500,
          unit: "Bale (225kg)",
          image: "https://images.unsplash.com/photo-1614806687350-1c5c645b2049?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Premium Extra Long Staple (ELS) Egyptian cotton. High tenacity and uniformity.",
          specs: [{label: "Staple Length", value: "33mm"}, {label: "Micronaire", value: "3.8-4.2"}, {label: "Strength", value: "45 g/tex"}]
        },
        {
          id: "TEX-SYN-022",
          name: "Polyester Staple Fiber (PSF)",
          category: "Raw Fiber",
          price: 1250,
          unit: "Bag (50kg)",
          image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Semi-dull, high tenacity polyester fiber for blending with cotton or viscose.",
          specs: [{label: "Denier", value: "1.2D"}, {label: "Cut Length", value: "38mm"}, {label: "Color", value: "Raw White"}]
        },
        {
          id: "CHEM-DYE-R19",
          name: "Reactive Blue 19 Dye",
          category: "Dyes & Pigments",
          price: 450,
          unit: "Drum (25kg)",
          image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "High-fastness brilliant blue reactive dye for cellulosic fibers and viscose.",
          specs: [{label: "Type", value: "Anthraquinone"}, {label: "Solubility", value: "High"}, {label: "Temp", value: "60°C"}]
        },
        {
          id: "CHEM-PROC-50",
          name: "Hydrogen Peroxide 50%",
          category: "Process Chemicals",
          price: 850,
          unit: "IBC Tank (1000L)",
          image: "https://images.unsplash.com/photo-1605333144182-4e45d625d886?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Industrial grade bleaching agent for textile preparation and pretreatment.",
          specs: [{label: "Concentration", value: "50% w/w"}, {label: "Appearance", value: "Clear Liquid"}, {label: "Grade", value: "Technical"}]
        },
        {
          id: "YRN-SPX-40D",
          name: "Spandex/Elastane Yarn (40D)",
          category: "Yarn",
          price: 120,
          unit: "Cone (1kg)",
          image: "https://images.unsplash.com/photo-1617066860049-760c23c22b40?auto=format&fit=crop&q=80&w=400",
          stockStatus: "Low Stock",
          description: "High-stretch elastane yarn for activewear and stretch fabrics.",
          specs: [{label: "Denier", value: "40D"}, {label: "Elongation", value: "500%"}, {label: "Luster", value: "Dull"}]
        },
        {
          id: "CHEM-ALK-ASH",
          name: "Soda Ash Light",
          category: "Process Chemicals",
          price: 650,
          unit: "Sack (50kg)",
          image: "https://images.unsplash.com/photo-1588691885697-3ac790d81d24?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Sodium Carbonate used for pH control in dyeing and scouring processes.",
          specs: [{label: "Purity", value: "99.2% min"}, {label: "Form", value: "White Powder"}, {label: "pH", value: "11"}]
        },
        {
          id: "CHEM-DYE-D60",
          name: "Disperse Red 60 Dye",
          category: "Dyes & Pigments",
          price: 520,
          unit: "Box (25kg)",
          image: "https://images.unsplash.com/photo-1627931336444-245c4302c019?auto=format&fit=crop&q=80&w=400",
          stockStatus: "Out of Stock",
          description: "Bright red disperse dye for polyester and acetate fibers with good leveling.",
          specs: [{label: "Class", value: "E-Type"}, {label: "Light Fastness", value: "6-7"}, {label: "Sublimation", value: "Good"}]
        },
        {
          id: "LUB-KNIT-22",
          name: "Industrial Knitting Oil (ISO 22)",
          category: "Auxiliaries",
          price: 3200,
          unit: "Drum (200L)",
          image: "https://images.unsplash.com/photo-1622358896068-07cb12ab06c5?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Scourable needle oil for circular knitting machines to prevent friction and rust.",
          specs: [{label: "Viscosity", value: "ISO VG 22"}, {label: "Washability", value: "Excellent"}, {label: "Color", value: "Clear"}]
        },
        {
          id: "FAB-GRG-100",
          name: "Greige Woven Fabric (100% Cotton)",
          category: "Fabric",
          price: 15500,
          unit: "Roll (1000m)",
          image: "https://images.unsplash.com/photo-1520188741372-a4282361d15c?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Unfinished plain weave cotton fabric ready for dyeing or printing.",
          specs: [{label: "Construction", value: "60x60 / 20x20"}, {label: "Width", value: "63 inch"}, {label: "GSM", value: "140"}]
        },
        {
          id: "TEX-ROLL-DNM",
          name: "Heavyweight Denim Fabric Roll (14oz)",
          category: "Textile Roll",
          price: 18200,
          unit: "Roll (500m)",
          image: "https://images.unsplash.com/photo-1584589167171-541ce45f1eea?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Durable 14oz raw indigo denim suitable for jeans and heavy-duty apparel.",
          specs: [{label: "Weight", value: "14oz"}, {label: "Width", value: "60 inch"}, {label: "Weave", value: "Twill"}]
        },
        {
          id: "TEX-ROLL-CNV",
          name: "Water-Resistant Canvas Roll (Olive)",
          category: "Textile Roll",
          price: 14500,
          unit: "Roll (300m)",
          image: "https://images.unsplash.com/photo-1523450001312-faa4e2e37f0f?auto=format&fit=crop&q=80&w=400",
          stockStatus: "Low Stock",
          description: "Heavy-duty waxed canvas, water-resistant finish for outdoor gear.",
          specs: [{label: "GSM", value: "340"}, {label: "Width", value: "58 inch"}, {label: "Finish", value: "Waxed"}]
        },
        {
          id: "TEX-ROLL-SILK",
          name: "Pure Silk Satin Roll (Ivory)",
          category: "Textile Roll",
          price: 45000,
          unit: "Roll (200m)",
          image: "https://images.unsplash.com/photo-1563811802958-d784570624a1?auto=format&fit=crop&q=80&w=400",
          stockStatus: "In Stock",
          description: "Luxurious 100% silk satin with high luster and soft drape for high-end fashion.",
          specs: [{label: "Momme", value: "19mm"}, {label: "Width", value: "44 inch"}, {label: "Grade", value: "6A"}]
        }
      ]
    },
    suggestedPrompts: [
      "What is my current available credit limit?",
      "List my orders that are currently 'Processing'.",
      "Are there any alternative products for 'Out of Stock' items?"
    ]
  },
];
}