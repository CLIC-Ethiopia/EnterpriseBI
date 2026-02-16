
import React, { useState, useEffect, useMemo } from 'react';
import { DepartmentData, LedgerEntry, SupplierTaxCategory, TransactionType, TaxCalculationResult, ReportMetric, ReportRequest } from '../types';
import { 
  Calculator, PieChart as PieIcon, TrendingUp, DollarSign, Calendar, Search, 
  FileText, Sliders, ArrowRight, Plus, Download, RefreshCw, Activity, Layers, Scale, X, GraduationCap,
  Stamp, Printer, AlertCircle, FileCheck, CheckCircle2, FileBarChart, Table, Grid3X3, Maximize2, Minimize2, Divide,
  Package, Landmark, Truck, BarChart2, Sigma, GitCommit, Target, Zap, Coins, ShoppingBag, TrendingDown
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie, ComposedChart, Line, Scatter
} from 'recharts';
import ExecutiveReporting from './ExecutiveReporting';

interface AccountingPortalProps {
  data: DepartmentData;
  onOpenAI: () => void;
  isDarkMode: boolean;
}

const ACCOUNTING_METRICS: ReportMetric[] = [
  { id: 'acc1', name: 'General Ledger Bal.', category: 'Finance', type: 'currency' },
  { id: 'acc2', name: 'Accounts Payable', category: 'Finance', type: 'currency' },
  { id: 'acc3', name: 'Accounts Receivable', category: 'Finance', type: 'currency' },
  { id: 'acc4', name: 'Tax Liability', category: 'Finance', type: 'currency' },
  { id: 'acc5', name: 'Op. Expenses', category: 'Finance', type: 'currency' },
  { id: 'acc6', name: 'Payroll Cost', category: 'HR', type: 'currency' },
];

// ... (Existing Constants: ACCOUNTING_REQUESTS, CROSS_DEPT_DATA, BUDGET_DATA, INVENTORY_DATA, Pivot Logic) ...
const ACCOUNTING_REQUESTS: ReportRequest[] = [
  { id: 'REQ-201', title: 'Q3 Vendor Payment Summary', submittedBy: 'Belete Chala', department: 'Finance', dateSubmitted: '2024-10-25', priority: 'Normal', status: 'Pending', description: 'Consolidated report of all payments made to chemical suppliers in Q3.' },
  { id: 'REQ-202', title: 'Expense Audit: Marketing', submittedBy: 'Tigist Bekele', department: 'Sales', dateSubmitted: '2024-10-24', priority: 'High', status: 'Approved', description: 'Review of travel and event expenses against budget.' },
];

const CROSS_DEPT_DATA = [
  { id: 1, dept: 'Sales', category: 'Travel', month: 'Jan', amount: 15000, riskScore: 85 },
  { id: 2, dept: 'Sales', category: 'Software', month: 'Jan', amount: 4200, riskScore: 20 },
  { id: 3, dept: 'IT', category: 'Hardware', month: 'Jan', amount: 45000, riskScore: 10 },
  { id: 4, dept: 'HR', category: 'Training', month: 'Jan', amount: 8000, riskScore: 5 },
  { id: 5, dept: 'Ops', category: 'Logistics', month: 'Jan', amount: 120000, riskScore: 60 },
  { id: 6, dept: 'Sales', category: 'Travel', month: 'Feb', amount: 18500, riskScore: 90 },
  { id: 7, dept: 'Sales', category: 'Software', month: 'Feb', amount: 4200, riskScore: 20 },
  { id: 8, dept: 'IT', category: 'Cloud', month: 'Feb', amount: 12000, riskScore: 30 },
  { id: 9, dept: 'HR', category: 'Recruiting', month: 'Feb', amount: 15000, riskScore: 40 },
  { id: 10, dept: 'Ops', category: 'Logistics', month: 'Feb', amount: 95000, riskScore: 55 },
  { id: 11, dept: 'Sales', category: 'Entertainment', month: 'Mar', amount: 5000, riskScore: 95 },
  { id: 12, dept: 'IT', category: 'Software', month: 'Mar', amount: 6000, riskScore: 15 },
];

const BUDGET_DATA = [
  { dept: 'Sales', category: 'Travel', month: 'Jan', budget: 20000, actual: 15000, variance: 5000 },
  { dept: 'Sales', category: 'Marketing', month: 'Jan', budget: 50000, actual: 48000, variance: 2000 },
  { dept: 'IT', category: 'Hardware', month: 'Jan', budget: 40000, actual: 45000, variance: -5000 },
  { dept: 'HR', category: 'Training', month: 'Jan', budget: 15000, actual: 8000, variance: 7000 },
  { dept: 'Ops', category: 'Logistics', month: 'Jan', budget: 100000, actual: 120000, variance: -20000 },
  { dept: 'Sales', category: 'Travel', month: 'Feb', budget: 20000, actual: 18500, variance: 1500 },
  { dept: 'IT', category: 'Software', month: 'Feb', budget: 15000, actual: 12000, variance: 3000 },
  { dept: 'HR', category: 'Recruiting', month: 'Feb', budget: 10000, actual: 15000, variance: -5000 },
  { dept: 'Ops', category: 'Maintenance', month: 'Feb', budget: 25000, actual: 22000, variance: 3000 },
];

const INVENTORY_DATA = [
  { item: 'Chemical A', category: 'Chemicals', location: 'Zone A', quantity: 500, unit_cost: 50, total_value: 25000, status: 'In Stock' },
  { item: 'Fabric Roll X', category: 'Textiles', location: 'Zone B', quantity: 100, unit_cost: 150, total_value: 15000, status: 'Low Stock' },
  { item: 'Dye Blue', category: 'Chemicals', location: 'Zone A', quantity: 1200, unit_cost: 20, total_value: 24000, status: 'In Stock' },
  { item: 'Cotton Yarn', category: 'Textiles', location: 'Zone C', quantity: 0, unit_cost: 80, total_value: 0, status: 'Out of Stock' },
  { item: 'Solvent Z', category: 'Chemicals', location: 'Zone B', quantity: 300, unit_cost: 40, total_value: 12000, status: 'In Stock' },
  { item: 'Spare Parts', category: 'Machinery', location: 'Zone D', quantity: 50, unit_cost: 500, total_value: 25000, status: 'Critical' },
  { item: 'Packaging', category: 'Supplies', location: 'Zone C', quantity: 5000, unit_cost: 2, total_value: 10000, status: 'In Stock' },
];

// Pivot Helper Functions
type AggregationType = 'sum' | 'count' | 'avg' | 'max' | 'min';

