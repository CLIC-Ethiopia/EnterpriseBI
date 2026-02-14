
import React, { useState, useMemo } from 'react';
import { 
  Calculator, TrendingUp, DollarSign, Truck, Anchor, 
  AlertCircle, ChevronRight, Save, RotateCcw, PieChart as PieIcon, BarChart3,
  Network, Lightbulb, ArrowUpRight, ArrowDownRight, Filter, Sigma
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, ScatterChart, Scatter, ZAxis
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

// Available parameters for correlation analysis
const ANALYSIS_PARAMS = [
  // Inputs
  { key: 'fobUsd', label: 'FOB Price (USD)', type: 'input' },
  { key: 'freightUsd', label: 'Freight Cost (USD)', type: 'input' },
  { key: 'exchangeRate', label: 'Exchange Rate (ETB/USD)', type: 'input' },
  { key: 'transportDjiboutiAddisEtb', label: 'Local Transport (ETB)', type: 'input' },
  { key: 'dutyRate', label: 'Duty Rate %', type: 'input' },
  { key: 'hrCost', label: 'Human Resource Cost (ETB)', type: 'input' }, // New
  { key: 'warehouseCost', label: 'Warehouse Overhead (ETB)', type: 'input' }, // New
  
  // Outputs
  { key: 'totalLandedCostEtb', label: 'Total Landed Cost (ETB)', type: 'output' },
  { key: 'totalTaxEtb', label: 'Total Tax Liability (ETB)', type: 'output' },
  { key: 'landedFactor', label: 'Cost Multiplier (Factor)', type: 'output' },
  { key: 'revenue', label: 'Sales Revenue (ETB)', type: 'output' }, // New
  { key: 'netProfit', label: 'Net Profit (ETB)', type: 'output' }, // New
];

const LandedCostEngine: React.FC = () => {
  const [inputs, setInputs] = useState<CostInputs>(initialInputs);
  const [activeView, setActiveView] = useState<'calculator' | 'analytics' | 'correlation'>('calculator');
  
  // Correlation State
  const [xAxisParam, setXAxisParam] = useState<string>('exchangeRate');
  const [yAxisParam, setYAxisParam] = useState<string>('totalLandedCostEtb');

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

  // Scenario Generator for Correlation Chart
  const correlationData = useMemo(() => {
    const dataPoints = [];
    const variance = 0.3; // Base variance for inputs
    const steps = 50; // More points for better scatter visualization

    // Pseudo-random generator with seed for consistency during render
    let seed = 1;
    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    // Define "Correlation Profiles" (0 = No correlation, 1 = Perfect)
    // This determines how much noise we add to the Y value relative to X
    const getNoiseFactor = (xKey: string, yKey: string): number => {
        const pair = `${xKey}_${yKey}`;
        const reversePair = `${yKey}_${xKey}`;
        
        const relationships: Record<string, number> = {
            // Strong Positive
            'fobUsd_totalLandedCostEtb': 0.02, 
            'exchangeRate_totalLandedCostEtb': 0.05,
            'revenue_netProfit': 0.1,
            
            // Moderate
            'hrCost_revenue': 0.4, 
            'warehouseCost_totalLandedCostEtb': 0.5,
            
            // Weak / Noisy
            'hrCost_exchangeRate': 1.5, // Almost random
            'warehouseCost_dutyRate': 2.0, // Random
            'freightUsd_netProfit': 0.6,
        };

        // Default noise if not mapped (Moderate correlation)
        return relationships[pair] || relationships[reversePair] || 0.3; 
    };

    const noiseLevel = getNoiseFactor(xAxisParam, yAxisParam);

    for (let i = 0; i < steps; i++) {
        // 1. Vary the X-Axis Input (or simulated input)
        // We simulate a range of -30% to +30% from the base values
        const variationFactor = 0.7 + (random() * 0.6); 
        
        const simInputs = { ...inputs };
        
        // Base values for new hypothetical parameters
        let hrCostBase = 250000; 
        let warehouseCostBase = 45000;

        // Apply variation to X parameter if it's an input
        if (xAxisParam in simInputs) {
            (simInputs as any)[xAxisParam] = (initialInputs as any)[xAxisParam] * variationFactor;
        } else if (xAxisParam === 'hrCost') {
            hrCostBase = hrCostBase * variationFactor;
        } else if (xAxisParam === 'warehouseCost') {
            warehouseCostBase = warehouseCostBase * variationFactor;
        }

        // 2. Recalculate Core Math
        const simCifEtb = (simInputs.fobUsd + simInputs.freightUsd + simInputs.insuranceUsd) * simInputs.exchangeRate;
        const simDutyEtb = simCifEtb * (simInputs.dutyRate / 100);
        const simTotalTax = simDutyEtb + (simCifEtb * 0.15) + (simCifEtb * 0.03); 
        const simLogistics = simInputs.portHandlingEtb + simInputs.transportDjiboutiAddisEtb + simInputs.clearingAgentEtb + simInputs.miscCostEtb;
        const simLandedCost = simCifEtb + simTotalTax + simLogistics;
        const simFactor = simLandedCost / (simInputs.fobUsd * simInputs.exchangeRate);

        // 3. Simulate Business Outcomes (Revenue, Profit)
        // Revenue is roughly LandedCost * 1.3 (30% markup) + Random Market Fluctuations
        const marketNoise = 1 + ((random() - 0.5) * 0.2);
        const simRevenue = simLandedCost * 1.35 * marketNoise;
        
        // Profit = Revenue - LandedCost - Overhead (HR + Warehouse)
        // Add random operational inefficiencies
        const opInefficiency = 1 + ((random() - 0.5) * 0.1);
        const simTotalOverhead = (hrCostBase + warehouseCostBase) * opInefficiency;
        const simNetProfit = simRevenue - simLandedCost - simTotalOverhead;

        // 4. Construct the Data Point Object
        const outputs: any = {
            totalLandedCostEtb: simLandedCost,
            totalTaxEtb: simTotalTax,
            landedFactor: simFactor,
            revenue: simRevenue,
            netProfit: simNetProfit,
            hrCost: hrCostBase * (1 + (random() - 0.5) * 0.1), // Add slight noise to independent var
            warehouseCost: warehouseCostBase * (1 + (random() - 0.5) * 0.1),
            ...simInputs
        };

        // 5. Apply Correlation Noise to Y
        // We take the "Calculated" Y value, but scramble it based on the noiseLevel
        // logic: Y_final = Y_calc * (1 + (Noise * Random(-0.5 to 0.5)))
        let yValue = Number(outputs[yAxisParam]);
        
        // Special case: If we are plotting independent vs independent (e.g. HR vs Exchange Rate), 
        // the relationship should be almost purely random unless we defined a logic connecting them.
        // The getNoiseFactor handles this magnitude.
        const yNoise = (random() - 0.5) * noiseLevel;
        yValue = yValue * (1 + yValue === 0 ? 0 : yNoise); // Avoid multiplying 0

        dataPoints.push({
            x: Number(outputs[xAxisParam]),
            y: yValue,
            z: 1 
        });
    }
    return dataPoints.sort((a, b) => a.x - b.x);
  }, [inputs, xAxisParam, yAxisParam]);

  // Calculate Pearson Correlation Coefficient (r)
  const correlationCoefficient = useMemo(() => {
    const n = correlationData.length;
    if (n === 0) return 0;

    const sumX = correlationData.reduce((acc, val) => acc + val.x, 0);
    const sumY = correlationData.reduce((acc, val) => acc + val.y, 0);
    const sumXY = correlationData.reduce((acc, val) => acc + (val.x * val.y), 0);
    const sumX2 = correlationData.reduce((acc, val) => acc + (val.x * val.x), 0);
    const sumY2 = correlationData.reduce((acc, val) => acc + (val.y * val.y), 0);

    const numerator = (n * sumXY) - (sumX * sumY);
    const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));

    return denominator === 0 ? 0 : numerator / denominator;
  }, [correlationData]);

  // Dynamic Styles based on 'r'
  const getCorrelationStrengthStyles = (r: number) => {
    const absR = Math.abs(r);
    
    if (absR >= 0.8) {
        return {
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-700 dark:text-green-300',
            border: 'border-green-200 dark:border-green-800',
            label: 'Strong',
            desc: 'High predictive power. X strongly influences Y.'
        };
    } else if (absR >= 0.5) {
        return {
            bg: 'bg-indigo-100 dark:bg-indigo-900/30',
            text: 'text-indigo-700 dark:text-indigo-300',
            border: 'border-indigo-200 dark:border-indigo-800',
            label: 'Moderate',
            desc: 'Noticeable trend, but external factors (noise) play a role.'
        };
    } else if (absR >= 0.3) {
        return {
            bg: 'bg-yellow-100 dark:bg-yellow-900/30',
            text: 'text-yellow-700 dark:text-yellow-300',
            border: 'border-yellow-200 dark:border-yellow-800',
            label: 'Weak',
            desc: 'Loose relationship. Caution advised when forecasting.'
        };
    } else {
        return {
            bg: 'bg-gray-100 dark:bg-gray-800',
            text: 'text-gray-600 dark:text-gray-400',
            border: 'border-gray-200 dark:border-gray-700',
            label: 'Negligible',
            desc: 'No statistical relationship detected. Random distribution.'
        };
    }
  };

  const style = getCorrelationStrengthStyles(correlationCoefficient);
  const direction = correlationCoefficient > 0 ? "Positive" : "Negative";

  // Generate Recommendations based on selection
  const getRecommendations = () => {
      const r = correlationCoefficient;
      const absR = Math.abs(r);

      if (xAxisParam === 'exchangeRate' && yAxisParam === 'totalLandedCostEtb') {
          return [
              { title: "Forex Hedging", desc: "Correlation is critically high. Any devaluation of ETB directly inflates landed costs.", type: 'strategy' },
              { title: "Local Sourcing", desc: "Consider domestic raw material alternatives to decouple from exchange rate volatility.", type: 'opportunity' }
          ];
      }
      if (xAxisParam === 'hrCost' && absR < 0.3) {
          return [
              { title: "Cost Efficiency", desc: "HR costs show little impact on this output. Optimize workforce allocation without fearing immediate profit drops.", type: 'efficiency' },
              { title: "Review Payroll", desc: "Investigate why increased HR spend isn't correlating with higher output.", type: 'strategy' }
          ];
      }
      if (absR > 0.8) {
          return [
              { title: "Direct Driver", desc: "Focus management attention here. This input is a primary lever for controlling the output.", type: 'strategy' },
              { title: "Predictive Modeling", desc: "High confidence for forecasting. Use this relationship for next quarter's budget.", type: 'opportunity' }
          ];
      }
      if (absR < 0.2) {
           return [
              { title: "Decoupled Metrics", desc: "These variables move independently. Do not use one to predict the other.", type: 'general' },
              { title: "Investigate Hidden Factors", desc: "Look for confounding variables that might be masking a relationship.", type: 'strategy' }
          ];
      }
      return [
          { title: "Variance Analysis", desc: "Monitor this relationship. Deviation suggests operational inefficiency.", type: 'general' },
          { title: "Supplier Negotiation", desc: "Use this cost breakdown to negotiate better FOB terms.", type: 'strategy' }
      ];
  };

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
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
           <button 
             onClick={() => setActiveView('calculator')}
             className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeView === 'calculator' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
           >
             <Calculator className="w-4 h-4" /> Calculator
           </button>
           <button 
             onClick={() => setActiveView('analytics')}
             className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeView === 'analytics' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
           >
             <TrendingUp className="w-4 h-4" /> Trend Analytics
           </button>
           <button 
             onClick={() => setActiveView('correlation')}
             className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${activeView === 'correlation' ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'}`}
           >
             <Network className="w-4 h-4" /> Correlation & Recommender
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

      {activeView === 'correlation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Configuration & Recommendations */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-indigo-500" /> Analysis Parameters
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">X-Axis (Independent Variable)</label>
                            <select 
                                value={xAxisParam}
                                onChange={(e) => setXAxisParam(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            >
                                {ANALYSIS_PARAMS.filter(p => p.type === 'input').map(p => (
                                    <option key={p.key} value={p.key}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-center text-gray-400">
                            <ArrowDownRight className="w-5 h-5" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Y-Axis (Dependent Variable)</label>
                            <select 
                                value={yAxisParam}
                                onChange={(e) => setYAxisParam(e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            >
                                {ANALYSIS_PARAMS.filter(p => p.type === 'output').map(p => (
                                    <option key={p.key} value={p.key}>{p.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Correlation Coefficient Card */}
                <div className={`p-6 rounded-2xl shadow-sm border transition-colors ${style.bg} ${style.border}`}>
                    <div className="flex justify-between items-start mb-3">
                        <h3 className={`font-bold flex items-center gap-2 text-sm ${style.text}`}>
                            <Sigma className="w-4 h-4" /> Statistical Strength (r)
                        </h3>
                        <span className={`text-xl font-bold ${style.text}`}>
                            {correlationCoefficient.toFixed(2)}
                        </span>
                    </div>
                    <div className={`p-3 rounded-xl border ${style.border} bg-white/50 dark:bg-black/10`}>
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-xs font-bold ${style.text}`}>{style.label} {direction} Correlation</span>
                        </div>
                        <p className={`text-xs ${style.text} opacity-80 leading-relaxed`}>
                            {style.desc}
                        </p>
                    </div>
                </div>

                <div className="bg-indigo-600 p-6 rounded-2xl shadow-lg text-white">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-300" /> Smart Recommendations
                    </h3>
                    <div className="space-y-4">
                        {getRecommendations().map((rec, i) => (
                            <div key={i} className="bg-indigo-700/50 p-3 rounded-xl border border-indigo-500">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`w-2 h-2 rounded-full ${rec.type === 'strategy' ? 'bg-green-400' : 'bg-orange-400'}`}></span>
                                    <h4 className="font-bold text-sm">{rec.title}</h4>
                                </div>
                                <p className="text-xs text-indigo-100 leading-relaxed">{rec.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Visualization */}
            <div className="lg:col-span-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col">
                <div className="mb-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sensitivity Simulation</h3>
                        <p className="text-sm text-gray-500">Projected impact of ±30% variation in {ANALYSIS_PARAMS.find(p => p.key === xAxisParam)?.label}</p>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded font-bold">Linear Regression</span>
                    </div>
                </div>
                
                <div className="flex-1 min-h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis 
                                type="number" 
                                dataKey="x" 
                                name={ANALYSIS_PARAMS.find(p => p.key === xAxisParam)?.label} 
                                unit="" 
                                tick={{fontSize: 12}}
                                label={{ value: ANALYSIS_PARAMS.find(p => p.key === xAxisParam)?.label, position: 'bottom', offset: 0, fontSize: 12 }}
                            />
                            <YAxis 
                                type="number" 
                                dataKey="y" 
                                name={ANALYSIS_PARAMS.find(p => p.key === yAxisParam)?.label} 
                                unit="" 
                                tick={{fontSize: 12}}
                                domain={['auto', 'auto']}
                            />
                            <ZAxis type="number" dataKey="z" range={[60, 60]} />
                            <Tooltip 
                                cursor={{ strokeDasharray: '3 3' }} 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value: number) => value.toLocaleString(undefined, {maximumFractionDigits: 0})}
                            />
                            <Scatter name="Correlation" data={correlationData} fill="#4f46e5" />
                        </ScatterChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl text-center text-xs text-gray-500">
                    * Simulation assumes all other variables remain constant (Ceteris paribus). Real-world results may vary based on regulatory changes.
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default LandedCostEngine;
