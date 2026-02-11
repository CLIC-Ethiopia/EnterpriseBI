import React, { useState } from 'react';
import { DepartmentData, DepartmentType } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, Search, Menu, Moon, Sun, 
  LayoutDashboard, Users, Database, Globe, Package, BadgeDollarSign, TrendingUp, Settings,
  LogOut, X, Filter, Download, MessageSquare, Check, CheckCircle2, XCircle, Banknote, ShieldAlert, Calculator,
  Printer
} from 'lucide-react';
import CustomerPortal from './CustomerPortal';
import DataAdminPortal from './DataAdminPortal';
import SystemAdminPortal from './SystemAdminPortal';
import AccountingPortal from './AccountingPortal';
import WarehouseCatalog from './WarehouseCatalog';

interface DashboardProps {
  department: DepartmentData;
  allDepartments: DepartmentData[];
  onSwitchDepartment: (dept: DepartmentData) => void;
  onOpenAI: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ 
  department, 
  allDepartments, 
  onSwitchDepartment, 
  onOpenAI, 
  onLogout, 
  isDarkMode, 
  toggleTheme 
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeKpiComment, setActiveKpiComment] = useState<number | null>(null);
  const [kpiComments, setKpiComments] = useState<Record<number, string>>({});
  const [tempComment, setTempComment] = useState("");
  const [approvedItems, setApprovedItems] = useState<Set<number>>(new Set());
  const [rejectedItems, setRejectedItems] = useState<Set<number>>(new Set());
  const [isWarehouseCatalogOpen, setIsWarehouseCatalogOpen] = useState(false);

  const isGeneralManagement = department.id === DepartmentType.GENERAL;
  const isCustomerView = department.id === DepartmentType.CUSTOMER;
  const isDataAdmin = department.id === DepartmentType.DATA_ADMIN;
  const isSystemAdmin = department.id === DepartmentType.SYSTEM_ADMIN;
  const isAccounting = department.id === DepartmentType.ACCOUNTING;
  const isInventory = department.id === DepartmentType.INVENTORY;

  // Determine current user based on department for display purposes
  const currentUser = (() => {
    switch(department.id) {
      case DepartmentType.GENERAL: return { name: "Frehun Adefris", role: "Director" };
      case DepartmentType.FINANCE: return { name: "Belete Chala", role: "CFO" };
      case DepartmentType.ACCOUNTING: return { name: "Anteneh Aseres", role: "Sr. Accountant" };
      case DepartmentType.SALES: return { name: "Tigist Bekele", role: "Sales Manager" };
      case DepartmentType.INVENTORY: return { name: "Dawit Kebede", role: "Warehouse Mgr" };
      case DepartmentType.HR: return { name: "Hanna Alemu", role: "HR Director" };
      case DepartmentType.SYSTEM_ADMIN: return { name: "Abel Girma", role: "Sys Admin" };
      case DepartmentType.DATA_ADMIN: return { name: "Sara Tefera", role: "Data Analyst" };
      case DepartmentType.CUSTOMER: return { name: "Solomon Tesfaye", role: "Partner" };
      default: return { name: "Frehun Adefris", role: "Director" };
    }
  })();

  // Dynamic color selection based on department theme
  const getThemeColor = (opacity = 1) => {
    const colors: Record<string, string> = {
      emerald: `rgba(16, 185, 129, ${opacity})`,
      blue: `rgba(59, 130, 246, ${opacity})`,
      violet: `rgba(139, 92, 246, ${opacity})`,
      rose: `rgba(244, 63, 94, ${opacity})`,
      indigo: `rgba(99, 102, 241, ${opacity})`,
      slate: `rgba(100, 116, 139, ${opacity})`,
      gray: `rgba(107, 114, 128, ${opacity})`,
      cyan: `rgba(6, 182, 212, ${opacity})`,
    };
    return colors[department.themeColor] || colors.blue;
  };

  const strokeColor = getThemeColor(1);
  
  // Chart configuration for Dark Mode
  const gridColor = isDarkMode ? '#374151' : '#f1f5f9';
  const axisColor = '#94a3b8';
  const tooltipStyle = {
    backgroundColor: isDarkMode ? '#1f2937' : '#fff',
    borderColor: isDarkMode ? '#374151' : '#fff',
    color: isDarkMode ? '#fff' : '#000',
    borderRadius: '8px',
    border: '1px solid',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
  };

  const getIcon = (name: string) => {
    switch(name) {
      case 'Package': return <Package className="w-5 h-5" />;
      case 'BadgeDollarSign': return <BadgeDollarSign className="w-5 h-5" />;
      case 'Banknote': return <Banknote className="w-5 h-5" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5" />;
      case 'Users': return <Users className="w-5 h-5" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5" />;
      case 'Calculator': return <Calculator className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Good': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Stable': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Warning': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleSaveComment = (index: number) => {
    if (tempComment.trim()) {
      setKpiComments(prev => ({...prev, [index]: tempComment}));
      setTempComment("");
      setActiveKpiComment(null);
    }
  };

  const handleApprove = (id: number) => {
    setApprovedItems(prev => new Set(prev).add(id));
  };

  const handleReject = (id: number) => {
    setRejectedItems(prev => new Set(prev).add(id));
  };

  const generalDept = allDepartments.find(d => d.id === DepartmentType.GENERAL);
  const customerDept = allDepartments.find(d => d.id === DepartmentType.CUSTOMER);
  const adminDept = allDepartments.find(d => d.id === DepartmentType.DATA_ADMIN);
  const systemAdminDept = allDepartments.find(d => d.id === DepartmentType.SYSTEM_ADMIN);

  // Helper to filter out special departments for the main list
  const standardDepartments = allDepartments.filter(d => 
    d.id !== DepartmentType.GENERAL && 
    d.id !== DepartmentType.CUSTOMER && 
    d.id !== DepartmentType.DATA_ADMIN &&
    d.id !== DepartmentType.SYSTEM_ADMIN
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden transition-colors duration-300 print:overflow-visible print:bg-white print:h-auto print:block">
      <style>{`
        @media print {
          @page { margin: 0.5cm; size: landscape; }
          
          /* Essential Resets */
          html, body, #root {
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            background: white !important;
          }

          /* Hide Scrollbars in Print */
          ::-webkit-scrollbar {
            display: none;
          }

          /* Hide Sidebar and Interactive Elements */
          aside, 
          button, 
          .no-print, 
          header button, 
          header input,
          header .bg-gray-100,
          header .text-gray-600 {
            display: none !important;
          }

          /* Unset Flex constraints on wrappers to allow full height expansion */
          div.flex.h-screen, 
          div.flex.min-h-screen,
          div.flex.overflow-hidden,
          main.overflow-y-auto {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
            width: 100% !important;
          }
          
          /* Specific Wrapper Resets */
          .flex-1.flex.flex-col.h-screen {
             height: auto !important;
             overflow: visible !important;
          }

          /* Header styling for print */
          header {
            position: relative !important;
            padding: 10px 0 !important;
            border-bottom: 2px solid #000 !important;
            margin-bottom: 20px !important;
            display: flex !important;
            justify-content: space-between !important;
            width: 100% !important;
          }
          
          /* Ensure text is black */
          h1, h2, h3, h4, p, span, td, th {
            color: black !important;
            text-shadow: none !important;
          }
          
          /* Keep KPI trends visible but formatted */
          .text-green-600, .text-red-600 {
            color: black !important;
            font-weight: bold;
          }

          /* Card Styling for Print */
          div[class*="rounded-2xl"], div[class*="rounded-xl"], div[class*="bg-white"] {
            box-shadow: none !important;
            border: 1px solid #ccc !important;
            break-inside: avoid;
            page-break-inside: avoid;
            background-color: white !important;
            margin-bottom: 1rem !important;
          }

          /* Chart Containers */
          .recharts-wrapper {
            width: 100% !important;
          }
          .recharts-responsive-container {
            min-height: 300px !important;
          }
          
          /* Ensure Grid layouts work */
          .grid {
            display: grid !important;
          }

          /* Hide floating AI button */
          button[class*="fixed bottom-6"] {
            display: none !important;
          }
        }
      `}</style>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm print:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Warehouse Catalog Modal */}
      {isWarehouseCatalogOpen && department.inventoryData && (
        <WarehouseCatalog 
           products={department.inventoryData.products} 
           onClose={() => setIsWarehouseCatalogOpen(false)} 
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed lg:relative inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col print:hidden`}>
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <Globe className="w-5 h-5" />
             </div>
             <span className="text-lg font-bold text-gray-900 dark:text-white">GlobalTrade<span className="text-indigo-600 dark:text-indigo-400">BI</span></span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          
          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">Overview</h4>
            <button 
              onClick={() => {
                if(generalDept) onSwitchDepartment(generalDept);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isGeneralManagement
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">General Management</span>
            </button>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">Departments</h4>
            <div className="space-y-1">
              {standardDepartments.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => {
                    onSwitchDepartment(dept);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    department.id === dept.id 
                      ? `bg-${dept.themeColor}-50 dark:bg-${dept.themeColor}-900/20 text-${dept.themeColor}-600 dark:text-${dept.themeColor}-400 font-medium shadow-sm` 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  {getIcon(dept.iconName)}
                  <span>{dept.name.split(" ")[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
             <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 px-2">Portals</h4>
             <div className="space-y-1">
               <button 
                 onClick={() => {
                   if(customerDept) onSwitchDepartment(customerDept);
                   setSidebarOpen(false);
                 }}
                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isCustomerView
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
               >
                 <Users className="w-5 h-5" />
                 <span className="font-medium">Customer View</span>
               </button>
               <button 
                 onClick={() => {
                   if(adminDept) onSwitchDepartment(adminDept);
                   setSidebarOpen(false);
                 }}
                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isDataAdmin
                      ? 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 font-medium shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
               >
                 <Database className="w-5 h-5" />
                 <span className="font-medium">Data Admin</span>
               </button>
               <button 
                 onClick={() => {
                   if(systemAdminDept) onSwitchDepartment(systemAdminDept);
                   setSidebarOpen(false);
                 }}
                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                    isSystemAdmin
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
               >
                 <ShieldAlert className="w-5 h-5" />
                 <span className="font-medium">System Admin</span>
               </button>
             </div>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700">
             <button 
               onClick={onLogout}
               className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
             >
               <LogOut className="w-5 h-5" />
               <span>Sign Out</span>
             </button>
          </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden print:h-auto print:overflow-visible print:block">
        
        {/* Top Navigation Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10 print:border-none">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden print:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white leading-tight flex items-center gap-2">
                {department.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4 print:hidden">
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Search data..." className="bg-transparent border-none outline-none text-sm w-48 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span>
            </button>

            <button 
              onClick={() => window.print()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
              title="Print Dashboard / Save as PDF"
            >
              <Printer className="w-5 h-5" />
            </button>
            
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
            
            <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <p className="text-sm font-medium text-gray-900 dark:text-white">{currentUser.name}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.role}</p>
               </div>
               <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 shadow-sm overflow-hidden flex items-center justify-center font-bold text-gray-600 dark:text-gray-300">
                  {currentUser.name.charAt(0)}
               </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 print:overflow-visible print:h-auto print:block">
           <div className="max-w-7xl mx-auto space-y-8 pb-12 print:max-w-none">
             
             {/* CONDITIONAL RENDERING: CUSTOMER PORTAL vs DATA ADMIN vs SYSTEM ADMIN vs ACCOUNTING vs STANDARD DASHBOARD */}
             {isCustomerView && department.customerData ? (
               <CustomerPortal data={department.customerData} />
             ) : isDataAdmin ? (
               <DataAdminPortal allDepartments={allDepartments} />
             ) : isSystemAdmin && department.systemAdminData ? (
               <SystemAdminPortal data={department.systemAdminData} />
             ) : isAccounting ? (
               <AccountingPortal data={department} />
             ) : (
               <>
                  {/* Header Actions */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
                     <div>
                       <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>
                       <p className="text-gray-500 dark:text-gray-400">Track key performance indicators and department metrics.</p>
                     </div>
                     <div className="flex gap-3">
                        {isInventory ? (
                           <button 
                              onClick={() => setIsWarehouseCatalogOpen(true)}
                              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-sm shadow-emerald-200 dark:shadow-none"
                           >
                              <Package className="w-4 h-4" />
                              Product Catalogue
                           </button>
                        ) : (
                           <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              Settings
                           </button>
                        )}
                        <button 
                          onClick={onOpenAI}
                          className={`px-4 py-2 bg-${department.themeColor}-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm flex items-center gap-2 shadow-sm shadow-${department.themeColor}-200 dark:shadow-none`}
                        >
                          <img src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_darkmode_2bdb7df2724e450073ede.gif" className="w-4 h-4 opacity-80" alt="AI" />
                          Ask AI Analyst
                        </button>
                     </div>
                  </div>

                  {/* KPI Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 print:grid-cols-4">
                    {department.kpis.map((kpi, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group relative break-inside-avoid print:shadow-none print:border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</h3>
                          <div className="flex gap-1 print:hidden">
                            {isGeneralManagement && (
                              <button 
                                onClick={() => setActiveKpiComment(activeKpiComment === index ? null : index)}
                                className={`text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${kpiComments[index] ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            )}
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4" /></button>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-3xl font-bold text-gray-900 dark:text-white">{kpi.value}</span>
                        </div>
                        <div className={`flex items-center text-sm ${kpi.trend === 'up' && kpi.change.startsWith('+') ? 'text-green-600 dark:text-green-400' : kpi.trend === 'neutral' ? 'text-gray-500 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}`}>
                          {kpi.change.startsWith('+') ? <ArrowUpRight className="w-4 h-4 mr-1" /> : kpi.change === '0%' ? null : <ArrowDownRight className="w-4 h-4 mr-1" />}
                          <span className="font-medium">{kpi.change}</span>
                          <span className="text-gray-400 dark:text-gray-500 ml-2 font-normal">vs last month</span>
                        </div>
                        
                        {/* Comment Popover */}
                        {activeKpiComment === index && (
                          <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-3 z-20 print:hidden">
                             <p className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-200">Manager Comment:</p>
                             <textarea 
                                className="w-full text-sm p-2 border border-gray-300 dark:border-gray-500 rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white mb-2 focus:ring-1 focus:ring-indigo-500 outline-none"
                                rows={3}
                                placeholder="Add a note regarding this KPI..."
                                value={tempComment || kpiComments[index] || ""}
                                onChange={(e) => setTempComment(e.target.value)}
                             />
                             <div className="flex justify-end gap-2">
                                <button onClick={() => setActiveKpiComment(null)} className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">Cancel</button>
                                <button onClick={() => handleSaveComment(index)} className="text-xs px-2 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save</button>
                             </div>
                          </div>
                        )}
                        {kpiComments[index] && !activeKpiComment && (
                           <div className="mt-3 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded border border-indigo-100 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300 italic">
                              "{kpiComments[index]}"
                           </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Charts Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:block">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors break-inside-avoid print:mb-6 print:shadow-none print:border-gray-200">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                          {isGeneralManagement ? "Company-Wide Performance" : "Performance Trends"}
                        </h3>
                        <select className="bg-gray-50 dark:bg-gray-700 border-none text-sm rounded-lg px-3 py-1 text-gray-600 dark:text-gray-300 focus:ring-0 print:hidden">
                          <option>Last 6 Months</option>
                          <option>This Year</option>
                        </select>
                      </div>
                      <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={department.mainChartData}>
                            <defs>
                              <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.1}/>
                                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: axisColor, fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: axisColor, fontSize: 12}} />
                            <RechartsTooltip 
                              contentStyle={tooltipStyle}
                              cursor={{stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4'}}
                            />
                            {Object.keys(department.mainChartData[0] || {}).filter(k => k !== 'name').map((key, i) => (
                                 <Area 
                                    key={key}
                                    type="monotone" 
                                    dataKey={key} 
                                    stroke={i === 0 ? strokeColor : COLORS[i % COLORS.length]} 
                                    fill={i === 0 ? "url(#colorMain)" : "none"} 
                                    strokeWidth={3}
                                  />
                            ))}
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Secondary Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors break-inside-avoid print:mb-6 print:shadow-none print:border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">
                         {isGeneralManagement ? "Departmental Contribution" : "Distribution"}
                      </h3>
                      <div className="flex-1 min-h-[250px] relative">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={department.secondaryChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {department.secondaryChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={isDarkMode ? '#1f2937' : '#fff'} strokeWidth={2} />
                                ))}
                              </Pie>
                              <RechartsTooltip contentStyle={tooltipStyle} />
                              <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: isDarkMode ? '#e5e7eb' : '#374151' }}>{value}</span>} />
                            </PieChart>
                         </ResponsiveContainer>
                         {/* Center Text for Donut */}
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-sm font-semibold text-gray-400 dark:text-gray-500 pb-8">Total</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Analytics Row (Bar Chart & Table) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
                    {/* Comparison Bar Chart */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors break-inside-avoid print:mb-6 print:shadow-none print:border-gray-200">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{department.barChartTitle}</h3>
                          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 print:hidden">
                             <Download className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="h-80 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={department.barChartData} barSize={20}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: axisColor, fontSize: 12}} dy={10} />
                              <YAxis axisLine={false} tickLine={false} tick={{fill: axisColor, fontSize: 12}} />
                              <RechartsTooltip 
                                 contentStyle={tooltipStyle}
                                 cursor={{fill: isDarkMode ? '#374151' : '#f1f5f9'}}
                              />
                              <Legend wrapperStyle={{paddingTop: '20px'}} formatter={(value) => <span style={{ color: isDarkMode ? '#e5e7eb' : '#374151' }}>{value}</span>}/>
                              {Object.keys(department.barChartData[0] || {}).filter(k => k !== 'name').map((key, i) => (
                                  <Bar 
                                    key={key} 
                                    dataKey={key} 
                                    fill={i === 0 ? strokeColor : COLORS[i % COLORS.length]} 
                                    radius={[4, 4, 0, 0]}
                                  />
                              ))}
                           </BarChart>
                         </ResponsiveContainer>
                       </div>
                    </div>

                    {/* Summary Table */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors flex flex-col break-inside-avoid print:mb-6 print:shadow-none print:border-gray-200">
                       <div className="flex justify-between items-center mb-6">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{department.tableTitle}</h3>
                          <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 print:hidden">
                             <Filter className="w-4 h-4" />
                             Filter
                          </button>
                       </div>
                       <div className="overflow-x-auto">
                         <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                               <tr>
                                  <th className="px-4 py-3 rounded-l-lg">Item</th>
                                  <th className="px-4 py-3">Category</th>
                                  <th className="px-4 py-3">Status</th>
                                  <th className="px-4 py-3">Value</th>
                                  <th className="px-4 py-3 rounded-r-lg">{isGeneralManagement ? "Action" : "Completion"}</th>
                               </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                               {department.summaryTableData.map((row) => (
                                  <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                     <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{row.item}</td>
                                     <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{row.category}</td>
                                     <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}>
                                           {row.status}
                                        </span>
                                     </td>
                                     <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{row.value}</td>
                                     <td className="px-4 py-3">
                                        {isGeneralManagement ? (
                                          <div className="flex items-center gap-2 print:hidden">
                                            {approvedItems.has(row.id) ? (
                                              <span className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" /> Approved
                                              </span>
                                            ) : rejectedItems.has(row.id) ? (
                                              <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                                                <XCircle className="w-4 h-4" /> Rejected
                                              </span>
                                            ) : (
                                              <>
                                                <button 
                                                  onClick={() => handleApprove(row.id)}
                                                  className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors" title="Approve"
                                                >
                                                  <Check className="w-4 h-4" />
                                                </button>
                                                <button 
                                                  onClick={() => handleReject(row.id)}
                                                  className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors" title="Reject"
                                                >
                                                  <X className="w-4 h-4" />
                                                </button>
                                              </>
                                            )}
                                          </div>
                                        ) : (
                                          <>
                                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                               <div 
                                                  className={`h-1.5 rounded-full ${row.completion === 100 ? 'bg-green-500' : 'bg-indigo-600'}`} 
                                                  style={{ width: `${row.completion}%` }}
                                               ></div>
                                            </div>
                                            <span className="text-xs text-gray-400 mt-1">{row.completion}%</span>
                                          </>
                                        )}
                                     </td>
                                  </tr>
                               ))}
                            </tbody>
                         </table>
                       </div>
                       <div className="mt-auto pt-4 text-center print:hidden">
                          <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View All Records</button>
                       </div>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:block">
                     <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors break-inside-avoid print:mb-6 print:shadow-none print:border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                          {department.recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                              <div className={`w-10 h-10 rounded-full bg-${department.themeColor}-50 dark:bg-${department.themeColor}-900/30 flex items-center justify-center flex-shrink-0`}>
                                <div className={`w-2 h-2 rounded-full bg-${department.themeColor}-500`}></div>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.action}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                              </div>
                              <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 print:hidden">View</button>
                            </div>
                          ))}
                        </div>
                     </div>

                     <div className={`bg-gradient-to-br from-${department.themeColor}-600 to-${department.themeColor}-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden break-inside-avoid print:hidden`}>
                        <div className="relative z-10">
                          <h3 className="text-xl font-bold mb-2">Quarterly Report Ready</h3>
                          <p className="text-white/80 mb-6 text-sm max-w-xs">The automated Q3 report for {department.name} has been generated and is ready for review.</p>
                          <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                            Download PDF
                          </button>
                        </div>
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
                     </div>
                  </div>
               </>
             )}
             
           </div>
        </main>
      </div>

      {/* Floating Action Button for Mobile AI */}
      <button 
        onClick={onOpenAI}
        className={`lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-${department.themeColor}-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-105 transition-transform print:hidden`}
      >
        <img src="https://www.gstatic.com/lamda/images/sparkle_resting_v2_darkmode_2bdb7df2724e450073ede.gif" className="w-6 h-6" alt="AI" />
      </button>

    </div>
  );
};

export default Dashboard;