const calculatePivotData = (data: any[], rowKeyField: string, colKeyField: string, valueField: string, operation: AggregationType) => {
  const rowKeys = new Set<string>();
  const colKeys = new Set<string>();
  const matrix: Record<string, Record<string, number>> = {};
  const counts: Record<string, Record<string, number>> = {}; 
  
  let maxVal = 0;

  data.forEach(entry => {
    const rKey = String(entry[rowKeyField] || 'Unknown');
    const cKey = String(entry[colKeyField] || 'Unknown');
    const val = Number(entry[valueField] || 0);

    rowKeys.add(rKey);
    colKeys.add(cKey);

    if (!matrix[rKey]) matrix[rKey] = {};
    if (!matrix[rKey][cKey] && matrix[rKey][cKey] !== 0) {
       matrix[rKey][cKey] = operation === 'min' ? Infinity : operation === 'max' ? -Infinity : 0;
    }
    
    if (!counts[rKey]) counts[rKey] = {};
    if (!counts[rKey][cKey]) counts[rKey][cKey] = 0;

    if (operation === 'sum') matrix[rKey][cKey] += val;
    else if (operation === 'count') matrix[rKey][cKey] += 1;
    else if (operation === 'max') matrix[rKey][cKey] = Math.max(matrix[rKey][cKey], val);
    else if (operation === 'min') matrix[rKey][cKey] = Math.min(matrix[rKey][cKey], val);
    else if (operation === 'avg') {
      matrix[rKey][cKey] += val;
      counts[rKey][cKey] += 1;
    }
  });

  const rows = Array.from(rowKeys).sort();
  const cols = Array.from(colKeys).sort();

  rows.forEach(r => {
    cols.forEach(c => {
      if (matrix[r] && matrix[r][c] !== undefined) {
        if (operation === 'avg') {
          matrix[r][c] = matrix[r][c] / counts[r][c];
        }
        if (matrix[r][c] === Infinity || matrix[r][c] === -Infinity) matrix[r][c] = 0;
        if (matrix[r][c] > maxVal) maxVal = matrix[r][c];
      }
    });
  });

  return { rows, cols, matrix, maxVal };
};

