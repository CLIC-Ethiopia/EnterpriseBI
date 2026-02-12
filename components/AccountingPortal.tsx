
import React, { useState, useEffect } from 'react';
import { DepartmentData, LedgerEntry, SupplierTaxCategory, TransactionType, TaxCalculationResult, ReportMetric, ReportRequest } from '../types';
import { 
  Calculator, PieChart as PieIcon, TrendingUp, DollarSign, Calendar, Search, 
  FileText, Sliders, ArrowRight, Plus, Download, RefreshCw, Activity, Layers, Scale, X, GraduationCap,
  Stamp, Printer, AlertCircle, FileCheck, CheckCircle2, FileBarChart
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

const AccountingPortal: React.FC<AccountingPortalProps> = ({ data, onOpenAI, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'analysis' | 'compliance' | 'reports'>('dashboard');
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
           <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-2xl">
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search ledger entries..." 
                  className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none w-64 text-gray-700 dark:text-gray-200"
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                />
             </div>
             <div className="flex gap-2">
               <button className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Download className="w-4 h-4" /> Export CSV
               </button>
               <button 
                  onClick={() => setIsEntryModalOpen(true)}
                  className="px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-200 dark:shadow-none"
               >
                  <Plus className="w-4 h-4" /> Manual Entry
               </button>
             </div>
           </div>
           
           <div className="flex-1 overflow-auto">
              <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 dark:bg-gray-900/50 text-xs uppercase text-gray-500 dark:text-gray-400 font-medium sticky top-0">
                    <tr>
                       <th className="px-6 py-3">Date</th>
                       <th className="px-6 py-3">Reference ID</th>
                       <th className="px-6 py-3">Description</th>
                       <th className="px-6 py-3">Account</th>
                       <th className="px-6 py-3 text-right">Debit</th>
                       <th className="px-6 py-3 text-right">Credit</th>
                       <th className="px-6 py-3 text-center">Status</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {filteredLedger.map((entry, idx) => (
                       <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{entry.date}</td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-400">{entry.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{entry.description}</td>
                          <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                             <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">{entry.account}</span>
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                             {entry.type === 'Debit' ? entry.amount.toLocaleString() : '-'}
                          </td>
                          <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                             {entry.type === 'Credit' ? entry.amount.toLocaleString() : '-'}
                          </td>
                          <td className="px-6 py-4 text-center">
                             <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                entry.status === 'Posted' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                entry.status === 'Pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
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

      {activeTab === 'analysis' && (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Liquidity Ratio Calculator */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <Sliders className="w-5 h-5 text-cyan-600" /> Ratio Analyzer
                  </h3>
                  <button className="text-sm text-cyan-600 hover:underline">Load Live Data</button>
               </div>
               
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase">Current Assets</label>
                     <input 
                       type="number" 
                       className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                       value={ratioInputs.currentAssets}
                       onChange={e => setRatioInputs({...ratioInputs, currentAssets: Number(e.target.value)})}
                     />
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase">Current Liabilities</label>
                     <input 
                       type="number" 
                       className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                       value={ratioInputs.currentLiabilities}
                       onChange={e => setRatioInputs({...ratioInputs, currentLiabilities: Number(e.target.value)})}
                     />
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase">Inventory Value</label>
                     <input 
                       type="number" 
                       className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                       value={ratioInputs.inventory}
                       onChange={e => setRatioInputs({...ratioInputs, inventory: Number(e.target.value)})}
                     />
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase">Cash & Equiv.</label>
                     <input 
                       type="number" 
                       className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                       value={ratioInputs.cash}
                       onChange={e => setRatioInputs({...ratioInputs, cash: Number(e.target.value)})}
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl">
                     <div>
                        <p className="font-bold text-gray-800 dark:text-white">Current Ratio</p>
                        <p className="text-xs text-gray-500">Assets / Liabilities</p>
                     </div>
                     <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-700 dark:text-cyan-400">{currentRatio}</p>
                        <p className="text-xs text-green-600 font-semibold">{Number(currentRatio) > 1.5 ? 'Healthy' : 'Warning'}</p>
                     </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                     <div>
                        <p className="font-bold text-gray-800 dark:text-white">Quick Ratio</p>
                        <p className="text-xs text-gray-500">(Assets - Inv) / Liabilities</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{quickRatio}</p>
                     </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-700">
                     <div>
                        <p className="font-bold text-gray-800 dark:text-white">Cash Ratio</p>
                        <p className="text-xs text-gray-500">Cash / Liabilities</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xl font-bold text-gray-700 dark:text-gray-300">{cashRatio}</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Breakeven Simulator */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <TrendingUp className="w-5 h-5 text-indigo-600" /> Breakeven Simulator
                  </h3>
               </div>

               <div className="space-y-4 mb-6">
                  <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                        <span>FIXED COSTS</span>
                        <span>{breakevenInputs.fixedCosts.toLocaleString()}</span>
                     </div>
                     <input 
                       type="range" min="10000" max="100000" step="1000" 
                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                       value={breakevenInputs.fixedCosts}
                       onChange={e => setBreakevenInputs({...breakevenInputs, fixedCosts: Number(e.target.value)})}
                     />
                  </div>
                  <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                        <span>VARIABLE COST / UNIT</span>
                        <span>{breakevenInputs.variableCostPerUnit.toLocaleString()}</span>
                     </div>
                     <input 
                       type="range" min="10" max="500" step="5" 
                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                       value={breakevenInputs.variableCostPerUnit}
                       onChange={e => setBreakevenInputs({...breakevenInputs, variableCostPerUnit: Number(e.target.value)})}
                     />
                  </div>
                  <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-500 mb-1">
                        <span>PRICE / UNIT</span>
                        <span>{breakevenInputs.pricePerUnit.toLocaleString()}</span>
                     </div>
                     <input 
                       type="range" min="50" max="1000" step="10" 
                       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                       value={breakevenInputs.pricePerUnit}
                       onChange={e => setBreakevenInputs({...breakevenInputs, pricePerUnit: Number(e.target.value)})}
                     />
                  </div>
               </div>

               <div className="bg-indigo-600 rounded-xl p-6 text-white text-center">
                  <p className="text-indigo-200 text-sm font-medium uppercase tracking-wider mb-2">Required Sales Volume</p>
                  <h3 className="text-4xl font-extrabold mb-1">{breakevenUnits > 0 && isFinite(breakevenUnits) ? breakevenUnits.toLocaleString() : 'N/A'} <span className="text-lg text-indigo-200">units</span></h3>
                  <div className="h-px bg-indigo-500 w-1/2 mx-auto my-3"></div>
                  <p className="text-sm">Revenue to Breakeven: <span className="font-bold">Bir {breakevenRevenue > 0 && isFinite(breakevenRevenue) ? breakevenRevenue.toLocaleString() : 'N/A'}</span></p>
               </div>
               
               <p className="text-xs text-gray-400 mt-4 text-center">
                  *Calculated as Fixed Costs / (Price - Variable Cost)
               </p>
            </div>

            {/* DuPont ROE Analysis */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <Scale className="w-5 h-5 text-emerald-600" /> DuPont ROE Decomposer
                  </h3>
               </div>
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase">Net Income</label>
                     <input type="number" className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white outline-none" 
                       value={dupontInputs.netIncome} onChange={e => setDupontInputs({...dupontInputs, netIncome: Number(e.target.value)})} />
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase">Revenue</label>
                     <input type="number" className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white outline-none" 
                       value={dupontInputs.revenue} onChange={e => setDupontInputs({...dupontInputs, revenue: Number(e.target.value)})} />
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase">Total Assets</label>
                     <input type="number" className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white outline-none" 
                       value={dupontInputs.assets} onChange={e => setDupontInputs({...dupontInputs, assets: Number(e.target.value)})} />
                  </div>
                  <div>
                     <label className="text-xs font-semibold text-gray-500 uppercase">Avg Equity</label>
                     <input type="number" className="w-full mt-1 px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white outline-none" 
                       value={dupontInputs.equity} onChange={e => setDupontInputs({...dupontInputs, equity: Number(e.target.value)})} />
                  </div>
               </div>
               <div className="grid grid-cols-3 gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl text-center">
                  <div className="border-r border-emerald-200 dark:border-emerald-800 pr-2">
                     <p className="text-xs text-gray-500 mb-1">Profit Margin</p>
                     <p className="font-bold text-emerald-700 dark:text-emerald-400">{profitMargin.toFixed(1)}%</p>
                  </div>
                  <div className="border-r border-emerald-200 dark:border-emerald-800 px-2">
                     <p className="text-xs text-gray-500 mb-1">Asset Turnover</p>
                     <p className="font-bold text-emerald-700 dark:text-emerald-400">{assetTurnover.toFixed(2)}x</p>
                  </div>
                  <div className="pl-2">
                     <p className="text-xs text-gray-500 mb-1">Fin. Leverage</p>
                     <p className="font-bold text-emerald-700 dark:text-emerald-400">{financialLeverage.toFixed(2)}</p>
                  </div>
               </div>
               <div className="mt-4 flex justify-between items-center bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                  <span className="font-bold text-gray-900 dark:text-white">Return on Equity (ROE)</span>
                  <span className="text-xl font-extrabold text-emerald-600">{roe.toFixed(2)}%</span>
               </div>
            </div>

            {/* Profit Scenario Modeler */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <Activity className="w-5 h-5 text-purple-600" /> Sensitivity Analysis
                  </h3>
               </div>
               <div className="space-y-6">
                  <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                        <span>REVENUE GROWTH</span>
                        <span className="text-purple-600">{sensitivityInputs.revenueGrowth > 0 ? '+' : ''}{sensitivityInputs.revenueGrowth}%</span>
                     </div>
                     <input type="range" min="-20" max="20" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                       value={sensitivityInputs.revenueGrowth} onChange={e => setSensitivityInputs({...sensitivityInputs, revenueGrowth: Number(e.target.value)})} />
                  </div>
                  <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                        <span>COGS INCREASE</span>
                        <span className="text-red-500">{sensitivityInputs.cogsIncrease > 0 ? '+' : ''}{sensitivityInputs.cogsIncrease}%</span>
                     </div>
                     <input type="range" min="-10" max="20" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                       value={sensitivityInputs.cogsIncrease} onChange={e => setSensitivityInputs({...sensitivityInputs, cogsIncrease: Number(e.target.value)})} />
                  </div>
                  <div>
                     <div className="flex justify-between text-xs font-semibold text-gray-500 mb-2">
                        <span>OPEX VARIANCE</span>
                        <span className="text-orange-500">{sensitivityInputs.opexIncrease > 0 ? '+' : ''}{sensitivityInputs.opexIncrease}%</span>
                     </div>
                     <input type="range" min="-20" max="20" step="1" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                       value={sensitivityInputs.opexIncrease} onChange={e => setSensitivityInputs({...sensitivityInputs, opexIncrease: Number(e.target.value)})} />
                  </div>
               </div>
               <div className="mt-8 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl flex justify-between items-end">
                  <div>
                     <p className="text-xs text-gray-500 mb-1">Projected Net Profit</p>
                     <p className="text-2xl font-bold text-gray-900 dark:text-white">Bir {sensNetProfit.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xs text-gray-500 mb-1">Est. Net Margin</p>
                     <p className={`font-bold ${sensMargin >= 10 ? 'text-green-600' : 'text-orange-600'}`}>{sensMargin.toFixed(1)}%</p>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* Report Builder Tab */}
      {activeTab === 'reports' && (
        <ExecutiveReporting 
          metrics={ACCOUNTING_METRICS} 
          initialRequests={ACCOUNTING_REQUESTS} 
        />
      )}

      {/* Manual Entry Modal */}
      {isEntryModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">New Ledger Entry</h3>
               <button onClick={() => setIsEntryModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                 <X className="w-5 h-5" />
               </button>
            </div>
            <form onSubmit={handleAddEntry} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Office Supplies Payment"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                    value={newEntry.description}
                    onChange={(e) => setNewEntry({...newEntry, description: e.target.value})}
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Cash"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={newEntry.account}
                      onChange={(e) => setNewEntry({...newEntry, account: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
                    <input 
                      type="number" 
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={newEntry.amount}
                      onChange={(e) => setNewEntry({...newEntry, amount: Number(e.target.value)})}
                    />
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={newEntry.type}
                      onChange={(e) => setNewEntry({...newEntry, type: e.target.value as any})}
                    >
                      <option value="Debit">Debit</option>
                      <option value="Credit">Credit</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                    <select 
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={newEntry.status}
                      onChange={(e) => setNewEntry({...newEntry, status: e.target.value as any})}
                    >
                      <option value="Posted">Posted</option>
                      <option value="Pending">Pending</option>
                      <option value="Flagged">Flagged</option>
                    </select>
                 </div>
               </div>
               
               <div className="pt-6 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsEntryModalOpen(false)} 
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-200 dark:shadow-none"
                  >
                    Add Entry
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingPortal;
