
import React, { useEffect } from 'react';
import { DepartmentData, DepartmentType } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Globe, Building2, User, Calendar, X, ShieldCheck } from 'lucide-react';

interface DashboardPrintViewProps {
  department: DepartmentData;
  onClose: () => void;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const DashboardPrintView: React.FC<DashboardPrintViewProps> = ({ department, onClose }) => {
  
  // Auto-trigger print dialog after a short delay to ensure charts render
  useEffect(() => {
    // 800ms delay gives Recharts time to animate/render the SVG before print freeze
    const timer = setTimeout(() => {
      window.print();
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const getCurrentUser = (id: DepartmentType) => {
    switch(id) {
        case DepartmentType.GENERAL: return { name: "Frehun Adefris", role: "Director" };
        case DepartmentType.FINANCE: return { name: "Belete Chala", role: "CFO" };
        case DepartmentType.ACCOUNTING: return { name: "Anteneh Aseres", role: "Sr. Accountant" };
        case DepartmentType.SALES: return { name: "Tigist Bekele", role: "Sales Manager" };
        case DepartmentType.INVENTORY: return { name: "Dawit Kebede", role: "Warehouse Mgr" };
        case DepartmentType.HR: return { name: "Hanna Alemu", role: "HR Director" };
        case DepartmentType.SYSTEM_ADMIN: return { name: "Abel Girma", role: "Sys Admin" };
        case DepartmentType.DATA_ADMIN: return { name: "Sara Tefera", role: "Data Analyst" };
        case DepartmentType.CUSTOMER: return { name: "Solomon Tesfaye", role: "Partner" };
        case DepartmentType.IMPORT_COSTING: return { name: "Yonas Abebe", role: "Logistics Mgr" };
        default: return { name: "Frehun Adefris", role: "Director" };
    }
  };

  const currentUser = getCurrentUser(department.id);
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    // Outer Wrapper: Fixed/Absolute for screen preview, Static for print to allow paging
    <div className="fixed inset-0 z-[9999] bg-gray-100 overflow-y-auto flex justify-center items-start pt-10 print:static print:pt-0 print:block print:bg-white print:overflow-visible">
      
      {/* Floating Close Button (Hidden in Print) */}
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 bg-red-600 text-white px-6 py-3 rounded-full shadow-xl hover:bg-red-700 transition-all font-bold z-50 print:hidden flex items-center gap-2"
      >
        <X className="w-5 h-5" /> Close Print View
      </button>

      {/* A4 Page Container */}
      <div id="dashboard-print-view" className="bg-white w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl print:shadow-none print:w-full print:p-0 print:m-0 text-black font-sans relative">
        
        {/* REPORT HEADER */}
        <header className="border-b-4 border-indigo-900 pb-6 mb-8 flex justify-between items-start print:break-inside-avoid">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-900 rounded-xl flex items-center justify-center text-white print:print-color-adjust-exact">
                    <Globe className="w-10 h-10" />
                </div>
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 tracking-tight">GlobalTrade<span className="text-indigo-700">BI</span></h1>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Enterprise Intelligence Suite</p>
                </div>
            </div>
            <div className="text-right">
                <div className="inline-block bg-gray-100 border border-gray-300 px-3 py-1 rounded text-xs font-bold text-gray-600 uppercase mb-2">
                    Internal Use Only
                </div>
                <p className="text-sm font-medium text-gray-500">Report ID: {Math.floor(Math.random() * 1000000)}</p>
            </div>
        </header>

        {/* INTRO SECTION */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 flex justify-between items-center break-inside-avoid print:bg-gray-50 print:print-color-adjust-exact">
            <div>
                <h2 className="text-xl font-bold text-indigo-900 mb-1">{department.name}</h2>
                <p className="text-sm text-gray-600 italic max-w-md">{department.description}</p>
            </div>
            <div className="text-right space-y-1">
                <div className="flex items-center justify-end gap-2 text-sm text-gray-700">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="font-bold">{currentUser.name}</span>
                    <span className="text-gray-400">|</span>
                    <span>{currentUser.role}</span>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm text-gray-700">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{currentDate}</span>
                </div>
                <div className="flex items-center justify-end gap-2 text-sm text-gray-700">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>HQ: Addis Ababa</span>
                </div>
            </div>
        </section>

        {/* KPI SECTION */}
        <section className="mb-10 break-inside-avoid">
            <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-300 pb-2 mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-4 gap-4">
                {department.kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-white border border-gray-300 rounded-lg p-4">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-2">{kpi.label}</p>
                        <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                        <p className={`text-xs mt-1 font-medium ${kpi.trend === 'up' ? 'text-green-700' : kpi.trend === 'down' ? 'text-red-700' : 'text-gray-600'}`}>
                            {kpi.change} vs prev. month
                        </p>
                    </div>
                ))}
            </div>
        </section>

        {/* VISUALS SECTION */}
        <section className="mb-10 break-inside-avoid">
            <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-300 pb-2 mb-4">Performance Trends</h3>
            
            {/* Primary Chart */}
            <div className="mb-6 h-[250px] w-full border border-gray-200 rounded-lg p-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={department.mainChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                        <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{display: 'none'}} /> 
                        {/* No interactivity in print, simplified rendering */}
                        {Object.keys(department.mainChartData[0] || {}).filter(k => k !== 'name').map((key, i) => (
                            <Area 
                                key={key}
                                type="monotone" 
                                dataKey={key} 
                                stroke={i === 0 ? '#4f46e5' : COLORS[i % COLORS.length]} 
                                fill={i === 0 ? '#e0e7ff' : "none"} 
                                strokeWidth={2}
                                isAnimationActive={false} // CRITICAL for print: disables animation so it renders immediately
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Secondary Pie */}
                <div className="border border-gray-200 rounded-lg p-4 h-[250px] flex flex-col items-center justify-center">
                    <h4 className="text-xs font-bold text-gray-500 mb-2 w-full text-left">Distribution</h4>
                    <div className="w-full h-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={department.secondaryChartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={2}
                                    dataKey="value"
                                    isAnimationActive={false}
                                >
                                    {department.secondaryChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="white" />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{fontSize: '10px'}} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Tertiary Bar */}
                <div className="border border-gray-200 rounded-lg p-4 h-[250px]">
                    <h4 className="text-xs font-bold text-gray-500 mb-2">{department.barChartTitle}</h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={department.barChartData} barSize={20}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                            <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{fontSize: '10px'}} />
                            {Object.keys(department.barChartData[0] || {}).filter(k => k !== 'name').map((key, i) => (
                                <Bar 
                                    key={key} 
                                    dataKey={key} 
                                    fill={i === 0 ? '#4f46e5' : COLORS[i % COLORS.length]} 
                                    radius={[2, 2, 0, 0]}
                                    isAnimationActive={false}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </section>

        {/* DATA TABLE SECTION - Force Page Break Before if content is long */}
        <section className="break-before-auto">
            <h3 className="text-sm font-bold text-gray-500 uppercase border-b border-gray-300 pb-2 mb-4">{department.tableTitle}</h3>
            <table className="w-full text-xs text-left border-collapse border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 print:bg-gray-100 print:print-color-adjust-exact">
                    <tr>
                        <th className="p-3 border-b border-gray-300">Item</th>
                        <th className="p-3 border-b border-gray-300">Category</th>
                        <th className="p-3 border-b border-gray-300">Status</th>
                        <th className="p-3 border-b border-gray-300 text-right">Value</th>
                        <th className="p-3 border-b border-gray-300 text-right">Completion</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {department.summaryTableData.map((row) => (
                        <tr key={row.id} className="break-inside-avoid">
                            <td className="p-3 font-medium text-gray-900">{row.item}</td>
                            <td className="p-3 text-gray-600">{row.category}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 rounded-full font-bold text-[10px] uppercase border print:print-color-adjust-exact ${
                                    row.status === 'Good' ? 'bg-green-50 text-green-700 border-green-200' :
                                    row.status === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' :
                                    row.status === 'Warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                    'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                    {row.status}
                                </span>
                            </td>
                            <td className="p-3 text-right font-mono text-gray-800">{row.value}</td>
                            <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden print:print-color-adjust-exact">
                                        <div className="h-full bg-indigo-600" style={{width: `${row.completion}%`}}></div>
                                    </div>
                                    <span className="text-gray-500">{row.completion}%</span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>

        {/* FOOTER - Repeated on pages usually via browser, but this is a static footer for the end of document */}
        <footer className="mt-12 pt-6 border-t-2 border-gray-800 flex justify-between items-center text-[10px] text-gray-500 break-inside-avoid">
            <div className="flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" />
                <span>Generated by GlobalTrade BI System • v2.4</span>
            </div>
            <div className="flex items-center gap-4">
                <span>Printed: {currentDate} {currentTime}</span>
                <span>Page 1 of 1</span>
            </div>
        </footer>

      </div>
    </div>
  );
};

export default DashboardPrintView;
