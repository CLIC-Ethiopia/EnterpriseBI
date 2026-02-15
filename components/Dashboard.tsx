
import React, { useState, useEffect } from 'react';
import { DepartmentData, DepartmentType, TickerItem, CartItem, SummaryRow } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, Bell, Search, Menu, Moon, Sun, 
  LayoutDashboard, Users, Database, Globe, Package, BadgeDollarSign, TrendingUp, Settings,
  LogOut, X, Filter, Download, MessageSquare, Check, CheckCircle2, XCircle, Banknote, ShieldAlert, Calculator,
  Printer, HelpCircle, GraduationCap, ShoppingCart, Briefcase, ChevronRight, Save, UserPlus, ShoppingBag, Minus, Plus, CheckCircle, Anchor,
  FileBarChart, FileText, Hash, Calendar, ChevronDown
} from 'lucide-react';
import { CustomerPortal } from './CustomerPortal';
import DataAdminPortal from './DataAdminPortal';
import SystemAdminPortal from './SystemAdminPortal';
import AccountingPortal from './AccountingPortal';
import LandedCostEngine from './LandedCostEngine';
import WarehouseCatalog from './WarehouseCatalog';
import SmartTicker from './SmartTicker';
import LogisticsMap from './LogisticsMap';
import WarehouseHeatmap from './WarehouseHeatmap';
import ExecutiveReporting from './ExecutiveReporting';

