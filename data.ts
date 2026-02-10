import { DepartmentType, DepartmentData } from './types';

export const DEPARTMENTS: DepartmentData[] = [
  {
    id: DepartmentType.GENERAL,
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
    ]
  },
  {
    id: DepartmentType.SYSTEM_ADMIN,
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
        { id: 1, name: "Alex Morgan", role: "Director", department: "Executive", employeeId: "EMP-8821", pin: "1234", status: "Active", lastLogin: "Today, 09:15 AM", email: "a.morgan@globaltrade.co" },
        { id: 2, name: "Sarah Connor", role: "Manager", department: "Warehouse", employeeId: "EMP-9001", pin: "4321", status: "Active", lastLogin: "Yesterday, 04:20 PM", email: "s.connor@globaltrade.co" },
        { id: 3, name: "James Bond", role: "Agent", department: "Sales", employeeId: "EMP-0007", pin: "0007", status: "Active", lastLogin: "Today, 10:00 AM", email: "j.bond@globaltrade.co" },
        { id: 4, name: "Ellen Ripley", role: "Supervisor", department: "Warehouse", employeeId: "EMP-2122", pin: "9988", status: "Locked", lastLogin: "2 days ago", email: "e.ripley@globaltrade.co" },
        { id: 5, name: "Tony Stark", role: "Consultant", department: "R&D", employeeId: "EMP-3000", pin: "1010", status: "Suspended", lastLogin: "Last Week", email: "t.stark@globaltrade.co" },
        { id: 6, name: "Bruce Wayne", role: "Investor", department: "Finance", employeeId: "EMP-1001", pin: "9090", status: "Active", lastLogin: "Today, 08:00 AM", email: "b.wayne@globaltrade.co" },
      ],
      logs: [
        { id: 1, event: "Login Success", user: "Alex Morgan", time: "10:42 AM", ip: "192.168.1.10", status: "Success" },
        { id: 2, event: "Failed Login (3 attempts)", user: "Ellen Ripley", time: "09:15 AM", ip: "192.168.1.45", status: "Warning" },
        { id: 3, event: "Password Reset", user: "System Admin", time: "Yesterday", ip: "192.168.1.5", status: "Success" },
        { id: 4, event: "New User Created", user: "System Admin", time: "Yesterday", ip: "192.168.1.5", status: "Success" },
      ]
    }
  },
  {
    id: DepartmentType.DATA_ADMIN,
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
    summaryTableData: []
  },
  {
    id: DepartmentType.CUSTOMER,
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
          id: "CHEM-001",
          name: "Industrial Acetone (99.5%)",
          category: "Solvents",
          price: 450,
          unit: "Barrel (200L)",
          image: "https://images.unsplash.com/photo-1622358896068-07cb12ab06c5?auto=format&fit=crop&q=80&w=300&h=200",
          stockStatus: "In Stock",
          description: "High-purity acetone suitable for industrial cleaning and synthesis applications.",
          specs: [{label: "Purity", value: "99.5%"}, {label: "Grade", value: "Technical"}, {label: "Boiling Point", value: "56°C"}]
        },
        {
          id: "TEX-202",
          name: "Poly-Blend Fabric Roll",
          category: "Textiles",
          price: 1200,
          unit: "Roll (500m)",
          image: "https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=300&h=200",
          stockStatus: "Low Stock",
          description: "Durable polyester-cotton blend, pre-treated for dye absorption.",
          specs: [{label: "GSM", value: "180"}, {label: "Width", value: "60 inch"}, {label: "Weave", value: "Plain"}]
        },
        {
          id: "CHEM-055",
          name: "Sulfuric Acid (Concentrated)",
          category: "Acids",
          price: 380,
          unit: "Drum (100L)",
          image: "https://images.unsplash.com/photo-1605333144182-4e45d625d886?auto=format&fit=crop&q=80&w=300&h=200",
          stockStatus: "In Stock",
          description: "Industrial grade sulfuric acid for processing and manufacturing.",
          specs: [{label: "Concentration", value: "98%"}, {label: "Appearance", value: "Clear Oily"}, {label: "Density", value: "1.84 g/cm3"}]
        },
        {
          id: "TEX-305",
          name: "Organic Cotton Yarn",
          category: "Raw Material",
          price: 85,
          unit: "Spool (5kg)",
          image: "https://images.unsplash.com/photo-1596541618331-b82b99818804?auto=format&fit=crop&q=80&w=300&h=200",
          stockStatus: "In Stock",
          description: "100% certified organic cotton yarn, suitable for premium garment production.",
          specs: [{label: "Count", value: "40s"}, {label: "Origin", value: "Egypt"}, {label: "Certification", value: "GOTS"}]
        },
        {
          id: "CHEM-102",
          name: "Titanium Dioxide Pigment",
          category: "Additives",
          price: 2100,
          unit: "Pallet (500kg)",
          image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=300&h=200",
          stockStatus: "Out of Stock",
          description: "Premium white pigment for paints, coatings, and plastics.",
          specs: [{label: "Form", value: "Powder"}, {label: "Whiteness", value: "98%"}, {label: "Oil Absorption", value: "21g/100g"}]
        }
      ]
    }
  },
  {
    id: DepartmentType.INVENTORY,
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
    ]
  },
  {
    id: DepartmentType.FINANCE,
    name: "Finance & Accounting",
    description: "Monitor cash flow, revenue, and expenditures.",
    themeColor: "blue",
    iconName: "Banknote",
    kpis: [
      { label: "Net Revenue (YTD)", value: "Bir 12.8M", change: "+8.1%", trend: "up" },
      { label: "Operating Expenses", value: "Bir 4.1M", change: "-2.3%", trend: "up" },
      { label: "Net Profit Margin", value: "22%", change: "+1.5%", trend: "up" },
      { label: "Outstanding Invoices", value: "Bir 850k", change: "+5%", trend: "down" }
    ],
    mainChartData: [
      { name: 'Q1', Revenue: 3200, Expenses: 1200 },
      { name: 'Q2', Revenue: 4500, Expenses: 1400 },
      { name: 'Q3', Revenue: 4100, Expenses: 1100 },
      { name: 'Q4', Revenue: 5200, Expenses: 1600 },
    ],
    secondaryChartData: [
      { name: 'Operations', value: 60 },
      { name: 'Logistics', value: 25 },
      { name: 'Admin', value: 15 },
    ],
    recentActivity: [
      { id: 1, action: "Invoice #INV-2024-001 Generated", time: "10 mins ago" },
      { id: 2, action: "Q3 Tax Filing Submitted", time: "1 day ago" },
      { id: 3, action: "Payment Received: Client Y", time: "2 days ago" }
    ],
    barChartTitle: "Departmental Budget vs Actual",
    barChartData: [
      { name: 'IT', Budget: 80, Actual: 75 },
      { name: 'HR', Budget: 40, Actual: 45 },
      { name: 'Sales', Budget: 120, Actual: 110 },
      { name: 'Ops', Budget: 200, Actual: 190 },
    ],
    tableTitle: "Recent Large Transactions",
    summaryTableData: [
      { id: 1, item: "Equipment Purchase", category: "Capex", status: "Good", value: "Bir 45,000", completion: 100 },
      { id: 2, item: "Vendor Payout: ABC Chem", category: "OpEx", status: "Stable", value: "Bir 12,400", completion: 100 },
      { id: 3, item: "Client Refund Request", category: "Adjustment", status: "Warning", value: "Bir 2,300", completion: 30 },
      { id: 4, item: "Quarterly Audit Fee", category: "Compliance", status: "Critical", value: "Bir 8,000", completion: 10 },
      { id: 5, item: "Logistics Retainer", category: "OpEx", status: "Good", value: "Bir 15,000", completion: 100 },
    ]
  },
  {
    id: DepartmentType.SALES,
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
    ]
  },
  {
    id: DepartmentType.HR,
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
    ]
  }
];