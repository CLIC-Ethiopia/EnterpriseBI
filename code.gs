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
    let action = e.parameter.action;
    let payload = null;

    // Handle POST body if present (for writing data)
    if (e.postData && e.postData.contents) {
        try {
            const body = JSON.parse(e.postData.contents);
            if (body.action) action = body.action;
            if (body.data) payload = body.data;
        } catch (jsonErr) {
            // Fallback if content isn't JSON
        }
    }

    const result = routeAction(action, e, payload);
    
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

function routeAction(action, e, payload) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  
  switch (action) {
    case 'getAllDepartments':
      return getAllDepartments(ss);
    case 'addProduct':
      return addProductToSheet(ss, payload);
    default:
      return { status: 'error', message: 'Invalid Action' };
  }
}

// ==========================================
// WRITE LOGIC
// ==========================================

function addProductToSheet(ss, product) {
    if (!product) return { status: 'error', message: 'No product data provided' };
    
    const sheet = ss.getSheetByName('Inventory');
    if (!sheet) return { status: 'error', message: 'Inventory sheet not found' };

    // Generate ID if missing
    if (!product.id) {
       product.id = 'PROD-' + Math.floor(Math.random() * 10000);
    }

    // Schema: ['id', 'name', 'category', 'price', 'unit', 'image', 'stockStatus', 'description', 'quantity', 'location', 'supplier', 'lastRestock', 'incoming', 'specs_json']
    const row = [
        product.id,
        product.name,
        product.category,
        product.price,
        product.unit,
        product.image || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400', // Default image
        product.stockStatus || 'In Stock',
        product.description,
        product.quantity || 0,
        product.location,
        product.supplier,
        product.lastRestock || new Date().toISOString().split('T')[0],
        product.incoming || 0,
        JSON.stringify(product.specs || [])
    ];

    sheet.appendRow(row);
    return { status: 'success', message: 'Product added successfully', productId: product.id };
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
    // Optional: Only clear if you want to reset. Be careful in production!
    // sheet.clear(); 
    // sheet.appendRow(headers);
    if (sheet.getLastRow() === 0) {
        sheet.appendRow(headers);
    }
  }
}