// Reusable Pivot Table Component
const PivotTableVisual: React.FC<{ 
  title: string, 
  icon: React.ReactNode, 
  data: any[], 
  config: { row: string, col: string, val: string, op: AggregationType },
  onConfigChange?: (key: string, val: string) => void
}> = ({ title, icon, data, config, onConfigChange }) => {
  const { rows, cols, matrix, maxVal } = useMemo(() => 
    calculatePivotData(data, config.row, config.col, config.val, config.op), 
  [data, config]);

  const getCellColor = (value: number, max: number) => {
    if (!value && value !== 0) return 'transparent';
    const intensity = max === 0 ? 0 : Math.min((Math.abs(value) / max) * 0.8 + 0.1, 0.9);
    const isNegative = value < 0;
    if (isNegative) return `rgba(239, 68, 68, ${intensity})`;
    return `rgba(99, 102, 241, ${intensity})`; 
  };

  const getTextColor = (value: number, max: number) => {
    if (!value && value !== 0) return '';
    return (max > 0 && (Math.abs(value) / max) > 0.5) ? 'text-white' : 'text-gray-900 dark:text-gray-100';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col print:h-auto print:block print:shadow-none print:border-gray-300 print:break-inside-avoid">
        <div className="flex justify-between items-start mb-4 print:mb-2">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {icon} {title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {config.op.toUpperCase()} of <span className="font-semibold text-indigo-600 dark:text-indigo-400">{config.val.replace(/_/g, ' ')}</span> by {config.row} & {config.col}
              </p>
            </div>
            {onConfigChange && (
               <div className="flex gap-2 print:hidden">
                  <select 
                    className="text-xs border rounded p-1 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none"
                    value={config.op}
                    onChange={(e) => onConfigChange('op', e.target.value)}
                  >
                    <option value="sum">Sum</option>
                    <option value="avg">Avg</option>
                    <option value="max">Max</option>
                    <option value="min">Min</option>
                    <option value="count">Count</option>
                  </select>
               </div>
            )}
        </div>

        <div className="overflow-auto flex-1 rounded-xl border border-gray-200 dark:border-gray-700 print:overflow-visible print:h-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold sticky top-0 z-10 print:static">
              <tr>
                <th className="p-3 border-b border-r border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 sticky left-0 z-20 min-w-[120px] print:static">
                  {config.row} \ {config.col}
                </th>
                {cols.map(col => (
                  <th key={col} className="p-3 border-b border-gray-200 dark:border-gray-600 text-right min-w-[80px]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {rows.map(row => (
                <tr key={row} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors print:break-inside-avoid">
                  <td className="p-3 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 sticky left-0 z-10 print:static">
                    {row}
                  </td>
                  {cols.map(col => {
                    const val = matrix[row]?.[col] || 0;
                    const bgStyle = getCellColor(val, maxVal);
                    const textClass = getTextColor(val, maxVal);
                    return (
                      <td 
                        key={col} 
                        className={`p-2 text-right font-medium transition-colors ${textClass} print:print-color-adjust-exact`}
                        style={{ backgroundColor: bgStyle }}
                      >
                        {val !== 0 ? val.toLocaleString(undefined, {maximumFractionDigits: 0}) : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );
};

// --- DATASETS FOR AD-HOC ANALYSIS ---
const CROSS_DEPT_METRICS = [
  { id: 'rev', name: 'Sales Revenue', dept: 'Sales', type: 'currency', data: [85000, 92000, 88000, 95000, 105000, 115000] },
  { id: 'cogs', name: 'Cost of Goods', dept: 'Inventory', type: 'currency', data: [45000, 48000, 46000, 50000, 55000, 58000] },
  { id: 'pay', name: 'Payroll Expense', dept: 'HR', type: 'currency', data: [25000, 25000, 26000, 26000, 28000, 28000] },
  { id: 'mar', name: 'Marketing Spend', dept: 'Sales', type: 'currency', data: [5000, 8000, 4000, 9000, 6000, 7000] },
  { id: 'inv', name: 'Inventory Value', dept: 'Inventory', type: 'currency', data: [120000, 115000, 130000, 125000, 110000, 105000] },
  { id: 'tax', name: 'Tax Liability', dept: 'Finance', type: 'currency', data: [12750, 13800, 13200, 14250, 15750, 17250] },
  { id: 'cash', name: 'Cash Flow', dept: 'Finance', type: 'currency', data: [15000, 8000, 18000, 5000, 20000, 25000] },
];

const IMPORT_CANDIDATES = [
  { id: 1, name: "Industrial Solvents (Barrels)", cost: 1200, price: 1800, margin: 0.5, demand: 500, category: "Chemicals" },
  { id: 2, name: "Giza Cotton Bales", cost: 18500, price: 24000, margin: 0.3, demand: 80, category: "Textiles" },
  { id: 3, name: "Weaving Machinery Parts", cost: 4500, price: 7200, margin: 0.6, demand: 40, category: "Machinery" }
];

const PERIODS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

const AccountingPortal: React.FC<AccountingPortalProps> = ({ data, onOpenAI, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'analysis' | 'compliance' | 'reports' | 'summary'>('dashboard');
  const [ledgerSearch, setLedgerSearch] = useState('');
  
  // Local state for ledger to allow adding new entries
  const [localLedger, setLocalLedger] = useState<LedgerEntry[]>(data.accountingData?.ledger || []);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<LedgerEntry>>({
    date: new Date().toISOString().split('T')[0],
    description: '',
    account: '',
    type: 'Debit',
    amount: 0,
    status: 'Pending'
  });

  // --- AD-HOC ANALYSIS STATES ---
  const [selectedMetricIds, setSelectedMetricIds] = useState<string[]>(['rev', 'cogs']);
  const [showForecast, setShowForecast] = useState(false);

  // 1. PRICE SENSITIVITY STATE
  const [priceSimInputs, setPriceSimInputs] = useState({
    baseCost: 1000,
    targetMargin: 20,
    taxRate: 15,
    elasticity: 1.5, // 1.5 means 1% price increase drops demand by 1.5%
    baseDemand: 500
  });

  // 2. MIX OPTIMIZATION STATE
  const [mixBudget, setMixBudget] = useState(1000000);

  // --- SUMMARY TABLE STATES ---
  type DatasetType = 'ledger' | 'budget' | 'inventory';
  const [activeDataset, setActiveDataset] = useState<DatasetType>('ledger');

  const [mainPivotConfig, setMainPivotConfig] = useState({
    row: 'account', col: 'status', val: 'amount', op: 'sum' as AggregationType
  });
  
  // Prepare ledger data for Pivot (ensure month exists for grouping)
  const ledgerForPivot = useMemo(() => {
    return localLedger.map(entry => ({
      ...entry,
      month: new Date(entry.date).toLocaleString('default', { month: 'short', year: '2-digit' })
    }));
  }, [localLedger]);

  // Determine current dataset array based on selection
  const currentDataset = useMemo(() => {
    switch(activeDataset) {
      case 'budget': return BUDGET_DATA;
      case 'inventory': return INVENTORY_DATA;
      case 'ledger': 
      default: return ledgerForPivot;
    }
  }, [activeDataset, ledgerForPivot]);

  // Determine available keys for the current dataset (for dropdowns)
  const availableKeys = useMemo(() => {
    if (currentDataset.length === 0) return [];
    return Object.keys(currentDataset[0]).filter(k => k !== 'id' && typeof currentDataset[0][k] !== 'object');
  }, [currentDataset]);

  // Reset pivot config when switching dataset to valid defaults
  useEffect(() => {
    if (activeDataset === 'ledger') {
      setMainPivotConfig({ row: 'account', col: 'month', val: 'amount', op: 'sum' });
    } else if (activeDataset === 'budget') {
      setMainPivotConfig({ row: 'dept', col: 'month', val: 'budget', op: 'sum' });
    } else if (activeDataset === 'inventory') {
      setMainPivotConfig({ row: 'category', col: 'location', val: 'total_value', op: 'sum' });
    }
  }, [activeDataset]);

  // Secondary Pivot States
  const [maxPivotConfig, setMaxPivotConfig] = useState({
    row: 'dept', col: 'category', val: 'amount', op: 'max' as AggregationType
  });

  const [avgPivotConfig, setAvgPivotConfig] = useState({
    row: 'dept', col: 'month', val: 'amount', op: 'avg' as AggregationType
  });


  // --- ETHIOPIAN TAX COMPLIANCE STATE ---
  const [taxInput, setTaxInput] = useState({
    amount: 5000,
    supplierCategory: 'VAT_Reg' as SupplierTaxCategory,
    transactionType: 'Goods' as TransactionType,
    supplierName: 'ABC Trading PLC',
    tinNumber: '0012345678'
  });
  const [taxResult, setTaxResult] = useState<TaxCalculationResult | null>(null);

  // Auto-calculate tax when inputs change
  useEffect(() => {
    calculateEthiopianTax();
  }, [taxInput]);

  const calculateEthiopianTax = () => {
    const { amount, supplierCategory, transactionType } = taxInput;
    let vatAmount = 0;
    let totAmount = 0;
    let whtAmount = 0;
    const baseAmount = Number(amount);
    const notes: string[] = [];

    // 1. VAT / TOT Logic
    if (supplierCategory === 'VAT_Reg') {
      vatAmount = baseAmount * 0.15;
      notes.push('VAT (15%) applied.');
    } else if (supplierCategory === 'TOT_Reg') {
      const totRate = transactionType === 'Goods' ? 0.02 : 0.10;
      totAmount = baseAmount * totRate;
      notes.push(`TOT (${totRate * 100}%) applied for ${transactionType}.`);
    }

    // 2. Withholding Tax Logic
    const isWhtApplicable = baseAmount >= 3000;
    if (isWhtApplicable) {
      const whtRate = transactionType === 'Goods' ? 0.02 : 0.05;
      whtAmount = baseAmount * whtRate;
      notes.push(`Withholding Tax (${whtRate * 100}%) deducted (Amount > 3,000 ETB).`);
    } else {
      notes.push('No Withholding Tax (Amount < 3,000 ETB).');
    }

    const netPayable = baseAmount + vatAmount + totAmount - whtAmount;

    setTaxResult({
      baseAmount,
      vatAmount,
      totAmount,
      whtAmount,
      netPayable,
      isWhtApplicable,
      notes
    });
  };

  // Updated Tooltip Style for Better Contrast
  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
    borderColor: isDarkMode ? '#374151' : '#e2e8f0',
    color: isDarkMode ? '#f3f4f6' : '#1f2937',
    borderRadius: '8px',
    border: '1px solid',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '8px 12px',
  };

  const itemStyle = {
    color: isDarkMode ? '#f3f4f6' : '#1f2937',
  };

  const accountingData = data.accountingData;
  
  // Use localLedger instead of props data for filtering
  const filteredLedger = localLedger.filter(entry => 
    entry.description.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
    entry.account.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
    entry.id.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: LedgerEntry = {
      id: `JE-${Math.floor(1000 + Math.random() * 9000)}`, // Generate random 4-digit ID
      date: newEntry.date || '',
      description: newEntry.description || '',
      account: newEntry.account || '',
      type: newEntry.type as 'Debit' | 'Credit',
      amount: Number(newEntry.amount),
      status: newEntry.status as 'Posted' | 'Pending' | 'Flagged'
    };

    setLocalLedger([entry, ...localLedger]);
    setIsEntryModalOpen(false);
    // Reset form
    setNewEntry({
      date: new Date().toISOString().split('T')[0],
      description: '',
      account: '',
      type: 'Debit',
      amount: 0,
      status: 'Pending'
    });
  };

  // Mock Data for Aging Analysis
  const agingData = [
    { range: '0-30 Days', Receivables: 45000, Payables: 32000 },
    { range: '31-60 Days', Receivables: 28000, Payables: 15000 },
    { range: '61-90 Days', Receivables: 12000, Payables: 8000 },
    { range: '90+ Days', Receivables: 5000, Payables: 2000 },
  ];

  // Mock Data for Margins
  const marginData = [
    { name: 'Gross Margin', value: 42, color: '#10b981' },
    { name: 'Op. Margin', value: 18, color: '#3b82f6' },
    { name: 'Net Margin', value: 12, color: '#6366f1' },
  ];

  // --- AD-HOC LOGIC HELPERS ---
  const toggleMetric = (id: string) => {
    if (selectedMetricIds.includes(id)) {
      setSelectedMetricIds(prev => prev.filter(m => m !== id));
    } else {
      setSelectedMetricIds(prev => [...prev, id]);
    }
  };

  const chartData = useMemo(() => {
    const base = PERIODS.map((p, i) => {
      const point: any = { name: p };
      selectedMetricIds.forEach(mId => {
        const metric = CROSS_DEPT_METRICS.find(m => m.id === mId);
        if (metric) point[metric.name] = metric.data[i];
      });
      return point;
    });

    if (showForecast) {
      // Simple linear regression forecast for next 3 periods
      const nextPeriods = ['Jul', 'Aug', 'Sep'];
      const forecastPoints = nextPeriods.map((p, i) => {
        const point: any = { name: p, isForecast: true };
        selectedMetricIds.forEach(mId => {
          const metric = CROSS_DEPT_METRICS.find(m => m.id === mId);
          if (metric) {
            const values = metric.data;
            const n = values.length;
            const sumX = values.reduce((acc, _, idx) => acc + idx, 0);
            const sumY = values.reduce((acc, val) => acc + val, 0);
            const sumXY = values.reduce((acc, val, idx) => acc + (idx * val), 0);
            const sumX2 = values.reduce((acc, _, idx) => acc + (idx * idx), 0);
            
            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            
            const nextIndex = n + i;
            point[metric.name] = Math.round(slope * nextIndex + intercept);
          }
        });
        return point;
      });
      return [...base, ...forecastPoints];
    }
    return base;
  }, [selectedMetricIds, showForecast]);

  const stats = useMemo(() => {
    if (selectedMetricIds.length === 0) return null;
    
    // Aggregate all selected data into a single array for basic stats
    const allValues: number[] = [];
    selectedMetricIds.forEach(id => {
      const m = CROSS_DEPT_METRICS.find(m => m.id === id);
      if (m) allValues.push(...m.data);
    });

    const sum = allValues.reduce((a, b) => a + b, 0);
    const avg = sum / allValues.length;
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    
    // Volatility (Std Dev)
    const squareDiffs = allValues.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);

    return { sum, avg, min, max, stdDev };
  }, [selectedMetricIds]);

  // Accounting Specifics (Mock calculations based on selected 'rev' and 'cogs' if available, else defaults)
  const accountingRatios = useMemo(() => {
    const revMetric = CROSS_DEPT_METRICS.find(m => m.id === 'rev');
    const cogsMetric = CROSS_DEPT_METRICS.find(m => m.id === 'cogs');
    const opExpMetric = CROSS_DEPT_METRICS.find(m => m.id === 'pay') || {data: [20000, 20000, 20000, 20000, 20000, 20000]}; // Fallback

    // Using most recent month (last index)
    const idx = 5; 
    const revenue = revMetric?.data[idx] || 100000;
    const cogs = cogsMetric?.data[idx] || 50000;
    const opex = opExpMetric.data[idx];

    const grossProfit = revenue - cogs;
    const grossMargin = (grossProfit / revenue) * 100;
    const netProfit = grossProfit - opex;
    const netMargin = (netProfit / revenue) * 100;
    const opRatio = ((cogs + opex) / revenue) * 100;

    return { grossMargin, netMargin, opRatio, netProfit };
  }, []);

  // --- NEW SIMULATION CALCULATIONS ---
  const priceSimulationData = useMemo(() => {
    const { baseCost, taxRate, elasticity, baseDemand } = priceSimInputs;
    const dataPoints = [];
    
    // Simulate from 5% margin to 50% margin
    for (let m = 5; m <= 50; m += 5) {
       const taxMultiplier = 1 + (taxRate / 100);
       const price = baseCost * (1 + m / 100) * taxMultiplier;
       
       // Calculate new demand based on price elasticity
       // Base Scenario: 20% margin is the baseline
       const baselinePrice = baseCost * 1.2 * taxMultiplier;
       const priceChangePct = (price - baselinePrice) / baselinePrice;
       const demandChangePct = priceChangePct * elasticity * -1;
       const projectedDemand = Math.max(0, baseDemand * (1 + demandChangePct));
       
       // Profit Calc: (Price w/o Tax - Cost) * Demand
       // Note: Tax is passthrough, usually doesn't affect profit per unit directly, but affects price which affects demand
       const revenue = (price / taxMultiplier) * projectedDemand; // Net Sales
       const costTotal = baseCost * projectedDemand;
       const profit = revenue - costTotal;

       dataPoints.push({
          margin: m,
          price: Math.round(price),
          demand: Math.round(projectedDemand),
          revenue: Math.round(revenue),
          profit: Math.round(profit)
       });
    }
    return dataPoints;
  }, [priceSimInputs]);

  const mixSimulationData = useMemo(() => {
     // 3 Strategies: Volume (Low Cost), Margin (High Margin), Balanced
     const strategies = [
        { name: 'Volume First', key: 'volume', color: '#3b82f6' },
        { name: 'Profit First', key: 'profit', color: '#10b981' },
        { name: 'Balanced', key: 'balanced', color: '#f59e0b' }
     ];

     const results = strategies.map(strat => {
        let remainingBudget = mixBudget;
        let totalRevenue = 0;
        let totalProfit = 0;
        let totalUnits = 0;
        const mix: Record<string, number> = {};

        // Sort candidates based on strategy
        const sortedCandidates = [...IMPORT_CANDIDATES].sort((a, b) => {
           if (strat.key === 'volume') return a.cost - b.cost; // Cheapest first
           if (strat.key === 'profit') return b.margin - a.margin; // Highest margin first
           return 0; // No sort for balanced (round robin)
        });

        if (strat.key === 'balanced') {
           // Allocate 1/3 budget to each (simplification)
           const splitBudget = mixBudget / IMPORT_CANDIDATES.length;
           IMPORT_CANDIDATES.forEach(prod => {
              const qty = Math.floor(splitBudget / prod.cost);
              const cost = qty * prod.cost;
              const rev = qty * prod.price;
              const profit = rev - cost; // Simple gross profit
              totalRevenue += rev;
              totalProfit += profit;
              totalUnits += qty;
              mix[prod.name] = qty;
           });
        } else {
           // Fill bucket
           sortedCandidates.forEach(prod => {
              const maxAffordable = Math.floor(remainingBudget / prod.cost);
              // Cap at mock demand or budget
              const qty = Math.min(maxAffordable, prod.demand); 
              
              const cost = qty * prod.cost;
              remainingBudget -= cost;
              
              const rev = qty * prod.price;
              const profit = rev - cost;
              
              totalRevenue += rev;
              totalProfit += profit;
              totalUnits += qty;
              mix[prod.name] = qty;
           });
        }

        return {
           name: strat.name,
           key: strat.key,
           Revenue: totalRevenue,
           Profit: totalProfit,
           Units: totalUnits,
           color: strat.color,
           mix
        };
     });

     return results;
  }, [mixBudget]);

  const chartColors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-6">
      
      {/* Navigation Tabs */}
      <div className="flex justify-between items-center overflow-x-auto pb-2 md:pb-0">
        <div className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-xl w-fit border border-gray-100 dark:border-gray-700 whitespace-nowrap">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <PieIcon className="w-4 h-4" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'ledger' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <FileText className="w-4 h-4" /> General Ledger
          </button>
          <button 
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'summary' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <Table className="w-4 h-4" /> Summary Tables
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'analysis' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <Calculator className="w-4 h-4" /> Ad-hoc Analysis
          </button>
          <button 
            onClick={() => setActiveTab('compliance')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'compliance' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <Stamp className="w-4 h-4" /> Tax Compliance (ERCA)
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${activeTab === 'reports' ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 shadow-sm' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'}`}
          >
            <FileBarChart className="w-4 h-4" /> Report Builder
          </button>
        </div>
        <button 
          onClick={onOpenAI}
          className="ml-4 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm flex items-center gap-2 shadow-sm shadow-cyan-200 dark:shadow-none whitespace-nowrap"
        >
          <GraduationCap className="w-4 h-4 opacity-90" />
          Ask Prof. Fad
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.kpis.map((kpi, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                 <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</p>
                 <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</h3>
                 </div>
                 <span className={`text-xs font-semibold ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                    {kpi.trend === 'up' ? '▲' : '▼'} {kpi.change}
                 </span>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Payables vs Receivables */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Cash Flow Velocity</h3>
               <div className="h-72">
                 <ResponsiveContainer width="100%" height="100%">
                   <AreaChart data={data.mainChartData}>
                     <defs>
                       <linearGradient id="colorPay" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                       </linearGradient>
                       <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                       </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                     <RechartsTooltip 
                        contentStyle={tooltipStyle}
                        itemStyle={itemStyle} 
                     />
                     <Legend />
                     <Area type="monotone" dataKey="Payables" stroke="#ef4444" fillOpacity={1} fill="url(#colorPay)" />
                     <Area type="monotone" dataKey="Receivables" stroke="#06b6d4" fillOpacity={1} fill="url(#colorRec)" />
                   </AreaChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Upcoming Taxes */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tax Liability Schedule</h3>
              <div className="space-y-4">
                {accountingData?.upcomingTax.map((tax, i) => (
                   <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                      <div>
                         <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{tax.name}</p>
                         <p className="text-xs text-gray-500">Due: {tax.dueDate}</p>
                      </div>
                      <div className="text-right">
                         <p className="font-bold text-gray-900 dark:text-white">Bir {tax.amount.toLocaleString()}</p>
                         <span className="text-xs text-orange-500 font-medium">Pending</span>
                      </div>
                   </div>
                ))}
              </div>
              <button 
                onClick={() => setActiveTab('compliance')}
                className="w-full mt-6 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                 View Tax Calendar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Aging Analysis */}
             <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <Layers className="w-5 h-5 text-purple-500" /> Aging Analysis (AR/AP)
                   </h3>
                </div>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={agingData}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                         <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                         <RechartsTooltip 
                            contentStyle={tooltipStyle}
                            itemStyle={itemStyle} 
                         />
                         <Legend />
                         <Bar dataKey="Receivables" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                         <Bar dataKey="Payables" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>

             {/* Profitability Decomposition */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Profitability Margins</h3>
                <div className="space-y-6">
                   {marginData.map((margin, idx) => (
                      <div key={idx} className="relative pt-1">
                         <div className="flex mb-2 items-center justify-between">
                            <div>
                               <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                  {margin.name}
                               </span>
                            </div>
                            <div className="text-right">
                               <span className="text-sm font-bold inline-block text-gray-900 dark:text-white">
                                  {margin.value}%
                               </span>
                            </div>
                         </div>
                         <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                            <div style={{ width: `${margin.value}%`, backgroundColor: margin.color }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500"></div>
                         </div>
                      </div>
                   ))}
                </div>
                <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-start gap-2">
                   <Activity className="w-4 h-4 text-indigo-600 mt-1" />
                   <p className="text-xs text-indigo-800 dark:text-indigo-300">Net margin is slightly below industry avg (14%). Review OPEX efficiency.</p>
                </div>
             </div>
          </div>
        </>
      )}

      {/* Summary Tables Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Grid3X3 className="w-6 h-6 text-indigo-600" /> Comparative Pivot Tables
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Dynamic multi-dimensional analysis with value heatmapping.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex items-center text-xs gap-1">
               <span className="px-2 font-semibold text-gray-500 dark:text-gray-400">Datasets:</span>
               
               <button 
                 onClick={() => setActiveDataset('ledger')}
                 className={`px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1.5 transition-all ${
                   activeDataset === 'ledger' 
                     ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 font-bold ring-1 ring-black/5 dark:ring-white/10' 
                     : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                 }`}
               >
                 <FileText className="w-3 h-3" /> Ledger
               </button>

               <button 
                 onClick={() => setActiveDataset('budget')}
                 className={`px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1.5 transition-all ${
                   activeDataset === 'budget' 
                     ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 font-bold ring-1 ring-black/5 dark:ring-white/10' 
                     : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                 }`}
               >
                 <Landmark className="w-3 h-3" /> Budget
               </button>

               <button 
                 onClick={() => setActiveDataset('inventory')}
                 className={`px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1.5 transition-all ${
                   activeDataset === 'inventory' 
                     ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 font-bold ring-1 ring-black/5 dark:ring-white/10' 
                     : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                 }`}
               >
                 <Package className="w-3 h-3" /> Inventory
               </button>
            </div>
          </div>

          {/* Main Configurable Pivot */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[500px] flex flex-col print:h-auto print:block">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <h4 className="font-bold text-gray-700 dark:text-gray-200 capitalize">
                {activeDataset} Analysis
              </h4>
              {/* Controls */}
              <div className="flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl border border-gray-200 dark:border-gray-700 print:hidden">
                <select 
                  value={mainPivotConfig.row}
                  onChange={(e) => setMainPivotConfig({...mainPivotConfig, row: e.target.value})}
                  className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none capitalize"
                >
                  {availableKeys.map(key => <option key={key} value={key}>Row: {key.replace(/_/g, ' ')}</option>)}
                </select>
                
                <span className="text-gray-300 dark:text-gray-600 self-center">×</span>

                <select 
                  value={mainPivotConfig.col}
                  onChange={(e) => setMainPivotConfig({...mainPivotConfig, col: e.target.value})}
                  className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none capitalize"
                >
                  {availableKeys.map(key => <option key={key} value={key}>Col: {key.replace(/_/g, ' ')}</option>)}
                </select>

                <span className="text-gray-300 dark:text-gray-600 self-center">=</span>

                <select 
                  value={mainPivotConfig.val}
                  onChange={(e) => setMainPivotConfig({...mainPivotConfig, val: e.target.value})}
                  className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none capitalize"
                >
                  {availableKeys.filter(k => typeof currentDataset[0]?.[k] === 'number').map(key => (
                    <option key={key} value={key}>Val: {key.replace(/_/g, ' ')}</option>
                  ))}
                </select>

                <select 
                  value={mainPivotConfig.op}
                  onChange={(e) => setMainPivotConfig({...mainPivotConfig, op: e.target.value as any})}
                  className="px-2 py-1 text-xs rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none font-bold text-indigo-600"
                >
                  <option value="sum">Sum</option>
                  <option value="count">Count</option>
                  <option value="avg">Avg</option>
                  <option value="max">Max</option>
                  <option value="min">Min</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-hidden print:overflow-visible print:h-auto">
               <PivotTableVisual 
                  title={`${activeDataset.charAt(0).toUpperCase() + activeDataset.slice(1)} Pivot`} 
                  icon={<FileText className="w-4 h-4" />} 
                  data={currentDataset} 
                  config={mainPivotConfig}
               />
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-8 relative">
             <span className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 dark:bg-gray-900 px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                Advanced Statistical Analysis (Cross-Department)
             </span>
          </div>

          {/* Secondary Pivots Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px] print:block print:h-auto print:space-y-8">
             
             {/* Pivot 2: Max Values (Peak Analysis) */}
             <PivotTableVisual 
                title="Peak Expenditure Analysis" 
                icon={<Maximize2 className="w-4 h-4 text-red-500" />} 
                data={CROSS_DEPT_DATA} 
                config={maxPivotConfig}
                onConfigChange={(k, v) => setMaxPivotConfig({...maxPivotConfig, [k]: v})}
             />

             {/* Pivot 3: Average Values (Efficiency) */}
             <PivotTableVisual 
                title="Average Monthly Burn Rate" 
                icon={<Divide className="w-4 h-4 text-emerald-500" />} 
                data={CROSS_DEPT_DATA} 
                config={avgPivotConfig}
                onConfigChange={(k, v) => setAvgPivotConfig({...avgPivotConfig, [k]: v})}
             />

          </div>
        </div>
      )}

      {activeTab === 'compliance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tax Engine Input */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-emerald-600" /> Ethiopian Tax Engine
               </h3>
               
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Transaction Amount (ETB)</label>
                        <input 
                           type="number" 
                           value={taxInput.amount} 
                           onChange={e => setTaxInput({...taxInput, amount: Number(e.target.value)})} 
                           className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Transaction Type</label>
                        <select 
                           value={taxInput.transactionType} 
                           onChange={e => setTaxInput({...taxInput, transactionType: e.target.value as TransactionType})}
                           className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        >
                           <option value="Goods">Goods (2% WHT)</option>
                           <option value="Services">Services (5% WHT)</option>
                        </select>
                     </div>
                  </div>

                  <div>
                     <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Supplier Tax Category</label>
                     <div className="flex gap-2">
                        {['VAT_Reg', 'TOT_Reg', 'None'].map((cat) => (
                           <button
                              key={cat}
                              onClick={() => setTaxInput({...taxInput, supplierCategory: cat as SupplierTaxCategory})}
                              className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-colors ${
                                 taxInput.supplierCategory === cat 
                                 ? 'bg-emerald-100 border-emerald-500 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                 : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                              }`}
                           >
                              {cat === 'VAT_Reg' ? 'VAT Registered' : cat === 'TOT_Reg' ? 'TOT Registered' : 'Unregistered'}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="h-px bg-gray-100 dark:bg-gray-700 my-4"></div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Supplier Name</label>
                        <input 
                           type="text" 
                           value={taxInput.supplierName} 
                           onChange={e => setTaxInput({...taxInput, supplierName: e.target.value})}
                           className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">TIN Number</label>
                        <input 
                           type="text" 
                           value={taxInput.tinNumber} 
                           onChange={e => setTaxInput({...taxInput, tinNumber: e.target.value})}
                           className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                        />
                     </div>
                  </div>
               </div>
            </div>

            {/* Breakdown Card */}
            {taxResult && (
               <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-4">Calculated Breakdown</h4>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Taxable Amount</span>
                        <span className="font-medium text-gray-900 dark:text-white">{taxResult.baseAmount.toLocaleString()} ETB</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">
                           {taxInput.supplierCategory === 'VAT_Reg' ? 'VAT (15%)' : 'TOT (2%/10%)'}
                        </span>
                        <span className="font-medium text-blue-600">
                           + {(taxResult.vatAmount || taxResult.totAmount).toLocaleString()} ETB
                        </span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Withholding Tax</span>
                        <span className={`font-medium ${taxResult.whtAmount > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                           - {taxResult.whtAmount.toLocaleString()} ETB
                        </span>
                     </div>
                     <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between items-center">
                        <span className="font-bold text-gray-900 dark:text-white">Net Payment</span>
                        <span className="text-xl font-bold text-emerald-600">{taxResult.netPayable.toLocaleString()} ETB</span>
                     </div>
                  </div>
                  <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-xs text-gray-500 space-y-1">
                     {taxResult.notes.map((note, idx) => (
                        <p key={idx} className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-emerald-500" /> {note}</p>
                     ))}
                  </div>
               </div>
            )}
          </div>

          {/* Right Column: Documents & Reports */}
          <div className="space-y-6">
             
             {/* WHT Letter Preview */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileCheck className="w-5 h-5 text-indigo-600" /> Withholding Receipt
                   </h3>
                   <button 
                     onClick={() => window.print()}
                     disabled={!taxResult?.isWhtApplicable}
                     className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2 disabled:opacity-50"
                   >
                      <Printer className="w-3 h-3" /> Print
                   </button>
                </div>

                {taxResult?.isWhtApplicable ? (
                   <div className="border border-gray-200 dark:border-gray-600 p-6 rounded-sm bg-white text-black font-serif text-sm relative overflow-hidden">
                      {/* Watermark */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-100 text-6xl font-bold -rotate-45 pointer-events-none">
                         COPY
                      </div>
                      
                      <div className="text-center border-b border-gray-300 pb-4 mb-4">
                         <h2 className="font-bold text-lg uppercase">Official Withholding Tax Receipt</h2>
                         <p className="text-xs text-gray-500">Federal Democratic Republic of Ethiopia</p>
                         <p className="text-xs text-gray-500">Ministry of Revenues</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                         <div>
                            <p className="text-[10px] text-gray-500 uppercase">Withholding Agent</p>
                            <p className="font-bold">GlobalTrade Logistics Inc.</p>
                            <p className="text-xs">TIN: 0098765432</p>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] text-gray-500 uppercase">Receipt No</p>
                            <p className="font-bold text-red-600">WH-{Math.floor(Math.random()*10000)}</p>
                            <p className="text-xs">Date: {new Date().toLocaleDateString()}</p>
                         </div>
                      </div>

                      <div className="mb-4">
                         <p className="text-[10px] text-gray-500 uppercase">Supplier Details</p>
                         <p className="font-bold">{taxInput.supplierName}</p>
                         <p className="text-xs">TIN: {taxInput.tinNumber}</p>
                      </div>

                      <table className="w-full border-collapse border border-gray-300 text-xs mb-6">
                         <thead>
                            <tr className="bg-gray-100">
                               <th className="border border-gray-300 p-2 text-left">Description</th>
                               <th className="border border-gray-300 p-2 text-right">Amount</th>
                            </tr>
                         </thead>
                         <tbody>
                            <tr>
                               <td className="border border-gray-300 p-2">Gross Payment Amount</td>
                               <td className="border border-gray-300 p-2 text-right">{taxResult.baseAmount.toLocaleString()}</td>
                            </tr>
                            <tr>
                               <td className="border border-gray-300 p-2">Taxable Amount</td>
                               <td className="border border-gray-300 p-2 text-right">{taxResult.baseAmount.toLocaleString()}</td>
                            </tr>
                            <tr>
                               <td className="border border-gray-300 p-2 font-bold">Withholding Tax ({taxInput.transactionType === 'Goods' ? '2%' : '5%'})</td>
                               <td className="border border-gray-300 p-2 text-right font-bold">{taxResult.whtAmount.toLocaleString()}</td>
                            </tr>
                         </tbody>
                      </table>

                      <div className="flex justify-between items-end mt-8">
                         <div className="text-center">
                            <div className="border-b border-black w-32 mb-1"></div>
                            <p className="text-[10px]">Prepared By</p>
                         </div>
                         <div className="text-center">
                            <div className="border-b border-black w-32 mb-1"></div>
                            <p className="text-[10px]">Approved By</p>
                         </div>
                      </div>
                   </div>
                ) : (
                   <div className="h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
                      <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                      <p>No Withholding Tax applicable for this transaction.</p>
                      <p className="text-xs opacity-75">Amount must be &ge; 3,000 ETB</p>
                   </div>
                )}
             </div>

             {/* ERCA Reporting Table */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white">Monthly Declaration (ERCA)</h3>
                   <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Period: Oct 2024</span>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-xs text-left">
                      <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                         <tr>
                            <th className="p-2 rounded-tl-lg">Description</th>
                            <th className="p-2 text-right">Taxable Value</th>
                            <th className="p-2 text-right rounded-tr-lg">VAT/Tax</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                         <tr>
                            <td className="p-2">Standard Rated Sales</td>
                            <td className="p-2 text-right font-mono">1,250,000</td>
                            <td className="p-2 text-right font-mono">187,500</td>
                         </tr>
                         <tr>
                            <td className="p-2">Zero Rated / Exempt</td>
                            <td className="p-2 text-right font-mono">450,000</td>
                            <td className="p-2 text-right font-mono">0</td>
                         </tr>
                         <tr className="bg-gray-5 dark:bg-gray-900/30 font-bold">
                            <td className="p-2">Total Output VAT (A)</td>
                            <td className="p-2 text-right"></td>
                            <td className="p-2 text-right text-red-500">187,500</td>
                         </tr>
                         <tr>
                            <td className="p-2">Domestic Purchases</td>
                            <td className="p-2 text-right font-mono">820,000</td>
                            <td className="p-2 text-right font-mono">123,000</td>
                         </tr>
                         <tr>
                            <td className="p-2">Import VAT Paid</td>
                            <td className="p-2 text-right font-mono">--</td>
                            <td className="p-2 text-right font-mono">45,000</td>
                         </tr>
                         <tr className="bg-gray-50 dark:bg-gray-900/30 font-bold">
                            <td className="p-2">Total Input VAT (B)</td>
                            <td className="p-2 text-right"></td>
                            <td className="p-2 text-right text-green-500">168,000</td>
                         </tr>
                         <tr className="border-t-2 border-gray-200 dark:border-gray-600 font-extrabold text-sm">
                            <td className="p-2">Net VAT Payable (A-B)</td>
                            <td className="p-2 text-right"></td>
                            <td className="p-2 text-right text-indigo-600">19,500</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>

          </div>
        </div>
      )}

      {activeTab === 'ledger' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">General Ledger</h3>
                <button onClick={() => setIsEntryModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-bold hover:bg-cyan-700 transition-colors">
                    <Plus className="w-4 h-4" /> Add Entry
                </button>
            </div>
            {/* Table for filteredLedger */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Account</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {filteredLedger.map((entry) => (
                            <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <td className="px-6 py-4">{entry.date}</td>
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{entry.description}</td>
                                <td className="px-6 py-4 text-gray-500">{entry.account}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${entry.type === 'Credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{entry.type}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-mono">Bir {entry.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-xs">{entry.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}

      {activeTab === 'analysis' && (
          <div className="space-y-6">
             {/* 1. SELECTION BAR */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                   <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                         <BarChart2 className="w-6 h-6 text-indigo-600" /> Multi-Variable Ad-hoc Analysis
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Select metrics across departments to correlate trends and performance.</p>
                   </div>
                   <button 
                      onClick={() => setShowForecast(!showForecast)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${showForecast ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                   >
                      <Target className="w-4 h-4" /> {showForecast ? 'Hide Forecast' : 'Project Future (Linear)'}
                   </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                   {CROSS_DEPT_METRICS.map(metric => {
                      const isSelected = selectedMetricIds.includes(metric.id);
                      return (
                         <button
                            key={metric.id}
                            onClick={() => toggleMetric(metric.id)}
                            className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all flex items-center gap-2 ${
                               isSelected 
                               ? 'bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' 
                               : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-900/50 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                         >
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}
                            {metric.name} <span className="opacity-50 text-[10px] uppercase">({metric.dept})</span>
                         </button>
                      );
                   })}
                </div>
             </div>

             {/* 2. MAIN VISUALIZATION */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[400px]">
                   <h4 className="font-bold text-gray-900 dark:text-white mb-4">Trend Visualization</h4>
                   <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                         <XAxis dataKey="name" tick={{fontSize: 12}} />
                         <YAxis tick={{fontSize: 12}} />
                         <RechartsTooltip 
                            contentStyle={tooltipStyle}
                            itemStyle={itemStyle} 
                         />
                         <Legend />
                         {selectedMetricIds.map((id, index) => {
                            const metric = CROSS_DEPT_METRICS.find(m => m.id === id);
                            const color = chartColors[index % chartColors.length];
                            if (!metric) return null;
                            // Use Bar for single selection, Lines for comparison
                            if (selectedMetricIds.length === 1 && !showForecast) {
                               return <Bar key={id} dataKey={metric.name} fill={color} radius={[4,4,0,0]} />;
                            }
                            return <Line key={id} type="monotone" dataKey={metric.name} stroke={color} strokeWidth={3} dot={{r:4}} strokeDasharray={showForecast ? undefined : undefined} />;
                         })}
                      </ComposedChart>
                   </ResponsiveContainer>
                </div>

                {/* 3. STATISTICAL SUMMARY CARDS */}
                <div className="space-y-4">
                   {stats && (
                      <>
                         <div className="bg-indigo-600 text-white p-5 rounded-2xl shadow-lg">
                            <p className="text-indigo-200 text-xs font-bold uppercase mb-1">Aggregated Value (Sum)</p>
                            <h3 className="text-3xl font-bold">Bir {stats.sum.toLocaleString()}</h3>
                            <div className="mt-4 flex gap-4 text-xs">
                               <div>
                                  <span className="block opacity-70">Min</span>
                                  <span className="font-bold">{stats.min.toLocaleString()}</span>
                               </div>
                               <div>
                                  <span className="block opacity-70">Max</span>
                                  <span className="font-bold">{stats.max.toLocaleString()}</span>
                               </div>
                            </div>
                         </div>
                         
                         <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div>
                               <p className="text-gray-500 text-xs font-bold uppercase">Average (Mean)</p>
                               <p className="text-xl font-bold text-gray-900 dark:text-white">Bir {Math.round(stats.avg).toLocaleString()}</p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                               <Divide className="w-5 h-5 text-blue-600" />
                            </div>
                         </div>

                         <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <div>
                               <p className="text-gray-500 text-xs font-bold uppercase">Volatility (StdDev)</p>
                               <p className="text-xl font-bold text-gray-900 dark:text-white">± {Math.round(stats.stdDev).toLocaleString()}</p>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                               <Sigma className="w-5 h-5 text-purple-600" />
                            </div>
                         </div>
                      </>
                   )}
                   {!stats && (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                         <GitCommit className="w-8 h-8 mb-2" />
                         <p className="text-sm">Select metrics to analyze</p>
                      </div>
                   )}
                </div>
             </div>

             {/* 4. ACCOUNTING SPECIFIC METRICS */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                   <div className="flex justify-between items-start mb-2">
                      <p className="text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase">Gross Margin</p>
                      <Activity className="w-4 h-4 text-emerald-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{accountingRatios.grossMargin.toFixed(1)}%</h3>
                   <p className="text-xs text-emerald-600 mt-1">Revenue vs COGS</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
                   <div className="flex justify-between items-start mb-2">
                      <p className="text-blue-700 dark:text-blue-300 text-xs font-bold uppercase">Net Profit Margin</p>
                      <Zap className="w-4 h-4 text-blue-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">{accountingRatios.netMargin.toFixed(1)}%</h3>
                   <p className="text-xs text-blue-600 mt-1">After Op. Expenses</p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-5 rounded-2xl border border-orange-100 dark:border-orange-800">
                   <div className="flex justify-between items-start mb-2">
                      <p className="text-orange-700 dark:text-orange-300 text-xs font-bold uppercase">Operating Ratio</p>
                      <Scale className="w-4 h-4 text-orange-600" />
                   </div>
                   <h3 className="text-2xl font-bold text-orange-900 dark:text-orange-100">{accountingRatios.opRatio.toFixed(1)}%</h3>
                   <p className="text-xs text-orange-600 mt-1">Op. Expenses / Revenue</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700">
                   <div className="flex justify-between items-start mb-2">
                      <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase">Net Profit Value</p>
                      <DollarSign className="w-4 h-4 text-gray-400" />
                   </div>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Bir {accountingRatios.netProfit.toLocaleString()}</h3>
                   <p className="text-xs text-gray-500 mt-1">Latest Period</p>
                </div>
             </div>

             {/* 5. PRICE SENSITIVITY & PROFIT SIMULATOR */}
             <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-4">
                <div className="flex items-center gap-2 mb-6">
                   <TrendingUp className="w-6 h-6 text-indigo-600" />
                   <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Price Sensitivity & Profit Simulator</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Simulate how tax burdens and profit margins affect final price and projected demand.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
                      <h4 className="font-bold text-gray-800 dark:text-white mb-2">Simulation Parameters</h4>
                      <div>
                         <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Base Product Cost</label>
                         <input type="number" value={priceSimInputs.baseCost} onChange={e => setPriceSimInputs({...priceSimInputs, baseCost: Number(e.target.value)})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-gray-900 dark:text-white" />
                      </div>
                      <div>
                         <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex justify-between">
                            <span>Tax Burden (VAT/Duty)</span>
                            <span className="text-indigo-600 font-bold">{priceSimInputs.taxRate}%</span>
                         </label>
                         <input type="range" min="0" max="50" value={priceSimInputs.taxRate} onChange={e => setPriceSimInputs({...priceSimInputs, taxRate: Number(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                      </div>
                      <div>
                         <label className="block text-xs font-semibold text-gray-500 uppercase mb-1 flex justify-between">
                            <span>Target Profit Margin</span>
                            <span className="text-indigo-600 font-bold">{priceSimInputs.targetMargin}%</span>
                         </label>
                         <input type="range" min="5" max="50" value={priceSimInputs.targetMargin} onChange={e => setPriceSimInputs({...priceSimInputs, targetMargin: Number(e.target.value)})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                      </div>
                      <div>
                         <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Market Elasticity (Price Sensitivity)</label>
                         <select value={priceSimInputs.elasticity} onChange={e => setPriceSimInputs({...priceSimInputs, elasticity: Number(e.target.value)})} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg outline-none text-gray-900 dark:text-white text-sm">
                            <option value="0.5">Low (Inelastic Demand)</option>
                            <option value="1.0">Medium (Unitary)</option>
                            <option value="1.5">High (Elastic Demand)</option>
                            <option value="2.0">Very High (Luxury Goods)</option>
                         </select>
                      </div>
                   </div>

                   <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                      <h4 className="font-bold text-gray-800 dark:text-white mb-4">Projected Outcomes vs Margin %</h4>
                      <div className="flex-1 h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={priceSimulationData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                               <XAxis dataKey="margin" label={{ value: 'Margin %', position: 'insideBottom', offset: -5 }} />
                               <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
                               <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
                               <RechartsTooltip contentStyle={tooltipStyle} itemStyle={itemStyle} />
                               <Legend />
                               <Area yAxisId="left" type="monotone" dataKey="revenue" fill="#82ca9d" stroke="#82ca9d" fillOpacity={0.3} name="Total Revenue" />
                               <Line yAxisId="right" type="monotone" dataKey="profit" stroke="#8884d8" strokeWidth={3} name="Projected Profit" />
                               <Scatter yAxisId="right" dataKey="profit" fill="red" />
                            </ComposedChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4">
                         <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-500 uppercase">Final Unit Price</p>
                            <p className="font-bold text-gray-900 dark:text-white">
                               Bir {Math.round(priceSimInputs.baseCost * (1 + priceSimInputs.targetMargin/100) * (1 + priceSimInputs.taxRate/100)).toLocaleString()}
                            </p>
                         </div>
                         <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-500 uppercase">Est. Demand (Units)</p>
                            <p className="font-bold text-blue-600">
                               {Math.round(priceSimInputs.baseDemand * (1 - (priceSimInputs.elasticity * ((priceSimInputs.targetMargin - 20)/100))))}
                            </p>
                         </div>
                         <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg text-center">
                            <p className="text-xs text-gray-500 uppercase">Profit Multiplier</p>
                            <p className="font-bold text-green-600">
                               {priceSimInputs.targetMargin}%
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* 6. IMPORT PRODUCT MIX OPTIMIZER */}
             <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-4">
                <div className="flex items-center gap-2 mb-6">
                   <Coins className="w-6 h-6 text-emerald-600" />
                   <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Import Product Mix Optimizer</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Determine the optimal product combination to maximize returns given a limited budget.</p>
                   </div>
                </div>

                <div className="bg-emerald-900 text-white p-6 rounded-2xl shadow-lg mb-8">
                   <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex-1 w-full">
                         <label className="text-emerald-200 text-xs font-bold uppercase tracking-wider mb-2 block">Total Import Budget</label>
                         <div className="flex items-center gap-4">
                            <input 
                               type="range" 
                               min="100000" 
                               max="5000000" 
                               step="50000" 
                               value={mixBudget} 
                               onChange={(e) => setMixBudget(Number(e.target.value))} 
                               className="w-full h-3 bg-emerald-700 rounded-lg appearance-none cursor-pointer accent-white" 
                            />
                            <span className="font-mono text-2xl font-bold whitespace-nowrap">Bir {mixBudget.toLocaleString()}</span>
                         </div>
                      </div>
                      <div className="flex gap-4">
                         <div className="bg-emerald-800/50 p-4 rounded-xl border border-emerald-700 min-w-[120px]">
                            <p className="text-xs text-emerald-300 uppercase">Candidates</p>
                            <p className="text-xl font-bold">{IMPORT_CANDIDATES.length} Items</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Comparison Chart */}
                   <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                      <h4 className="font-bold text-gray-800 dark:text-white mb-4">Strategy Outcomes Comparison</h4>
                      <div className="h-[300px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={mixSimulationData} layout="vertical" margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                               <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={isDarkMode ? '#374151' : '#e5e7eb'} />
                               <XAxis type="number" hide />
                               <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                               <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={tooltipStyle} itemStyle={itemStyle} />
                               <Legend />
                               <Bar dataKey="Revenue" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                               <Bar dataKey="Profit" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                         </ResponsiveContainer>
                      </div>
                   </div>

                   {/* Recommended Mix Table (Using the 'Profit First' strategy as default recommendation) */}
                   <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                      <h4 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center justify-between">
                         <span>Recommended Order Mix</span>
                         <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">Based on Profit Maximization</span>
                      </h4>
                      <div className="flex-1 overflow-auto">
                         <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-700/50">
                               <tr>
                                  <th className="px-4 py-2">Product</th>
                                  <th className="px-4 py-2 text-right">Unit Cost</th>
                                  <th className="px-4 py-2 text-right">Suggested Qty</th>
                                  <th className="px-4 py-2 text-right">Total Cost</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                               {Object.entries(mixSimulationData.find(s => s.key === 'profit')?.mix || {}).map(([name, qty], idx) => {
                                  if (qty === 0) return null;
                                  const product = IMPORT_CANDIDATES.find(p => p.name === name);
                                  return (
                                     <tr key={idx}>
                                        <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{name}</td>
                                        <td className="px-4 py-2 text-right text-gray-500">Bir {product?.cost.toLocaleString()}</td>
                                        <td className="px-4 py-2 text-right font-bold text-indigo-600 dark:text-indigo-400">{qty}</td>
                                        <td className="px-4 py-2 text-right">Bir {((product?.cost || 0) * qty).toLocaleString()}</td>
                                     </tr>
                                  );
                               })}
                            </tbody>
                         </table>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-sm">
                         <span className="text-gray-500">Projected Net Profit:</span>
                         <span className="font-bold text-xl text-green-600">
                            Bir {mixSimulationData.find(s => s.key === 'profit')?.Profit.toLocaleString()}
                         </span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
      )}

      {activeTab === 'reports' && (
        <ExecutiveReporting />
      )}

      {/* Entry Modal */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Ledger Entry</h3>
                <form onSubmit={handleAddEntry} className="space-y-4">
                    <input type="date" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} />
                    <input type="text" placeholder="Description" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newEntry.description} onChange={e => setNewEntry({...newEntry, description: e.target.value})} />
                    <input type="text" placeholder="Account" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newEntry.account} onChange={e => setNewEntry({...newEntry, account: e.target.value})} />
                    <select className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newEntry.type} onChange={e => setNewEntry({...newEntry, type: e.target.value as any})}>
                        <option>Debit</option><option>Credit</option>
                    </select>
                    <input type="number" placeholder="Amount" required className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={newEntry.amount} onChange={e => setNewEntry({...newEntry, amount: Number(e.target.value)})} />
                    <div className="flex gap-2 justify-end mt-4">
                        <button type="button" onClick={() => setIsEntryModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700">Save</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AccountingPortal;
