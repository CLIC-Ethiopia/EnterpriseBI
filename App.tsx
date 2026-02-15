
import React, { useState, useEffect } from 'react';
import { DepartmentData, CartItem } from './types';
import { DEPARTMENTS } from './data';
import { fetchDepartments } from './services/api';
import Dashboard from './components/Dashboard';
import DepartmentCarousel from './components/DepartmentCarousel';
import AIAnalyst from './components/AIAnalyst';
import LandingPage from './components/LandingPage';
import InfoPage from './components/InfoPage';
import BottomDock from './components/BottomDock';
import DashboardPrintView from './components/DashboardPrintView';
import { LayoutGrid, Globe, Moon, Sun, HelpCircle, Database } from 'lucide-react';

type ViewState = 'LANDING' | 'SELECTION' | 'DASHBOARD' | 'INFO';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('LANDING');
  const [previousViewState, setPreviousViewState] = useState<ViewState>('LANDING');
  
  // Data State: Initialize with local fallback, update if API succeeds
  const [departments, setDepartments] = useState<DepartmentData[]>(DEPARTMENTS);
  const [isUsingLiveData, setIsUsingLiveData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [activeDepartment, setActiveDepartment] = useState<DepartmentData | null>(null);
  const [isAIAnalystOpen, setIsAIAnalystOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedDeptForLogin, setSelectedDeptForLogin] = useState<DepartmentData | null>(null);
  
  // Global Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Theme State - Default to Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Print View State
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);

  // Fetch Data from Google Sheets on Mount
  useEffect(() => {
    const initData = async () => {
      setIsLoading(true);
      const remoteData = await fetchDepartments();
      
      if (remoteData && remoteData.length > 0) {
        // MERGE STRATEGY:
        // 1. Identify which departments are in the Remote data
        const remoteIds = new Set(remoteData.map(d => d.id));
        
        // 2. Find departments that exist Locally but NOT remotely (e.g. New Features like Import Costing)
        const localOnlyDepts = DEPARTMENTS.filter(d => !remoteIds.has(d.id));
        
        // 3. Combine them
        const mergedData = [...remoteData, ...localOnlyDepts];

        // 4. Sort to match the order in DEPARTMENTS (Source of Truth for UI Order)
        mergedData.sort((a, b) => {
           const indexA = DEPARTMENTS.findIndex(d => d.id === a.id);
           const indexB = DEPARTMENTS.findIndex(d => d.id === b.id);
           // If a department is not in the local list (unexpected), put it at the end
           const valA = indexA === -1 ? 999 : indexA;
           const valB = indexB === -1 ? 999 : indexB;
           return valA - valB;
        });

        setDepartments(mergedData);
        setIsUsingLiveData(true);
        
        // If we were already viewing a department (e.g. hot reload), update the reference to the new object
        setActiveDepartment(prev => {
          if (!prev) return null;
          return mergedData.find(d => d.id === prev.id) || prev;
        });
      }
      setIsLoading(false);
    };

    initData();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleDepartmentSelect = (dept: DepartmentData) => {
    setSelectedDeptForLogin(dept);
    setShowLoginModal(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    if (selectedDeptForLogin) {
      setActiveDepartment(selectedDeptForLogin);
      setViewState('DASHBOARD');
      setShowLoginModal(false);
      setSelectedDeptForLogin(null);
    }
  };

  const handleLogout = () => {
    setActiveDepartment(null);
    setIsAIAnalystOpen(false);
    setViewState('SELECTION');
  };

  // Enforce security: Switching departments requires re-authentication
  const handleSwitchDepartment = (dept: DepartmentData) => {
    if (activeDepartment?.id === dept.id) return; // Already here
    
    // Trigger login flow for the new department
    setSelectedDeptForLogin(dept);
    setShowLoginModal(true);
  };

  const handleShowInfo = () => {
    setPreviousViewState(viewState);
    setViewState('INFO');
  };

  const handleBackFromInfo = () => {
    setViewState(previousViewState);
  };

  const handleHome = () => {
    if (viewState === 'DASHBOARD') {
      if (confirm('Return to department selection? You will be logged out.')) {
        handleLogout();
      }
    } else {
      setViewState('SELECTION');
    }
  };

  const handlePrint = () => {
    if (viewState === 'DASHBOARD' && activeDepartment) {
      setIsPrintViewOpen(true);
    } else {
      // If not in dashboard, default print
      window.print();
    }
  };

  return (
    <div className={`min-h-screen ${viewState === 'LANDING' ? '' : 'bg-gray-50 dark:bg-gray-900'} font-sans text-gray-900 dark:text-gray-100 selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300`}>
      
      {/* Background decoration for SELECTION view */}
      {viewState === 'SELECTION' && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-indigo-200/40 to-purple-200/40 dark:from-indigo-900/20 dark:to-purple-900/20 blur-3xl"></div>
          <div className="absolute top-[20%] -right-[10%] w-[50%] h-[60%] rounded-full bg-gradient-to-br from-blue-200/40 to-emerald-200/40 dark:from-blue-900/20 dark:to-emerald-900/20 blur-3xl"></div>
        </div>
      )}

      {/* View Controller */}
      {viewState === 'LANDING' && (
        <LandingPage onEnter={() => setViewState('SELECTION')} onShowInfo={handleShowInfo} />
      )}

      {viewState === 'INFO' && (
        <InfoPage onBack={handleBackFromInfo} />
      )}

      {viewState === 'DASHBOARD' && activeDepartment && (
        <>
          <div className="print-view-wrapper hidden">
             {/* This wrapper is hidden by default and shown ONLY during print via CSS in Dashboard.tsx */}
             {isPrintViewOpen && (
                <DashboardPrintView 
                  department={activeDepartment}
                  onClose={() => setIsPrintViewOpen(false)}
                />
             )}
          </div>
          
          <Dashboard 
            department={activeDepartment} 
            allDepartments={departments}
            onSwitchDepartment={handleSwitchDepartment}
            onOpenAI={() => setIsAIAnalystOpen(true)}
            onLogout={handleLogout}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            onShowInfo={handleShowInfo}
            cart={cart}
            setCart={setCart}
            isCartOpen={isCartOpen}
            setIsCartOpen={setIsCartOpen}
            onPrint={handlePrint}
          />
          <AIAnalyst 
            department={activeDepartment} 
            isOpen={isAIAnalystOpen} 
            onClose={() => setIsAIAnalystOpen(false)} 
          />
        </>
      )}

      {viewState === 'SELECTION' && (
        <div className="relative z-10 min-h-screen flex flex-col pb-32">
          {/* Header */}
          <header className="px-8 py-6 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewState('LANDING')}>
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                <Globe className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">GlobalTrade<span className="text-indigo-600 dark:text-indigo-400">BI</span></span>
            </div>
            <div className="flex items-center gap-4">
              {/* Data Source Indicator */}
              <div className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${isUsingLiveData ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'}`}>
                {isLoading ? (
                  <span className="animate-spin rounded-full h-2 w-2 border-2 border-current border-t-transparent"></span>
                ) : (
                  <Database className="w-3 h-3" />
                )}
                {isLoading ? 'Syncing...' : isUsingLiveData ? 'Live Sheet Data' : 'Local Data'}
              </div>

              <button 
                onClick={handleShowInfo}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                aria-label="Help & Info"
                title="Help & Info"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                Admin Access
              </button>
            </div>
          </header>

          {/* Selection Content */}
          <main className="flex-1 flex flex-col justify-center items-center py-12">
            <div className="text-center mb-16 px-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">System Operational</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                Enterprise Intelligence <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Simplified.</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                Real-time analytics for your entire supply chain. From chemical imports to textile distribution, gain clarity instantly.
              </p>
            </div>

            <DepartmentCarousel 
              departments={departments} 
              onSelect={handleDepartmentSelect} 
            />
          </main>
          
          <footer className="py-6 text-center text-sm text-gray-400 dark:text-gray-600 pb-24">
            &copy; 2024 GlobalTrade Logistics Inc. | Enterprise Grade BI Suite
          </footer>
        </div>
      )}

      {/* Mock Login Modal */}
      {showLoginModal && selectedDeptForLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 border border-gray-100 dark:border-gray-700">
            <div className={`h-2 w-full bg-${selectedDeptForLogin.themeColor}-600`}></div>
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className={`p-2 bg-${selectedDeptForLogin.themeColor}-100 dark:bg-${selectedDeptForLogin.themeColor}-900/30 rounded-lg`}>
                   <LayoutGrid className={`w-6 h-6 text-${selectedDeptForLogin.themeColor}-600 dark:text-${selectedDeptForLogin.themeColor}-400`} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Login</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Enter your credentials to access the <strong>{selectedDeptForLogin.name}</strong> dashboard.
              </p>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                  <input type="text" className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white" defaultValue="EMP-1001" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Access PIN</label>
                  <input type="password" className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white" defaultValue="1234" />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowLoginModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={`flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-gray-200 dark:shadow-none`}
                  >
                    Access Dashboard
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 px-8 py-4 text-xs text-center text-gray-500 border-t border-gray-100 dark:border-gray-700">
              Secure Connection • 256-bit Encryption
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Dock */}
      {viewState !== 'LANDING' && (
        <BottomDock 
          isDarkMode={isDarkMode} 
          toggleTheme={toggleTheme} 
          onShowInfo={handleShowInfo}
          onHome={handleHome}
          onLogout={handleLogout}
          showLogout={viewState === 'DASHBOARD'}
          onOpenCart={() => setIsCartOpen(true)}
          cartCount={cart.length}
          onPrint={handlePrint}
        />
      )}

    </div>
  );
};

export default App;