interface DashboardProps {
  department: DepartmentData;
  allDepartments: DepartmentData[];
  onSwitchDepartment: (dept: DepartmentData) => void;
  onOpenAI: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onShowInfo: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onPrint: () => void; // New prop for printing
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'];

// Mock Ticker Data
const tickerItems: TickerItem[] = [
  { label: 'USD/ETB', value: '121.50', change: 0.45, type: 'currency' },
  { label: 'EUR/ETB', value: '132.80', change: -0.12, type: 'currency' },
  { label: 'Cotton Futures', value: '$84.20', change: 1.2, type: 'commodity' },
  { label: 'Brent Crude', value: '$82.40', change: -0.5, type: 'commodity' },
  { label: 'System Alert', value: 'Scheduled Maintenance 02:00 AM', change: 0, type: 'alert' },
  { label: 'Inventory', value: 'Low Stock: Chemical Zone C', change: 0, type: 'alert' },
];

const Dashboard: React.FC<DashboardProps> = ({ 
  department, 
  allDepartments, 
  onSwitchDepartment, 
  onOpenAI, 
  onLogout, 
  isDarkMode, 
  toggleTheme, 
  onShowInfo,
  cart,
  setCart,
  isCartOpen,
  setIsCartOpen,
  onPrint
}) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeKpiComment, setActiveKpiComment] = useState<number | null>(null);
  const [kpiComments, setKpiComments] = useState<Record<number, string>>({});
  const [tempComment, setTempComment] = useState("");
  const [approvedItems, setApprovedItems] = useState<Set<number>>(new Set());
  const [rejectedItems, setRejectedItems] = useState<Set<number>>(new Set());
  const [isWarehouseCatalogOpen, setIsWarehouseCatalogOpen] = useState(false);

  // General Management - Specific Views
  const [executiveView, setExecutiveView] = useState<'overview' | 'reporting'>('overview');

  // Report Generator State
  const [reportConfig, setReportConfig] = useState({
    period: 'Quarterly',
    startDate: '',
    endDate: '',
    isOpen: false,
    isSaving: false
  });

  // Sales Processing State
  const [isSalesProcessingOpen, setIsSalesProcessingOpen] = useState(false);
  const [localTableData, setLocalTableData] = useState<SummaryRow[]>([]);
  // salesQueue holds items transferred from the Cart after checkout
  const [salesQueue, setSalesQueue] = useState<any[]>([]);
  const [selectedSalesItem, setSelectedSalesItem] = useState<any | null>(null);
  
  const [salesForm, setSalesForm] = useState({
    item: '',
    category: 'Retail',
    value: '',
    status: 'Good',
    completion: 50,
    poNumber: '',
    quantity: 0
  });

  // Global Checkout Modal State
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Sync local table data when department changes
  useEffect(() => {
    setLocalTableData(department.summaryTableData);
    // Reset executive view when switching depts
    if (department.id !== DepartmentType.GENERAL) {
      setExecutiveView('overview');
    }
  }, [department]);

  const isGeneralManagement = department.id === DepartmentType.GENERAL;
  const isCustomerView = department.id === DepartmentType.CUSTOMER;
  const isDataAdmin = department.id === DepartmentType.DATA_ADMIN;
  const isSystemAdmin = department.id === DepartmentType.SYSTEM_ADMIN;
  const isAccounting = department.id === DepartmentType.ACCOUNTING;
  const isInventory = department.id === DepartmentType.INVENTORY;
  const isSales = department.id === DepartmentType.SALES;
  const isImportCosting = department.id === DepartmentType.IMPORT_COSTING;

  // ... (Helper functions remain same) ...
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
      case DepartmentType.IMPORT_COSTING: return { name: "Yonas Abebe", role: "Logistics Mgr" };
      default: return { name: "Frehun Adefris", role: "Director" };
    }
  })();

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
  const gridColor = isDarkMode ? '#374151' : '#f1f5f9';
  const axisColor = '#94a3b8';
  
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
      case 'Anchor': return <Anchor className="w-5 h-5" />;
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

  const getSidebarLabel = (dept: DepartmentData) => {
    switch(dept.id) {
        case DepartmentType.IMPORT_COSTING: return "Cost Estimation";
        case DepartmentType.FINANCE: return "Finance";
        case DepartmentType.HR: return "HR & Admin";
        case DepartmentType.SALES: return "Sales";
        case DepartmentType.INVENTORY: return "Inventory";
        case DepartmentType.ACCOUNTING: return "Accounting";
        default: return dept.name.split(" ")[0]; // Fallback
    }
  };

  // Cart Functions (Moved from CustomerPortal)
  const removeFromCart = (itemId: string, custId?: string) => {
    setCart(prev => prev.filter(item => !(item.id === itemId && item.customerId === custId)));
  };

  const updateQuantity = (itemId: string, custId: string | undefined, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId && item.customerId === custId) {
        const newQty = Math.max(1, item.cartQuantity + delta);
        return {...item, cartQuantity: newQty};
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

  const handleCheckout = () => {
    setIsOrderModalOpen(true);
    setIsCartOpen(false);
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Extract Form Data
    const formData = new FormData(e.target as HTMLFormElement);
    const poNumber = formData.get('poNumber') as string;
    const shippingAddress = formData.get('shippingAddress') as string;
    const notes = formData.get('notes') as string;

    // 2. Prepare Data for Sales Department
    const newSalesItems = cart.map(item => ({
        ...item,
        poNumber: poNumber,
        orderDate: new Date().toLocaleDateString(),
        totalPrice: item.price * item.cartQuantity,
        shippingAddress: shippingAddress,
        notes: notes,
        status: 'New'
    }));

    // 3. Send to Sales Department (Update Sales Queue)
    setSalesQueue(prev => [...prev, ...newSalesItems]);

    // 4. UI Feedback & Cleanup
    setTimeout(() => {
      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => {
        setIsOrderModalOpen(false);
        setOrderSuccess(false);
      }, 2000);
    }, 500);
  };

  // ... (Other handlers remain same) ...
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

  const handleProcessSale = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Math.max(...localTableData.map(r => r.id), 0) + 1;
    const newRow: SummaryRow = {
      id: newId,
      item: salesForm.item,
      category: salesForm.category,
      status: salesForm.status as any,
      value: salesForm.value.includes('Bir') ? salesForm.value : `Bir ${Number(salesForm.value).toLocaleString()}`,
      completion: Number(salesForm.completion)
    };

    setLocalTableData(prev => [newRow, ...prev]);
    
    // Remove processed item from queue if it exists
    if (selectedSalesItem && selectedSalesItem.poNumber) {
        setSalesQueue(prev => prev.filter(item => item.poNumber !== selectedSalesItem.poNumber));
    }

    setIsSalesProcessingOpen(false);
    setSelectedSalesItem(null);
    setSalesForm({
      item: '',
      category: 'Retail',
      value: '',
      status: 'Good',
      completion: 50,
      poNumber: '',
      quantity: 0
    });
  };

  const fillFormFromQueue = (item: any) => {
    setSelectedSalesItem(item);
    setSalesForm({
      item: item.customerName || 'New Client',
      category: 'Wholesale',
      value: (item.price * item.cartQuantity).toString(),
      status: 'Stable',
      completion: 20,
      poNumber: item.poNumber || '',
      quantity: item.cartQuantity || 0
    });
  };

  // Report Logic - Replaced by parent trigger via onPrint
  const handleDownloadReport = () => {
    window.print();
  };

  const generalDept = allDepartments.find(d => d.id === DepartmentType.GENERAL);
  const customerDept = allDepartments.find(d => d.id === DepartmentType.CUSTOMER);
  const adminDept = allDepartments.find(d => d.id === DepartmentType.DATA_ADMIN);
  const systemAdminDept = allDepartments.find(d => d.id === DepartmentType.SYSTEM_ADMIN);

  const standardDepartments = allDepartments.filter(d => 
    d.id !== DepartmentType.GENERAL && 
    d.id !== DepartmentType.CUSTOMER && 
    d.id !== DepartmentType.DATA_ADMIN && 
    d.id !== DepartmentType.SYSTEM_ADMIN
  );

  const getSidebarItemClass = (isActive: boolean, themeColor: string) => {
    const colorMap: Record<string, { active: string, hover: string }> = {
      indigo: {
        active: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-l-4 border-indigo-600 dark:border-indigo-400',
        hover: 'hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10'
      },
      blue: {
        active: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-600 dark:border-blue-400',
        hover: 'hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
      },
      emerald: {
        active: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-l-4 border-emerald-600 dark:border-emerald-400',
        hover: 'hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/10'
      },
      violet: {
        active: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border-l-4 border-violet-600 dark:border-violet-400',
        hover: 'hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/10'
      },
      rose: {
        active: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-l-4 border-rose-600 dark:border-rose-400',
        hover: 'hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/10'
      },
      cyan: {
        active: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-l-4 border-cyan-600 dark:border-cyan-400',
        hover: 'hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/10'
      },
      slate: {
        active: 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white border-l-4 border-slate-600 dark:border-slate-400',
        hover: 'hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
      },
      gray: {
        active: 'bg-gray-800 dark:bg-white text-white dark:text-gray-900 border-l-4 border-gray-600 dark:border-gray-300', 
        hover: 'hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
      }
    };

    const theme = colorMap[themeColor] || colorMap.indigo;

    return `w-full flex items-center gap-3 px-3 py-2.5 rounded-r-xl rounded-l-md transition-all duration-200 ${
      isActive 
        ? `${theme.active} font-bold shadow-sm` 
        : `text-gray-500 dark:text-gray-400 ${theme.hover} font-medium`
    }`;
  };

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden transition-colors duration-300">
      <style>{`
        @media print {
          @page { margin: 2.5cm; size: auto; }
          html, body {
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            background: white !important;
          }
          
          /* Target specific elements to ensure they break cleanly */
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }

          /* Ensure the report container flows properly */
          #report-content, #dashboard-print-view {
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
            box-shadow: none !important;
          }
          
          /* Hide everything else when dashboard print view is active */
          body:has(#dashboard-print-view) > * {
             display: none;
          }
          body:has(#dashboard-print-view) #root {
             display: block;
          }
          body:has(#dashboard-print-view) #root > * {
             display: none;
          }
          body:has(#dashboard-print-view) #root .print-view-wrapper {
             display: block;
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
      <aside className={`fixed lg:relative inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col pb-32 lg:pb-0 h-full ${reportConfig.isOpen ? 'print:hidden' : ''}`}>
        {/* Logo Area */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
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
              className={getSidebarItemClass(isGeneralManagement, 'indigo')}
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
                  className={getSidebarItemClass(department.id === dept.id, dept.themeColor)}
                >
                  {getIcon(dept.iconName)}
                  <span>{getSidebarLabel(dept)}</span>
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
                 className={getSidebarItemClass(isCustomerView, 'blue')}
               >
                 <Users className="w-5 h-5" />
                 <span className="font-medium">Customer View</span>
               </button>
               <button 
                 onClick={() => {
                   if(adminDept) onSwitchDepartment(adminDept);
                   setSidebarOpen(false);
                 }}
                 className={getSidebarItemClass(isDataAdmin, 'slate')}
               >
                 <Database className="w-5 h-5" />
                 <span className="font-medium">Data Admin</span>
               </button>
               <button 
                 onClick={() => {
                   if(systemAdminDept) onSwitchDepartment(systemAdminDept);
                   setSidebarOpen(false);
                 }}
                 className={getSidebarItemClass(isSystemAdmin, 'gray')}
               >
                 <ShieldAlert className="w-5 h-5" />
                 <span className="font-medium">System Admin</span>
               </button>
             </div>
          </div>
        </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
             <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 border border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">System Architect</span>
                   <button onClick={onLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Sign Out">
                      <LogOut className="w-4 h-4" />
                   </button>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-xs mb-1">Prof. Frehun A. Demissie</h3>
                <div className="space-y-0.5">
                    <a href="mailto:frehun.demissie@gmail.com" className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline block truncate">frehun.demissie@gmail.com</a>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">+251 911 69 2277</p>
                </div>
             </div>
          </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col h-full overflow-hidden ${reportConfig.isOpen ? 'print:hidden' : ''}`}>
        
        {/* Smart Ticker Component */}
        {!isCustomerView && (
           <SmartTicker items={tickerItems} />
        )}

        {/* Top Navigation Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center z-10 flex-shrink-0 print:hidden">
          {/* ... Header Content ... */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white leading-tight flex items-center gap-2">
                {department.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input type="text" placeholder="Search data..." className="bg-transparent border-none outline-none text-sm w-48 text-gray-800 dark:text-gray-200 placeholder-gray-400" />
            </div>
            
            {/* Customer Cart Icon (Only visible in Customer View) */}
            {isCustomerView && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
                title="View Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white border-2 border-white dark:border-gray-800 font-bold">
                    {cart.length}
                  </span>
                )}
              </button>
            )}

            <button 
              onClick={onPrint}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
              title="Print Dashboard / Save as PDF"
            >
              <Printer className="w-5 h-5" />
            </button>

            <button 
              onClick={onShowInfo}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
              title="Help & Info"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

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
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 pb-32">
           <div className="max-w-7xl mx-auto space-y-8 pb-12">
             
             {/* CONDITIONAL RENDERING */}
             {isCustomerView && department.customerData ? (
               <CustomerPortal 
                 data={department.customerData} 
                 onOpenAI={onOpenAI}
                 cart={cart}
                 setCart={setCart}
                 isCartOpen={isCartOpen}
                 setIsCartOpen={setIsCartOpen}
               />
             ) : isDataAdmin ? (
               <DataAdminPortal allDepartments={allDepartments} onOpenAI={onOpenAI} />
             ) : isSystemAdmin && department.systemAdminData ? (
               <SystemAdminPortal data={department.systemAdminData} onOpenAI={onOpenAI} />
             ) : isAccounting ? (
               <AccountingPortal data={department} onOpenAI={onOpenAI} isDarkMode={isDarkMode} />
             ) : isImportCosting ? (
               <LandedCostEngine />
             ) : (
               <>
                  {/* Executive View Toggle Switch (Only for General Management) */}
                  {isGeneralManagement && (
                    <div className="flex justify-center -mt-2 mb-6">
                      <div className="bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm inline-flex">
                        <button
                          onClick={() => setExecutiveView('overview')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            executiveView === 'overview' 
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          Dashboard Overview
                        </button>
                        <button
                          onClick={() => setExecutiveView('reporting')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                            executiveView === 'reporting' 
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <FileBarChart className="w-4 h-4" /> BI & Reporting
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Standard Dashboard vs Executive Reporting */}
                  {isGeneralManagement && executiveView === 'reporting' ? (
                    <ExecutiveReporting />
                  ) : (
                    <>
                      {/* ... Standard Dashboard ... */}
                      {/* Header Actions */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
                            ) : isSales ? (
                              <button 
                                  onClick={() => setIsSalesProcessingOpen(true)}
                                  className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200 dark:shadow-none"
                              >
                                  <ShoppingCart className="w-4 h-4" />
                                  Sales Processing
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
                              <GraduationCap className="w-4 h-4 opacity-90" />
                              Ask Prof. Fad
                            </button>
                        </div>
                      </div>

                      {/* KPI Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {department.kpis.map((kpi, index) => {
                          const changeStr = String(kpi.change || "");
                          return (
                          <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group relative">
                            <div className="flex justify-between items-start mb-4">
                              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{kpi.label}</h3>
                              <div className="flex gap-1">
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
                            <div className={`flex items-center text-sm ${kpi.trend === 'up' && changeStr.startsWith('+') ? 'text-green-600 dark:text-green-400' : kpi.trend === 'neutral' ? 'text-gray-500 dark:text-gray-400' : 'text-red-600 dark:text-red-400'}`}>
                              {changeStr.startsWith('+') ? <ArrowUpRight className="w-4 h-4 mr-1" /> : changeStr === '0%' ? null : <ArrowDownRight className="w-4 h-4 mr-1" />}
                              <span className="font-medium">{changeStr}</span>
                              <span className="text-gray-400 dark:text-gray-500 ml-2 font-normal">vs last month</span>
                            </div>
                            
                            {activeKpiComment === index && (
                              <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-3 z-20">
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
                        )})}
                      </div>

                      {/* SPECIALIZED VISUALIZATIONS */}
                      {(isSales || isInventory || isImportCosting) && department.logisticsRoutes && (
                        <div className="">
                            <LogisticsMap routes={department.logisticsRoutes} />
                        </div>
                      )}

                      {isInventory && department.inventoryData && (
                        <div className="">
                            <WarehouseHeatmap products={department.inventoryData.products} />
                        </div>
                      )}

                      {/* Charts Row */}
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                          <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                              {isGeneralManagement ? "Company-Wide Performance" : "Performance Trends"}
                            </h3>
                            <select className="bg-gray-50 dark:bg-gray-700 border-none text-sm rounded-lg px-3 py-1 text-gray-600 dark:text-gray-300 focus:ring-0">
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
                                  itemStyle={itemStyle}
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
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col transition-colors">
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
                                  <RechartsTooltip contentStyle={tooltipStyle} itemStyle={itemStyle} />
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
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Comparison Bar Chart */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
                          <div className="flex justify-between items-center mb-6">
                              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{department.barChartTitle}</h3>
                              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500">
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
                                    itemStyle={itemStyle}
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
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors flex flex-col">
                          <div className="flex justify-between items-center mb-6">
                              <h3 className="text-lg font-bold text-gray-800 dark:text-white">{department.tableTitle}</h3>
                              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
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
                                  {localTableData.map((row) => (
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
                                              <div className="flex items-center gap-2">
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
                          <div className="mt-auto pt-4 text-center">
                              <button className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">View All Records</button>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors">
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
                                  <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">View</button>
                                </div>
                              ))}
                            </div>
                        </div>

                        {/* Interactive Report Card */}
                        <div className={`bg-gradient-to-br from-${department.themeColor}-600 to-${department.themeColor}-800 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden ${reportConfig.isOpen ? 'print:hidden' : ''}`}>
                            <div className="relative z-10 flex flex-col h-full">
                              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                                <FileText className="w-5 h-5" /> Generate Performance Report
                              </h3>
                              <p className="text-white/80 mb-6 text-sm">Select a period to create a PDF report.</p>
                              
                              <div className="space-y-4 mt-auto">
                                <div className="relative">
                                  <select 
                                    value={reportConfig.period}
                                    onChange={(e) => setReportConfig({...reportConfig, period: e.target.value})}
                                    className="w-full appearance-none bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:bg-white/20 transition-all cursor-pointer"
                                  >
                                    <option className="text-gray-900">Monthly</option>
                                    <option className="text-gray-900">Quarterly</option>
                                    <option className="text-gray-900">Semi-Annually</option>
                                    <option className="text-gray-900">Annually</option>
                                    <option className="text-gray-900">Custom</option>
                                  </select>
                                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-80" />
                                </div>

                                {reportConfig.period === 'Custom' && (
                                  <div className="flex gap-2 animate-in slide-in-from-top-2">
                                    <div className="relative flex-1">
                                      <input 
                                        type="date" 
                                        value={reportConfig.startDate}
                                        onChange={(e) => setReportConfig({...reportConfig, startDate: e.target.value})}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white/20"
                                      />
                                    </div>
                                    <div className="relative flex-1">
                                      <input 
                                        type="date" 
                                        value={reportConfig.endDate}
                                        onChange={(e) => setReportConfig({...reportConfig, endDate: e.target.value})}
                                        className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white/20"
                                      />
                                    </div>
                                  </div>
                                )}

                                <button 
                                  onClick={() => setReportConfig({...reportConfig, isOpen: true})}
                                  className="w-full bg-white text-gray-900 px-4 py-3 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-md"
                                >
                                  <Printer className="w-4 h-4" /> Preview & Download
                                </button>
                              </div>
                            </div>
                            
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
                        </div>
                      </div>
                    </>
                  )}
               </>
             )}
             
           </div>
        </main>
      </div>

      {/* Floating Action Button for Mobile AI */}
      <button 
        onClick={onOpenAI}
        className={`lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-${department.themeColor}-600 text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:scale-105 transition-transform ${reportConfig.isOpen ? 'print:hidden' : ''}`}
      >
        <GraduationCap className="w-6 h-6" />
      </button>

      {/* Report Preview Modal */}
      {reportConfig.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm bg-black/70 print:static print:bg-white print:p-0 print:block print:h-auto print:absolute print:inset-0 print:z-[9999]">
           <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl w-full max-w-4xl h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 print:shadow-none print:w-full print:max-w-none print:h-auto print:overflow-visible print:rounded-none">
              
              {/* Header Actions - Hidden in Print */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center print:hidden">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       <FileText className="w-5 h-5 text-indigo-600" /> Report Preview
                    </h3>
                    <p className="text-xs text-gray-500">Review content before printing.</p>
                 </div>
                 <div className="flex items-center gap-2">
                    <button onClick={handleDownloadReport} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                       <Download className="w-4 h-4" /> Save PDF
                    </button>
                    <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                       <Printer className="w-4 h-4" /> Print
                    </button>
                    <button onClick={() => setReportConfig({...reportConfig, isOpen: false})} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                       <X className="w-6 h-6" />
                    </button>
                 </div>
              </div>

              {/* PDF/Paper Preview Area - Always Light Mode for printing simulation */}
              <div className="flex-1 overflow-y-auto p-8 bg-gray-200 dark:bg-gray-900 flex justify-center print:overflow-visible print:p-0 print:block print:bg-white print:h-auto">
                 <div id="report-content" className="bg-white text-black w-full max-w-[21cm] min-h-[29.7cm] p-12 shadow-xl print:shadow-none print:w-full print:max-w-none print:p-0 print:mx-0 print:my-0">
                    
                    {/* Report Header */}
                    <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8 print:break-inside-avoid break-inside-avoid">
                       <div>
                          <h1 className="text-3xl font-bold uppercase tracking-tight text-indigo-900">{department.name} Report</h1>
                          <p className="text-sm text-gray-600 mt-1">Generated by GlobalTrade BI</p>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-bold text-gray-800">{reportConfig.period}</p>
                          <p className="text-sm text-gray-500">
                             {reportConfig.period === 'Custom' 
                                ? `${reportConfig.startDate} to ${reportConfig.endDate}` 
                                : new Date().getFullYear()}
                          </p>
                       </div>
                    </div>

                    {/* Executive Summary */}
                    <div className="mb-8 print:break-inside-avoid break-inside-avoid">
                       <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase text-sm tracking-wider">Executive Summary</h3>
                       <p className="text-sm text-gray-700 leading-relaxed text-justify">
                          This report provides a comprehensive overview of performance metrics for the {department.name} department. 
                          Key indicators highlight a trend of <strong>{department.kpis[0]?.trend === 'up' ? 'positive growth' : 'stabilization'}</strong> in the primary operational sectors. 
                          Total assessed value currently stands at <strong>{department.kpis[0]?.value}</strong>, reflecting a {department.kpis[0]?.change} shift from the previous period.
                       </p>
                    </div>

                    {/* KPI Table */}
                    <div className="mb-8 print:break-inside-avoid break-inside-avoid">
                       <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase text-sm tracking-wider">Key Performance Indicators</h3>
                       <table className="w-full text-sm text-left border-collapse">
                          <thead>
                             <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="p-3 font-bold text-gray-700">Metric</th>
                                <th className="p-3 font-bold text-gray-700 text-right">Value</th>
                                <th className="p-3 font-bold text-gray-700 text-right">Change</th>
                                <th className="p-3 font-bold text-gray-700 text-center">Trend</th>
                             </tr>
                          </thead>
                          <tbody>
                             {department.kpis.map((kpi, i) => (
                                <tr key={i} className="border-b border-gray-200">
                                   <td className="p-3">{kpi.label}</td>
                                   <td className="p-3 text-right font-mono font-bold">{kpi.value}</td>
                                   <td className="p-3 text-right text-gray-600">{kpi.change}</td>
                                   <td className="p-3 text-center uppercase text-xs font-bold text-gray-500">{kpi.trend}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>

                    {/* Chart Snapshot (Visual Representation) */}
                    <div className="mb-8 print:break-inside-avoid break-inside-avoid">
                        <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase text-sm tracking-wider">Performance Visualization</h3>
                        <div className="h-64 bg-gray-50 border border-gray-200 rounded flex items-center justify-center relative">
                           {/* Simplified SVG Chart for Print */}
                           <svg viewBox="0 0 400 150" className="w-full h-full p-4">
                              <polyline 
                                 fill="none" 
                                 stroke="#4f46e5" 
                                 strokeWidth="3" 
                                 points="0,120 50,100 100,110 150,80 200,90 250,50 300,60 350,30 400,40" 
                              />
                              <rect x="0" y="148" width="400" height="2" fill="#333" />
                              <text x="0" y="145" fontSize="10" fill="#666">Period Start</text>
                              <text x="350" y="145" fontSize="10" fill="#666">Period End</text>
                           </svg>
                           <p className="absolute text-xs text-gray-400 bottom-2 right-4 italic">* Chart data simplified for print view</p>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="mb-8 print:break-inside-avoid break-inside-avoid">
                       <h3 className="text-lg font-bold text-gray-800 border-b border-gray-300 pb-2 mb-4 uppercase text-sm tracking-wider">Detailed Records</h3>
                       <table className="w-full text-xs text-left border-collapse">
                          <thead>
                             <tr className="bg-gray-100 border-b border-gray-300">
                                <th className="p-2 font-bold text-gray-700">Item</th>
                                <th className="p-2 font-bold text-gray-700">Category</th>
                                <th className="p-2 font-bold text-gray-700">Status</th>
                                <th className="p-2 font-bold text-gray-700 text-right">Value</th>
                             </tr>
                          </thead>
                          <tbody>
                             {department.summaryTableData.slice(0, 8).map((row, i) => (
                                <tr key={i} className="border-b border-gray-200">
                                   <td className="p-2">{row.item}</td>
                                   <td className="p-2 text-gray-600">{row.category}</td>
                                   <td className="p-2">{row.status}</td>
                                   <td className="p-2 text-right font-mono">{row.value}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>

                    {/* Signoff Area */}
                    <div className="mt-16 pt-8 border-t-2 border-gray-800 flex justify-between print:break-inside-avoid break-inside-avoid">
                       <div>
                          <p className="text-xs font-bold uppercase mb-8">Authorized Signature</p>
                          <div className="w-48 border-b border-black"></div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-bold uppercase mb-1">Date Generated</p>
                          <p className="text-sm">{new Date().toLocaleDateString()}</p>
                       </div>
                    </div>

                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Sales Processing Modal */}
      {isSalesProcessingOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60 print:hidden">
           {/* ... (Existing Sales Processing Modal Content) ... */}
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-5xl h-[80vh] shadow-2xl border border-gray-100 dark:border-gray-700 flex overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex flex-col">
                 <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       <ShoppingCart className="w-5 h-5 text-violet-600" /> Incoming Queue
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Pending orders from web & email</p>
                 </div>
                 <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {[...salesQueue, 
                      { id: 'MOCK-1', name: 'Bulk Chemical Solvent', price: 12000, cartQuantity: 10, unit: 'L', customerName: 'EcoClean Ltd', category: 'Industrial', image: 'https://images.unsplash.com/photo-1605333144182-4e45d625d886?auto=format&fit=crop&q=80&w=100' },
                      { id: 'MOCK-2', name: 'Cotton Yarn Spools', price: 450, cartQuantity: 500, unit: 'Units', customerName: 'TextilePro Inc', category: 'Manufacturing', image: 'https://images.unsplash.com/photo-1520188741372-a4282361d15c?auto=format&fit=crop&q=80&w=100' }
                    ].map((item: any, idx) => {
                       const isSelected = selectedSalesItem?.id === item.id || (item.poNumber && selectedSalesItem?.poNumber === item.poNumber);
                       return (
                       <div key={idx} onClick={() => fillFormFromQueue(item)} className={`p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all group ${isSelected ? 'border-violet-600 bg-violet-50 dark:bg-violet-900/20 ring-1 ring-violet-500' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-violet-500'}`}>
                          <div className="flex justify-between items-start mb-2">
                             <span className={`text-xs font-bold ${isSelected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-400'}`}>ORDER #{item.poNumber || (1000 + idx)}</span>
                             <span className="bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px] px-2 py-0.5 rounded-full font-bold">New</span>
                          </div>
                          <div className="flex gap-3">
                             <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                             <div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{item.customerName || 'Guest User'}</h4>
                                <p className="text-xs text-gray-500 line-clamp-1">{item.name}</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-white mt-1">Bir {(item.price * item.cartQuantity).toLocaleString()}</p>
                             </div>
                             <div className={`ml-auto self-center transition-opacity ${isSelected ? 'opacity-100 text-violet-600' : 'opacity-0 group-hover:opacity-100 text-gray-400'}`}><ChevronRight className="w-4 h-4" /></div>
                          </div>
                       </div>
                    )})}
                 </div>
              </div>
              <div className="w-2/3 flex flex-col bg-white dark:bg-gray-800">
                 <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div><h3 className="text-xl font-bold text-gray-900 dark:text-white">Process Sales Entry</h3><p className="text-sm text-gray-500">Convert incoming orders to Key Account status.</p></div>
                    <button onClick={() => setIsSalesProcessingOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-6 h-6" /></button>
                 </div>
                 <div className="flex-1 p-8 overflow-y-auto">
                    {/* ORDER CONTEXT SECTION */}
                    {selectedSalesItem && (
                        <div className="mb-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800">
                            <h4 className="text-sm font-bold text-indigo-800 dark:text-indigo-300 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Order Context
                            </h4>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold mb-1">Product</p>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">{selectedSalesItem.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold mb-1">Unit Price</p>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm">Bir {selectedSalesItem.price.toLocaleString()}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold mb-1">Order Details</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                        {salesForm.quantity} units <span className="text-gray-400 mx-1">×</span> Bir {selectedSalesItem.price.toLocaleString()} = <span className="text-indigo-600 dark:text-indigo-400 font-bold">Bir {(salesForm.quantity * selectedSalesItem.price).toLocaleString()}</span>
                                    </p>
                                    {salesForm.quantity !== selectedSalesItem.cartQuantity && (
                                        <p className="text-xs text-orange-500 mt-1 italic">
                                            (Original request: {selectedSalesItem.cartQuantity} units)
                                        </p>
                                    )}
                                </div>
                                {selectedSalesItem.notes && (
                                    <div className="col-span-2 pt-3 border-t border-indigo-200 dark:border-indigo-800/50 mt-1">
                                        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold mb-1">Additional Notes</p>
                                        <p className="text-gray-700 dark:text-gray-300 text-sm italic bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                            "{selectedSalesItem.notes}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleProcessSale} className="space-y-6 max-w-lg mx-auto">
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PO Number</label>
                             <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" required className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white font-mono" placeholder="PO-XXXX" value={salesForm.poNumber} onChange={e => setSalesForm({...salesForm, poNumber: e.target.value})} />
                             </div>
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                             <input 
                                type="number" 
                                required 
                                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white" 
                                placeholder="0" 
                                value={salesForm.quantity} 
                                onChange={e => {
                                    const qty = Number(e.target.value);
                                    const unitPrice = selectedSalesItem ? selectedSalesItem.price : 0;
                                    setSalesForm({
                                        ...salesForm, 
                                        quantity: qty,
                                        value: (qty * unitPrice).toString()
                                    });
                                }} 
                             />
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Client / Company Name</label>
                             <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input type="text" required className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white" placeholder="e.g. Acme Corp" value={salesForm.item} onChange={e => setSalesForm({...salesForm, item: e.target.value})} />
                             </div>
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Industry Category</label>
                             <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white" value={salesForm.category} onChange={e => setSalesForm({...salesForm, category: e.target.value})}>
                                <option>Retail</option><option>Manufacturing</option><option>Industrial</option><option>Construction</option><option>Wholesale</option>
                             </select>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Deal Value</label>
                             <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Bir</span>
                                <input type="text" required className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white" placeholder="0.00" value={salesForm.value.replace(/[^0-9.]/g, '')} onChange={e => setSalesForm({...salesForm, value: e.target.value})} />
                             </div>
                          </div>
                          <div>
                             <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Status</label>
                             <select className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none transition-all dark:text-white" value={salesForm.status} onChange={e => setSalesForm({...salesForm, status: e.target.value})}>
                                <option value="Good">Good Standing</option><option value="Stable">Stable</option><option value="Warning">Warning</option><option value="Critical">Critical</option>
                             </select>
                          </div>
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex justify-between"><span>Conversion Probability / Completion</span><span className="font-bold text-violet-600">{salesForm.completion}%</span></label>
                          <input type="range" min="0" max="100" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-600" value={salesForm.completion} onChange={e => setSalesForm({...salesForm, completion: Number(e.target.value)})} />
                       </div>
                       <div className="pt-4 flex gap-4">
                          <button type="button" onClick={() => setIsSalesProcessingOpen(false)} className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                          <button type="submit" className="flex-1 py-3 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 shadow-lg shadow-violet-200 dark:shadow-none transition-colors flex items-center justify-center gap-2"><Save className="w-5 h-5" /> Process & Add to Ledger</button>
                       </div>
                    </form>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Global Cart Drawer */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 z-[200] flex flex-col border-l border-gray-200 dark:border-gray-700 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} ${reportConfig.isOpen ? 'print:hidden' : ''}`}>
         <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2">
               <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
               <h3 className="font-bold text-gray-900 dark:text-white">Active Order Queue</h3>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
               <div className="text-center py-10 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Order queue is empty.</p>
               </div>
            ) : (
               cart.map((item, idx) => (
                 <div key={`${item.id}-${item.customerId}-${idx}`} className="flex gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id, item.customerId)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                       </div>
                       
                       {/* Customer Badge */}
                       <div className="flex items-center gap-1 mb-2">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-blue-600 dark:text-blue-400 truncate font-medium">{item.customerName || 'Unknown Customer'}</span>
                       </div>

                       <div className="flex justify-between items-center">
                          <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded">
                             <button onClick={() => updateQuantity(item.id, item.customerId, -1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><Minus className="w-3 h-3" /></button>
                             <span className="px-2 text-sm text-gray-900 dark:text-white">{item.cartQuantity}</span>
                             <button onClick={() => updateQuantity(item.id, item.customerId, 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="text-right">
                             <span className="block text-sm font-bold text-gray-900 dark:text-white">Bir {(item.price * item.cartQuantity).toLocaleString()}</span>
                             <span className="text-[10px] text-gray-400">{item.unit}</span>
                          </div>
                       </div>
                    </div>
                 </div>
               ))
            )}
         </div>

         <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-4">
               <span className="text-gray-500">Total Value</span>
               <span className="text-xl font-bold text-gray-900 dark:text-white">Bir {cartTotal.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-none"
            >
               Process Orders
            </button>
         </div>
      </div>

      {/* Global Checkout Modal */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm print:hidden">
           <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-8 relative">
              {orderSuccess ? (
                 <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                       <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Request Sent!</h2>
                    <p className="text-gray-500">Your order has been forwarded to the Sales Department for processing.</p>
                 </div>
              ) : (
                 <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Submit Order Request</h2>
                  <form onSubmit={submitOrder} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Order (PO) Number</label>
                        <input type="text" name="poNumber" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. PO-9923" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Address</label>
                        <select name="shippingAddress" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white outline-none">
                           <option>Main Warehouse - New York, NY</option>
                           <option>Distribution Center - Chicago, IL</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Notes</label>
                        <textarea name="notes" className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" rows={3}></textarea>
                     </div>
                     
                     <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Total Amount</span>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Bir {cartTotal.toLocaleString()}</span>
                     </div>

                     <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setIsOrderModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none">Submit Request</button>
                     </div>
                  </form>
                 </>
              )}
           </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
