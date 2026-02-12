
// ... existing enums ...
export enum DepartmentType {
  GENERAL = 'GENERAL',
  FINANCE = 'FINANCE',
  ACCOUNTING = 'ACCOUNTING',
  INVENTORY = 'INVENTORY',
  HR = 'HR',
  SALES = 'SALES',
  CUSTOMER = 'CUSTOMER',
  DATA_ADMIN = 'DATA_ADMIN',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  IMPORT_COSTING = 'IMPORT_COSTING'
}

export interface KPI {
  label: string;
  value: string;
  change: string; // e.g., "+12%"
  trend: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface SummaryRow {
  id: number;
  item: string;
  category: string;
  status: 'Critical' | 'Warning' | 'Stable' | 'Good';
  value: string;
  completion: number;
}

// New Interfaces for Customer Portal
export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  image: string;
  stockStatus: 'In Stock' | 'Low Stock' | 'Out of Stock';
  specs: ProductSpec[];
  description: string;
}

export interface WarehouseProduct extends Product {
  quantity: number;
  location: string;
  supplier: string;
  lastRestock: string;
  incoming: number;
}

export interface InventoryData {
  products: WarehouseProduct[];
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Pending Approval';
  total: number;
  items: number; // item count
  poNumber: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
  customerName?: string;
  customerId?: string;
}

export interface RegisteredCustomer {
  id: string;
  name: string;
  email: string;
  type: 'Gold' | 'Silver' | 'Bronze' | 'Platinum';
  totalOrders: number;
  totalSpent: number;
}

export interface CustomerSpecificData {
  creditLimit: number;
  availableCredit: number;
  outstandingBalance: number;
  loyaltyTier: string;
  products: Product[];
  orders: Order[];
}

// ... rest of the file ...
// System Admin Interfaces
export interface User {
  id: number;
  name: string;
  role: string;
  department: string;
  employeeId: string;
  pin: string;
  status: 'Active' | 'Suspended' | 'Locked';
  lastLogin: string;
  email: string;
}

export interface SystemLog {
  id: number;
  event: string;
  user: string;
  time: string;
  ip: string;
  status: 'Success' | 'Failed' | 'Warning';
}

export interface SystemAdminData {
  users: User[];
  logs: SystemLog[];
}

// Accounting Interfaces
export interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  account: string;
  type: 'Debit' | 'Credit';
  amount: number;
  status: 'Posted' | 'Pending' | 'Flagged';
}

export interface AccountingData {
  ledger: LedgerEntry[];
  upcomingTax: { name: string; amount: number; dueDate: string }[];
}

// NEW: Ethiopian Compliance Types
export type SupplierTaxCategory = 'VAT_Reg' | 'TOT_Reg' | 'None';
export type TransactionType = 'Goods' | 'Services';

export interface TaxCalculationResult {
  baseAmount: number;
  vatAmount: number;
  totAmount: number;
  whtAmount: number;
  netPayable: number;
  isWhtApplicable: boolean;
  notes: string[];
}

// NEW: Logistics Interfaces
export interface LogisticsRoute {
  id: string;
  origin: string;
  destination: string;
  coordinates: { x1: number, y1: number, x2: number, y2: number }; // Percentage based coords
  status: 'In Transit' | 'Customs' | 'Delivered' | 'Delayed';
  type: 'Air' | 'Sea' | 'Land';
  goods: string;
  value: string;
}

export interface TickerItem {
  label: string;
  value: string;
  change: number;
  type: 'currency' | 'commodity' | 'alert';
}

export interface DepartmentData {
  id: DepartmentType;
  name: string;
  description: string;
  themeColor: string;
  iconName: string; // Lucide icon name
  kpis: KPI[];
  mainChartData: ChartDataPoint[];
  secondaryChartData: ChartDataPoint[];
  recentActivity: { id: number; action: string; time: string }[];
  barChartTitle: string;
  barChartData: ChartDataPoint[];
  tableTitle: string;
  summaryTableData: SummaryRow[];
  suggestedPrompts?: string[]; // New field for AI prompts
  customerData?: CustomerSpecificData; // Optional field for customer view
  systemAdminData?: SystemAdminData; // Optional field for system admin
  accountingData?: AccountingData; // Optional field for accounting
  inventoryData?: InventoryData; // Optional field for warehouse inventory
  logisticsRoutes?: LogisticsRoute[]; // NEW: For map visualization
}

export interface AIInsight {
  type: 'analysis' | 'warning' | 'prediction';
  text: string;
}
