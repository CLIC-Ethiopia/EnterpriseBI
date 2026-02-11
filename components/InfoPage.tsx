import React from 'react';
import { 
  ArrowLeft, Book, Zap, LayoutGrid, Users, Mail, HelpCircle, 
  Server, Shield, Monitor, Smartphone, Lock, Database, Wifi, Laptop 
} from 'lucide-react';

interface InfoPageProps {
  onBack: () => void;
}

const InfoPage: React.FC<InfoPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-10 transition-colors"
        >
          <div className="p-1 rounded-full group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
             <ArrowLeft className="w-5 h-5" />
          </div>
          <span>Return to Application</span>
        </button>

        <div className="flex flex-col md:flex-row gap-12 mb-16">
          <div className="flex-1">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                <HelpCircle className="w-3 h-3" /> Documentation v2.4
             </div>
             <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 tracking-tight">
                GlobalTrade BI <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Knowledge Base</span>
             </h1>
             <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Welcome to the centralized help portal. Here you'll find guides on navigating dashboards, understanding KPI metrics, and leveraging our AI analysis tools.
             </p>
          </div>
          <div className="w-full md:w-1/3 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Need direct support?
             </h3>
             <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Our IT support team is available 24/7 for critical system issues.
             </p>
             <button className="w-full py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                Contact IT Support
             </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
           <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                 <LayoutGrid className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Navigating Dashboards</h3>
              <p className="text-gray-500 dark:text-gray-400">
                 Learn how to interpret main KPI cards, switch between departmental views, and use the filter controls to drill down into specific data sets.
              </p>
           </div>
           
           <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4">
                 <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI Analyst Features</h3>
              <p className="text-gray-500 dark:text-gray-400">
                 Our Gemini-powered AI Analyst can generate insights, forecast trends, and answer natural language queries about your data.
              </p>
           </div>

           <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                 <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">User Roles & Security</h3>
              <p className="text-gray-500 dark:text-gray-400">
                 Understanding access levels. Department heads have full write access, while staff roles may be limited to view-only or specific data entry points.
              </p>
           </div>

           <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 mb-4">
                 <Book className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report Generation</h3>
              <p className="text-gray-500 dark:text-gray-400">
                 How to export monthly and quarterly PDF reports. Customizing report parameters for board meetings and external audits.
              </p>
           </div>
        </div>

        {/* System Architecture Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">System Architecture</h2>
          
          <div className="bg-gray-900 rounded-3xl p-8 overflow-hidden relative shadow-2xl border border-gray-800">
            {/* Background Grid/Network Effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e5_1px,transparent_1px),linear-gradient(to_bottom,#4f46e5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Visual Diagram */}
              <div className="relative h-[500px] bg-gray-800/50 rounded-2xl border border-gray-700 p-6 flex items-center justify-center overflow-hidden">
                
                {/* Local Network Boundary Ring */}
                <div className="absolute inset-4 border-2 border-dashed border-gray-700 rounded-3xl opacity-50"></div>
                <div className="absolute top-6 right-6 flex items-center gap-2 text-xs font-mono text-gray-400 bg-gray-800 px-2 py-1 rounded border border-gray-700 z-30">
                   <Lock className="w-3 h-3 text-emerald-400" /> LOCAL INTRANET ONLY
                </div>

                {/* Connection Lines (CSS) */}
                <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    {/* Line to Top Left (Sys Admin) */}
                    <div className="absolute top-[20%] left-[20%] w-[30%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500 transform rotate-[35deg]"></div>
                    {/* Line to Top Right (Manager) */}
                    <div className="absolute top-[20%] right-[20%] w-[30%] h-[1px] bg-gradient-to-l from-transparent via-indigo-500/50 to-indigo-500 transform -rotate-[35deg]"></div>
                    
                    {/* Line to Bottom Right (Warehouse) */}
                    <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[1px] bg-gradient-to-l from-transparent via-indigo-500/50 to-indigo-500 transform rotate-[35deg]"></div>
                    {/* Line to Bottom Left (Finance) */}
                    <div className="absolute bottom-[20%] left-[20%] w-[30%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500 transform -rotate-[35deg]"></div>

                    {/* Line to Middle Left (HR) */}
                    <div className="absolute top-[50%] left-[10%] w-[40%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-indigo-500"></div>
                    {/* Line to Middle Right (Sales) */}
                    <div className="absolute top-[50%] right-[10%] w-[40%] h-[1px] bg-gradient-to-l from-transparent via-indigo-500/50 to-indigo-500"></div>
                </div>

                {/* Central Micro-Datacenter */}
                <div className="relative z-20 flex flex-col items-center">
                   {/* Radar Scan Effect */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-indigo-500/10 rounded-full animate-[spin_8s_linear_infinite]">
                      <div className="w-1/2 h-1/2 bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-tl-full"></div>
                   </div>
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-indigo-500/20 rounded-full animate-ping [animation-duration:3s]"></div>

                   <div className="w-20 h-20 bg-indigo-600 rounded-xl shadow-[0_0_30px_rgba(79,70,229,0.3)] flex items-center justify-center relative z-10">
                      <Server className="w-10 h-10 text-white" />
                      {/* Activity Indicator */}
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                   </div>
                   <div className="mt-4 text-center bg-gray-900/80 backdrop-blur px-3 py-1 rounded-lg border border-gray-700">
                     <p className="font-bold text-white text-xs">Micro-Datacenter</p>
                     <p className="text-indigo-300 text-[10px] uppercase tracking-wide">Primary Host</p>
                   </div>
                </div>

                {/* Connecting Clients */}
                
                {/* 1. System Admin PC (Top Left) */}
                <div className="absolute top-12 left-8 sm:left-12 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Monitor className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">System Admin PC</p>
                </div>
                
                {/* 2. Manager Laptop (Top Right) */}
                <div className="absolute top-12 right-8 sm:right-12 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Laptop className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">Manager Laptop</p>
                </div>

                 {/* 3. Finance Workstation (Bottom Left) */}
                 <div className="absolute bottom-12 left-8 sm:left-12 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Monitor className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">Finance Workstation</p>
                </div>
                
                {/* 4. Warehouse Tablet (Bottom Right) */}
                <div className="absolute bottom-12 right-8 sm:right-12 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Smartphone className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">Warehouse Tablet</p>
                </div>

                {/* 5. HR Desktop (Middle Left) */}
                <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-6 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Users className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">HR Desktop</p>
                </div>

                {/* 6. Sales Tablet (Middle Right) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-6 flex flex-col items-center z-20">
                   <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600 shadow-lg relative group hover:scale-110 transition-transform cursor-default bg-gradient-to-b from-gray-700 to-gray-800">
                      <Smartphone className="w-5 h-5 text-gray-300" />
                      <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-gray-700"></div>
                   </div>
                   <p className="mt-2 text-[10px] text-white font-semibold bg-gray-800/90 px-2 py-0.5 rounded border border-gray-600 shadow-sm whitespace-nowrap">Sales Tablet</p>
                </div>
                
              </div>

              {/* Description */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Server className="w-5 h-5 text-indigo-400" />
                    Micro-Datacenter Hardware
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     The entire BI platform runs on a high-performance, dedicated workstation acting as an on-premise server. 
                     This "Micro-Datacenter" ensures data sovereignty—keeping sensitive import/export records physically within the office.
                  </p>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                     <Wifi className="w-5 h-5 text-emerald-400" />
                     Local Network Deployment
                   </h3>
                   <p className="text-gray-400 text-sm leading-relaxed">
                      Designed for offline-first security. Access is restricted to devices connected to the secure office Intranet. 
                      No external cloud dependencies for core operations, reducing exposure to cyber threats.
                   </p>
                </div>

                <div>
                   <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                     <Database className="w-5 h-5 text-purple-400" />
                     Software Stack
                   </h3>
                   <div className="mt-3 space-y-3">
                      <div className="flex items-start gap-3 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                         <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                         <div>
                            <span className="font-bold text-white">Frontend Application</span>
                            <p className="text-xs text-gray-500 mt-0.5">React-based interactive dashboards for all departments.</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                         <div className="w-2 h-2 mt-1.5 rounded-full bg-green-400 flex-shrink-0"></div>
                         <div>
                            <span className="font-bold text-white">Local Database</span>
                            <p className="text-xs text-gray-500 mt-0.5">Encrypted SQL/NoSQL instance hosting inventory & financial records.</p>
                         </div>
                      </div>
                      <div className="flex items-start gap-3 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                         <div className="w-2 h-2 mt-1.5 rounded-full bg-red-400 flex-shrink-0"></div>
                         <div>
                            <span className="font-bold text-white">Security Layer</span>
                            <p className="text-xs text-gray-500 mt-0.5">Internal firewall, role-based auth, and access logging.</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-12">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Frequently Asked Questions</h2>
           <div className="space-y-4">
              <details className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-gray-900 dark:text-white">
                    <span>How often is the data updated?</span>
                    <span className="transition group-open:rotate-180">
                       <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                 </summary>
                 <div className="text-gray-500 dark:text-gray-400 px-5 pb-5">
                    Data is synced in real-time from the warehouse management system and financial ledgers. External market data updates every 15 minutes.
                 </div>
              </details>
              <details className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-gray-900 dark:text-white">
                    <span>Can I customize my dashboard view?</span>
                    <span className="transition group-open:rotate-180">
                       <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                 </summary>
                 <div className="text-gray-500 dark:text-gray-400 px-5 pb-5">
                    Yes, use the "Settings" button on your dashboard to toggle visibility of specific widgets and arrange the layout to your preference.
                 </div>
              </details>
              <details className="group bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
                 <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-gray-900 dark:text-white">
                    <span>How do I reset my PIN?</span>
                    <span className="transition group-open:rotate-180">
                       <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                    </span>
                 </summary>
                 <div className="text-gray-500 dark:text-gray-400 px-5 pb-5">
                    Contact your System Administrator. For security reasons, PIN resets cannot be performed via self-service at this time.
                 </div>
              </details>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;