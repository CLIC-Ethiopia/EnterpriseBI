import React, { useState } from 'react';
import { DepartmentData } from '../types';
import { 
  Calculator, PieChart as PieIcon, TrendingUp, DollarSign, Calendar, Search, 
  FileText, Sliders, ArrowRight, Plus, Download, RefreshCw
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

interface AccountingPortalProps {
  data: DepartmentData;
}

const AccountingPortal: React.FC<AccountingPortalProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'ledger' | 'analysis'>('dashboard');
  const [ledgerSearch, setLedgerSearch] = useState('');
  
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

  const currentRatio = (ratioInputs.currentAssets / ratioInputs.currentLiabilities).toFixed(2);
  const quickRatio = ((ratioInputs.currentAssets - ratioInputs.inventory) / ratioInputs.currentLiabilities).toFixed(2);
  const cashRatio = (ratioInputs.cash / ratioInputs.currentLiabilities).toFixed(2);
  
  const breakevenUnits = Math.ceil(breakevenInputs.fixedCosts / (breakevenInputs.pricePerUnit - breakevenInputs.variableCostPerUnit));
  const breakevenRevenue = breakevenUnits * breakevenInputs.pricePerUnit;

  const accountingData = data.accountingData;
  const filteredLedger = accountingData?.ledger.filter(entry => 
    entry.description.toLowerCase().includes(ledgerSearch.toLowerCase()) || 
    entry.account.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
    entry.id.toLowerCase().includes(ledgerSearch.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      
      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-xl w-fit border border-gray-100 dark:border-gray-700">
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
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                     <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
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
              <button className="w-full mt-6 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                 View Tax Calendar
              </button>
            </div>
          </div>
        </>
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
               <button className="px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-cyan-700 transition-colors shadow-lg shadow-cyan-200 dark:shadow-none">
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
         </div>
      )}
    </div>
  );
};

export default AccountingPortal;
