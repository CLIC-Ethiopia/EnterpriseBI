
import React, { useState, useMemo } from 'react';
import { 
  Calculator, TrendingUp, DollarSign, Truck, Anchor, 
  AlertCircle, ChevronRight, Save, RotateCcw, PieChart as PieIcon, BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from 'recharts';

interface CostInputs {
  itemName: string;
  hsCode: string;
  quantity: number;
  unit: string;
  fobUsd: number;
  freightUsd: number;
  insuranceUsd: number;
  exchangeRate: number; // ETB per USD
  dutyRate: number; // %
  exciseRate: number; // %
  surTaxRate: number; // %
  vatRate: number; // %
  withholdingRate: number; // %
  portHandlingEtb: number;
  transportDjiboutiAddisEtb: number;
  clearingAgentEtb: number;
  miscCostEtb: number;
}

const initialInputs: CostInputs = {
  itemName: 'Industrial Chemical Drum (200L)',
  hsCode: '2905.11.00',
  quantity: 100,
  unit: 'Drums',
  fobUsd: 15000,
  freightUsd: 2500,
  insuranceUsd: 150,
  exchangeRate: 121.50,
  dutyRate: 10,
  exciseRate: 0,
  surTaxRate: 10,
  vatRate: 15,
  withholdingRate: 3,
  portHandlingEtb: 15000,
  transportDjiboutiAddisEtb: 65000,
  clearingAgentEtb: 12000,
  miscCostEtb: 5000
};

const LandedCostEngine: React.FC = () => {
  const [inputs, setInputs] = useState<CostInputs>(initialInputs);
  const [activeView, setActiveView] = useState<'calculator' | 'analytics'>('calculator');

  // Calculations
  const calculations = useMemo(() => {
    const {
      fobUsd, freightUsd, insuranceUsd, exchangeRate,
      dutyRate, exciseRate, surTaxRate, vatRate, withholdingRate,
      portHandlingEtb, transportDjiboutiAddisEtb, clearingAgentEtb, miscCostEtb,
      quantity
    } = inputs;

    // 1. CIF Calculation
    const cifUsd = fobUsd + freightUsd + insuranceUsd;
    const cifEtb = cifUsd * exchangeRate;

    // 2. Tax Calculations (Standard Ethiopian Cascade)
    // Duty is on CIF
    const dutyEtb = cifEtb * (dutyRate / 100);
    
    // Excise is usually on (CIF + Duty)
    const exciseBase = cifEtb + dutyEtb;
    const exciseEtb = exciseBase * (exciseRate / 100);

    // Sur-tax is usually on (CIF + Duty + Excise)
    const surTaxBase = cifEtb + dutyEtb + exciseEtb;
    const surTaxEtb = surTaxBase * (surTaxRate / 100);

    // VAT is on (CIF + Duty + Excise + Sur-tax)
    const vatBase = cifEtb + dutyEtb + exciseEtb + surTaxEtb;
    const vatEtb = vatBase * (vatRate / 100);

    // Withholding is on CIF
    const withholdingEtb = cifEtb * (withholdingRate / 100);

    const totalTaxEtb = dutyEtb + exciseEtb + surTaxEtb + vatEtb + withholdingEtb;

    // 3. Local Logistics
    const logisticsEtb = portHandlingEtb + transportDjiboutiAddisEtb + clearingAgentEtb + miscCostEtb;

    // 4. Final Landed Cost
    const totalLandedCostEtb = cifEtb + totalTaxEtb + logisticsEtb;
    const costPerUnit = totalLandedCostEtb / (quantity || 1);
    
    // Factor Calculation (How many times the FOB value?)
    const fobEtb = fobUsd * exchangeRate;
    const landedFactor = totalLandedCostEtb / fobEtb;

    return {
      cifUsd,
      cifEtb,
      dutyEtb,
      exciseEtb,
      surTaxEtb,
      vatEtb,
      withholdingEtb,
      totalTaxEtb,
      logisticsEtb,
      totalLandedCostEtb,
      costPerUnit,
      landedFactor
    };
  }, [inputs]);

  // Chart Data
  const stackData = [
    {
      name: 'Cost Breakdown',
      Product: inputs.fobUsd * inputs.exchangeRate,
      Freight_Ins: (inputs.freightUsd + inputs.insuranceUsd) * inputs.exchangeRate,
      Taxes: calculations.totalTaxEtb,
      Logistics: calculations.logisticsEtb,
    }
  ];

  const pieData = [
    { name: 'Product FOB', value: inputs.fobUsd * inputs.exchangeRate, color: '#3b82f6' }, // blue
    { name: 'Intl Logistics', value: (inputs.freightUsd + inputs.insuranceUsd) * inputs.exchangeRate, color: '#6366f1' }, // indigo
    { name: 'Govt Duties/Tax', value: calculations.totalTaxEtb, color: '#ef4444' }, // red
    { name: 'Local Logistics', value: calculations.logisticsEtb, color: '#10b981' }, // green
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Anchor className="w-6 h-6 text-blue-600" /> Landed Cost Engine
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Djibouti Corridor Import Calculator & Analysis</p>
        </div>
        <div className="flex gap-2">
           <button 
             onClick={() => setActiveView('calculator')}
             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeView === 'calculator' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
           >
             <Calculator className="w-4 h-4" /> Calculator
           </button>
           <button 
             onClick={() => setActiveView('analytics')}
             className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${activeView === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
           >
             <TrendingUp className="w-4 h-4" /> Trend Analytics
           </button>
        </div>
      </div>

      {activeView === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: Inputs Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-gray-500" /> Shipment Details (Inbound)
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                   <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Product Name</label>
                   <input type="text" name="itemName" value={inputs.itemName} onChange={handleTextChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div>
                   <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">HS Code</label>
                   <input type="text" name="hsCode" value={inputs.hsCode} onChange={handleTextChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Qty</label>
                      <input type="number" name="quantity" value={inputs.quantity} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                   </div>
                   <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Unit</label>
                      <input type="text" name="unit" value={inputs.unit} onChange={handleTextChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                   </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-700 my-4"></div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                 <div>
                    <label className="block text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase mb-1">FOB (USD)</label>
                    <input type="number" name="fobUsd" value={inputs.fobUsd} onChange={handleInputChange} className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Freight (USD)</label>
                    <input type="number" name="freightUsd" value={inputs.freightUsd} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ins. (USD)</label>
                    <input type="number" name="insuranceUsd" value={inputs.insuranceUsd} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:text-white" />
                 </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-100 dark:border-orange-800 mb-4">
                 <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase">Exchange Rate (ETB/USD)</label>
                    <input type="number" name="exchangeRate" value={inputs.exchangeRate} onChange={handleInputChange} className="w-24 px-2 py-1 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 rounded text-right text-sm font-bold dark:text-white outline-none" />
                 </div>
              </div>

              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-6 mb-3">Tax Rates (%)</h4>
              <div className="grid grid-cols-5 gap-2 mb-4">
                 <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Duty</label>
                    <input type="number" name="dutyRate" value={inputs.dutyRate} onChange={handleInputChange} className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Excise</label>
                    <input type="number" name="exciseRate" value={inputs.exciseRate} onChange={handleInputChange} className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Sur-tax</label>
                    <input type="number" name="surTaxRate" value={inputs.surTaxRate} onChange={handleInputChange} className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">VAT</label>
                    <input type="number" name="vatRate" value={inputs.vatRate} onChange={handleInputChange} className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">WHT</label>
                    <input type="number" name="withholdingRate" value={inputs.withholdingRate} onChange={handleInputChange} className="w-full px-2 py-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-center dark:text-white" />
                 </div>
              </div>

              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-6 mb-3">Local Logistics (ETB)</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Port Handling</label>
                    <input type="number" name="portHandlingEtb" value={inputs.portHandlingEtb} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Transport (DJ-ADD)</label>
                    <input type="number" name="transportDjiboutiAddisEtb" value={inputs.transportDjiboutiAddisEtb} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Clearing Agent</label>
                    <input type="number" name="clearingAgentEtb" value={inputs.clearingAgentEtb} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:text-white" />
                 </div>
                 <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Misc / Loading</label>
                    <input type="number" name="miscCostEtb" value={inputs.miscCostEtb} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:text-white" />
                 </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Results & Visuals */}
          <div className="lg:col-span-5 space-y-6">
             
             {/* Big Summary Card */}
             <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-6 text-white shadow-lg">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <p className="text-blue-200 text-xs font-bold uppercase tracking-wider">Estimated Landed Cost</p>
                      <h3 className="text-3xl font-bold mt-1">Bir {calculations.totalLandedCostEtb.toLocaleString(undefined, {maximumFractionDigits: 0})}</h3>
                   </div>
                   <div className="bg-white/10 p-2 rounded-lg">
                      <DollarSign className="w-6 h-6 text-white" />
                   </div>
                </div>
                <div className="bg-black/20 rounded-xl p-4 flex justify-between items-center mb-4">
                   <span className="text-sm font-medium">Cost Per Unit</span>
                   <span className="text-xl font-bold text-green-300">Bir {calculations.costPerUnit.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
                </div>
                <div className="flex gap-2 text-xs text-blue-200">
                   <AlertCircle className="w-4 h-4" />
                   <span>Multiplier: {calculations.landedFactor.toFixed(2)}x of FOB Value</span>
                </div>
             </div>

             {/* Stacked Cost Visual */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4">Cost Structure Breakdown</h4>
                <div className="h-64">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stackData} layout="vertical" barSize={30}>
                         <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                         <XAxis type="number" hide />
                         <YAxis type="category" dataKey="name" hide />
                         <Tooltip 
                            formatter={(value: number) => `Bir ${value.toLocaleString(undefined, {maximumFractionDigits: 0})}`}
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                         />
                         <Legend />
                         <Bar dataKey="Product" stackId="a" fill="#3b82f6" radius={[4, 0, 0, 4]} />
                         <Bar dataKey="Freight_Ins" stackId="a" fill="#6366f1" />
                         <Bar dataKey="Taxes" stackId="a" fill="#ef4444" />
                         <Bar dataKey="Logistics" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                   <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <p className="text-xs text-gray-500">CIF Value</p>
                      <p className="font-bold text-gray-900 dark:text-white">Bir {calculations.cifEtb.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                   </div>
                   <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-xs text-red-500">Total Taxes</p>
                      <p className="font-bold text-gray-900 dark:text-white">Bir {calculations.totalTaxEtb.toLocaleString(undefined, {maximumFractionDigits: 0})}</p>
                   </div>
                </div>
             </div>

             <div className="flex gap-3">
                <button 
                  onClick={() => setInputs(initialInputs)}
                  className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                >
                   <RotateCcw className="w-4 h-4" /> Reset
                </button>
                <button className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg shadow-green-200 dark:shadow-none">
                   <Save className="w-4 h-4" /> Save Estimation
                </button>
             </div>

          </div>
        </div>
      )}

      {activeView === 'analytics' && (
         <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center min-h-[400px] text-center">
            <BarChart3 className="w-16 h-16 text-gray-200 dark:text-gray-700 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Historical Analytics Module</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
               This module tracks landed cost variance over time, helping you analyze the impact of exchange rate fluctuations and policy changes on your bottom line.
            </p>
            <button 
               onClick={() => setActiveView('calculator')}
               className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
               Return to Calculator
            </button>
         </div>
      )}
    </div>
  );
};

export default LandedCostEngine;
