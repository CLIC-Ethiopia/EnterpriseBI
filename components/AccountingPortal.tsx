
import React, { useState, useEffect, useMemo } from 'react';
import { DepartmentData, LedgerEntry, SupplierTaxCategory, TransactionType, TaxCalculationResult, ReportMetric, ReportRequest } from '../types';
import { 
  Calculator, PieChart as PieIcon, TrendingUp, DollarSign, Calendar, Search, 
  FileText, Sliders, ArrowRight, Plus, Download, RefreshCw, Activity, Layers, Scale, X, GraduationCap,
  Stamp, Printer, AlertCircle, FileCheck, CheckCircle2, FileBarChart, Table, Grid3X3, Maximize2, Minimize2, Divide,
  Package, Landmark, Truck
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, PieChart, Pie
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

const ACCOUNTING_REQUESTS: ReportRequest[] = [
  { id: 'REQ-201', title: 'Q3 Vendor Payment Summary', submittedBy: 'Belete Chala', department: 'Finance', dateSubmitted: '2024-10-25', priority: 'Normal', status: 'Pending', description: 'Consolidated report of all payments made to chemical suppliers in Q3.' },
  { id: 'REQ-202', title: 'Expense Audit: Marketing', submittedBy: 'Tigist Bekele', department: 'Sales', dateSubmitted: '2024-10-24', priority: 'High', status: 'Approved', description: 'Review of travel and event expenses against budget.' },
];

// Mock Data for Cross-Department Analysis
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

// Mock Data for Budget Analysis
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

// Mock Data for Inventory Analysis
const INVENTORY_DATA = [
  { item: 'Chemical A', category: 'Chemicals', location: 'Zone A', quantity: 500, unit_cost: 50, total_value: 25000, status: 'In Stock' },
  { item: 'Fabric Roll X', category: 'Textiles', location: 'Zone B', quantity: 100, unit_cost: 150, total_value: 15000, status: 'Low Stock' },
  { item: 'Dye Blue', category: 'Chemicals', location: 'Zone A', quantity: 1200, unit_cost: 20, total_value: 24000, status: 'In Stock' },
  { item: 'Cotton Yarn', category: 'Textiles', location: 'Zone C', quantity: 0, unit_cost: 80, total_value: 0, status: 'Out of Stock' },
  { item: 'Solvent Z', category: 'Chemicals', location: 'Zone B', quantity: 300, unit_cost: 40, total_value: 12000, status: 'In Stock' },
  { item: 'Spare Parts', category: 'Machinery', location: 'Zone D', quantity: 50, unit_cost: 500, total_value: 25000, status: 'Critical' },
  { item: 'Packaging', category: 'Supplies', location: 'Zone C', quantity: 5000, unit_cost: 2, total_value: 10000, status: 'In Stock' },
];

// --- PIVOT HELPER FUNCTIONS ---
type AggregationType = 'sum' | 'count' | 'avg' | 'max' | 'min';

const calculatePivotData = (data: any[], rowKeyField: string, colKeyField: string, valueField: string, operation: AggregationType) => {
  const rowKeys = new Set<string>();
  const colKeys = new Set<string>();
  const matrix: Record<string, Record<string, number>> = {};
  // For average calculation
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
       // Initialize based on op
       matrix[rKey][cKey] = operation === 'min' ? Infinity : operation === 'max' ? -Infinity : 0;
    }
    
    if (!counts[rKey]) counts[rKey] = {};
    if (!counts[rKey][cKey]) counts[rKey][cKey] = 0;

    if (operation === 'sum') matrix[rKey][cKey] += val;
    else if (operation === 'count') matrix[rKey][cKey] += 1;
    else if (operation === 'max') matrix[rKey][cKey] = Math.max(matrix[rKey][cKey], val);
    else if (operation === 'min') matrix[rKey][cKey] = Math.min(matrix[rKey][cKey], val);
    else if (operation === 'avg') {
      matrix[rKey][cKey] += val; // Sum first, divide later
      counts[rKey][cKey] += 1;
    }
  });

  // Final Pass for Averages and Global Max finding
  const rows = Array.from(rowKeys).sort();
  const cols = Array.from(colKeys).sort();

  rows.forEach(r => {
    cols.forEach(c => {
      if (matrix[r] && matrix[r][c] !== undefined) {
        if (operation === 'avg') {
          matrix[r][c] = matrix[r][c] / counts[r][c];
        }
        // Handle Infinity for Min if no data
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
    // Use Red for negative values if it's variance, else Indigo
    const isNegative = value < 0;
    if (isNegative) return `rgba(239, 68, 68, ${intensity})`;
    return `rgba(99, 102, 241, ${intensity})`; 
  };

  const getTextColor = (value: number, max: number) => {
    if (!value && value !== 0) return '';
    return (max > 0 && (Math.abs(value) / max) > 0.5) ? 'text-white' : 'text-gray-900 dark:text-gray-100';
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                {icon} {title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {config.op.toUpperCase()} of <span className="font-semibold text-indigo-600 dark:text-indigo-400">{config.val.replace(/_/g, ' ')}</span> by {config.row} & {config.col}
              </p>
            </div>
            {onConfigChange && (
               <div className="flex gap-2">
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

        <div className="overflow-auto flex-1 rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 font-bold sticky top-0 z-10">
              <tr>
                <th className="p-3 border-b border-r border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 sticky left-0 z-20 min-w-[120px]">
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
                <tr key={row} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-3 font-semibold text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 sticky left-0 z-10">
                    {row}
                  </td>
                  {cols.map(col => {
                    const val = matrix[row]?.[col] || 0;
                    const bgStyle = getCellColor(val, maxVal);
                    const textClass = getTextColor(val, maxVal);
                    return (
                      <td 
                        key={col} 
                        className={`p-2 text-right font-medium transition-colors ${textClass}`}
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
    // Get keys from first item, filter out 'id' if generic
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
      // TOT is 2% for Goods, 10% for Services usually, but simplified here as per user prompt logic requests
      const totRate = transactionType === 'Goods' ? 0.02 : 0.10;
      totAmount = baseAmount * totRate;
      notes.push(`TOT (${totRate * 100}%) applied for ${transactionType}.`);
    }

    // 2. Withholding Tax Logic
    // Threshold > 3,000 ETB
    const isWhtApplicable = baseAmount >= 3000;
    if (isWhtApplicable) {
      const whtRate = transactionType === 'Goods' ? 0.02 : 0.05;
      whtAmount = baseAmount * whtRate;
      notes.push(`Withholding Tax (${whtRate * 100}%) deducted (Amount > 3,000 ETB).`);
    } else {
      notes.push('No Withholding Tax (Amount < 3,000 ETB).');
    }

    // Net Payable = Base + VAT/TOT - WHT
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

  // Analysis Tool States
  const [ratioInputs, setRatioInputs] = useState({
    currentAssets: 1250000,
    currentLiabilities: 690000,
    inventory: 450000,
    cash: 150000
  });

  const [breakevenInputs, setBreakevenInputs] = useState({
    fixedCosts: 50000,
    variableCostPerUnit: 120,
    pricePerUnit: 250
  });

  // DuPont Analysis State
  const [dupontInputs, setDupontInputs] = useState({
    netIncome: 320000,
    revenue: 1450000,
    assets: 2100000,
    equity: 1200000
  });

  // Profit Sensitivity State
  const [sensitivityInputs, setSensitivityInputs] = useState({
    revenueGrowth: 0,
    cogsIncrease: 0,
    opexIncrease: 0,
    baseRevenue: 1000000,
    baseCOGS: 600000,
    baseOpex: 200000
  });

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

  const currentRatio = (ratioInputs.currentAssets / ratioInputs.currentLiabilities).toFixed(2);
  const quickRatio = ((ratioInputs.currentAssets - ratioInputs.inventory) / ratioInputs.currentLiabilities).toFixed(2);
  const cashRatio = (ratioInputs.cash / ratioInputs.currentLiabilities).toFixed(2);
  
  const breakevenUnits = Math.ceil(breakevenInputs.fixedCosts / (breakevenInputs.pricePerUnit - breakevenInputs.variableCostPerUnit));
  const breakevenRevenue = breakevenUnits * breakevenInputs.pricePerUnit;

  // DuPont Calculations
  const profitMargin = (dupontInputs.netIncome / dupontInputs.revenue) * 100;
  const assetTurnover = dupontInputs.revenue / dupontInputs.assets;
  const financialLeverage = dupontInputs.assets / dupontInputs.equity;
  const roe = (profitMargin / 100) * assetTurnover * financialLeverage * 100;

  // Sensitivity Calculations
  const sensRevenue = sensitivityInputs.baseRevenue * (1 + sensitivityInputs.revenueGrowth / 100);
  const sensCOGS = sensitivityInputs.baseCOGS * (1 + sensitivityInputs.cogsIncrease / 100);
  const sensOpex = sensitivityInputs.baseOpex * (1 + sensitivityInputs.opexIncrease / 100);
  const sensNetProfit = sensRevenue - sensCOGS - sensOpex;
  const sensMargin = (sensNetProfit / sensRevenue) * 100;

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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-[500px] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <h4 className="font-bold text-gray-700 dark:text-gray-200 capitalize">
                {activeDataset} Analysis
              </h4>
              {/* Controls */}
              <div className="flex flex-wrap gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-xl border border-gray-200 dark:border-gray-700">
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

            <div className="flex-1 overflow-hidden">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
             
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
          <div className="space-y-6">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                   <Stamp className="w-6 h-6 text-orange-500" /> ERCA Compliance Calculator
                </h3>
                
                <div className="space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Transaction Amount (ETB)</label>
                      <input 
                        type="number" 
                        value={taxInput.amount} 
                        onChange={(e) => setTaxInput({...taxInput, amount: Number(e.target.value)})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier Category</label>
                         <select 
                           value={taxInput.supplierCategory}
                           onChange={(e) => setTaxInput({...taxInput, supplierCategory: e.target.value as any})}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                         >
                            <option value="VAT_Reg">VAT Registered</option>
                            <option value="TOT_Reg">TOT Registered</option>
                            <option value="None">None</option>
                         </select>
                      </div>
                      <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                         <select 
                           value={taxInput.transactionType}
                           onChange={(e) => setTaxInput({...taxInput, transactionType: e.target.value as any})}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                         >
                            <option value="Goods">Goods</option>
                            <option value="Services">Services</option>
                         </select>
                      </div>
                   </div>

                   <div className="pt-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Supplier TIN</label>
                      <input 
                        type="text" 
                        value={taxInput.tinNumber}
                        onChange={(e) => setTaxInput({...taxInput, tinNumber: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex flex-col justify-center">
             {taxResult && (
               <div className="space-y-6">
                  <div className="text-center">
                     <p className="text-sm text-gray-500 dark:text-gray-400">Net Payable Amount</p>
                     <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
                        <span className="text-base align-top text-gray-400 mr-1">ETB</span>
                        {taxResult.netPayable.toLocaleString(undefined, {minimumFractionDigits: 2})}
                     </h2>
                  </div>

                  <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                     <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Base Amount</span>
                        <span className="font-medium text-gray-900 dark:text-white">{taxResult.baseAmount.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                        <span>+ VAT (15%)</span>
                        <span>{taxResult.vatAmount.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm text-blue-600 dark:text-blue-400">
                        <span>+ TOT</span>
                        <span>{taxResult.totAmount.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between text-sm text-red-500">
                        <span>- Withholding Tax</span>
                        <span>({taxResult.whtAmount.toLocaleString()})</span>
                     </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                     <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 uppercase mb-1">Compliance Notes</p>
                     <ul className="list-disc list-inside text-xs text-yellow-800 dark:text-yellow-300">
                        {taxResult.notes.map((note, i) => <li key={i}>{note}</li>)}
                     </ul>
                  </div>
                  
                  <button className="w-full py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-lg hover:opacity-90 flex items-center justify-center gap-2">
                     <Printer className="w-4 h-4" /> Print Withholding Receipt
                  </button>
               </div>
             )}
          </div>
        </div>
      )}

      {activeTab === 'analysis' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Liquidity Ratios */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Liquidity Analysis</h3>
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Current Assets</label>
                        <input type="number" value={ratioInputs.currentAssets} onChange={e => setRatioInputs({...ratioInputs, currentAssets: +e.target.value})} className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border rounded text-sm dark:text-white" />
                     </div>
                     <div>
                        <label className="block text-xs text-gray-500 uppercase font-bold mb-1">Current Liab.</label>
                        <input type="number" value={ratioInputs.currentLiabilities} onChange={e => setRatioInputs({...ratioInputs, currentLiabilities: +e.target.value})} className="w-full px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border rounded text-sm dark:text-white" />
                     </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4">
                     <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentRatio}</div>
                        <div className="text-xs text-gray-500">Current Ratio</div>
                     </div>
                     <div className="text-center p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{quickRatio}</div>
                        <div className="text-xs text-gray-500">Quick Ratio</div>
                     </div>
                     <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{cashRatio}</div>
                        <div className="text-xs text-gray-500">Cash Ratio</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* DuPont Analysis */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">DuPont ROE Decomposition</h3>
               <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-500">Net Profit Margin</span>
                     <span className="font-bold text-gray-900 dark:text-white">{profitMargin.toFixed(2)}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-500">Asset Turnover</span>
                     <span className="font-bold text-gray-900 dark:text-white">{assetTurnover.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-500">Financial Leverage</span>
                     <span className="font-bold text-gray-900 dark:text-white">{financialLeverage.toFixed(2)}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                     <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900 dark:text-white">Return on Equity (ROE)</span>
                        <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{roe.toFixed(2)}%</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

      {activeTab === 'ledger' && (
         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-2xl">
               <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search transactions..." 
                    className="pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-cyan-500 w-64 text-gray-700 dark:text-gray-200"
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                  />
               </div>
               <div className="flex gap-3">
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                     <Filter className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                     <Download className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setIsEntryModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                     <Plus className="w-4 h-4" /> Add Entry
                  </button>
               </div>
            </div>
            <div className="flex-1 overflow-auto">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0">
                     <tr>
                        <th className="px-6 py-3 font-medium border-b border-gray-200 dark:border-gray-700">Date</th>
                        <th className="px-6 py-3 font-medium border-b border-gray-200 dark:border-gray-700">Ref ID</th>
                        <th className="px-6 py-3 font-medium border-b border-gray-200 dark:border-gray-700">Description</th>
                        <th className="px-6 py-3 font-medium border-b border-gray-200 dark:border-gray-700">Account</th>
                        <th className="px-6 py-3 font-medium border-b border-gray-200 dark:border-gray-700 text-right">Debit</th>
                        <th className="px-6 py-3 font-medium border-b border-gray-200 dark:border-gray-700 text-right">Credit</th>
                        <th className="px-6 py-3 font-medium border-b border-gray-200 dark:border-gray-700 text-center">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                     {filteredLedger.map((entry, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                           <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">{entry.date}</td>
                           <td className="px-6 py-4 font-mono text-xs text-gray-400">{entry.id}</td>
                           <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{entry.description}</td>
                           <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{entry.account}</td>
                           <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-white">
                              {entry.type === 'Debit' ? entry.amount.toLocaleString() : '-'}
                           </td>
                           <td className="px-6 py-4 text-right font-mono text-gray-900 dark:text-white">
                              {entry.type === 'Credit' ? entry.amount.toLocaleString() : '-'}
                           </td>
                           <td className="px-6 py-4 text-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                 entry.status === 'Posted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                 entry.status === 'Flagged' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}>
                                 {entry.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>
      )}

      {activeTab === 'reports' && (
         <ExecutiveReporting metrics={ACCOUNTING_METRICS} initialRequests={ACCOUNTING_REQUESTS} />
      )}

      {/* Add Entry Modal */}
      {isEntryModalOpen && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">New Journal Entry</h3>
                  <button onClick={() => setIsEntryModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <form onSubmit={handleAddEntry} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                     <input type="date" value={newEntry.date} onChange={e => setNewEntry({...newEntry, date: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-transparent dark:text-white dark:border-gray-600" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                     <input type="text" value={newEntry.description} onChange={e => setNewEntry({...newEntry, description: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-transparent dark:text-white dark:border-gray-600" placeholder="e.g. Utility Payment" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account</label>
                        <input type="text" value={newEntry.account} onChange={e => setNewEntry({...newEntry, account: e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-transparent dark:text-white dark:border-gray-600" placeholder="e.g. Cash" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                        <select value={newEntry.type} onChange={e => setNewEntry({...newEntry, type: e.target.value as any})} className="w-full px-4 py-2 border rounded-lg bg-transparent dark:text-white dark:border-gray-600">
                           <option>Debit</option>
                           <option>Credit</option>
                        </select>
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                     <input type="number" value={newEntry.amount} onChange={e => setNewEntry({...newEntry, amount: +e.target.value})} className="w-full px-4 py-2 border rounded-lg bg-transparent dark:text-white dark:border-gray-600" />
                  </div>
                  <div className="pt-4 flex gap-3">
                     <button type="button" onClick={() => setIsEntryModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white">Cancel</button>
                     <button type="submit" className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">Post Entry</button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default AccountingPortal;
