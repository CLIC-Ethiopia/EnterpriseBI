import React from 'react';
import { ArrowRight, BarChart3, ShieldCheck, Zap, Globe, Cpu, MousePointerClick } from 'lucide-react';

interface LandingPageProps {
  onEnter: () => void;
  onShowInfo: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onShowInfo }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden relative selection:bg-indigo-500 selection:text-white font-sans">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/50">
            <Globe className="w-5 h-5 text-white" />
          </div>
          GlobalTrade<span className="text-indigo-400">BI</span>
        </div>
        <button onClick={onShowInfo} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Documentation</button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-16 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          v2.4 System Online
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
           Data Intelligence for <br/> 
           <span className="text-indigo-500">Global Commerce</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Unify your supply chain, finance, and operations in one secure command center. 
          Experience real-time analytics tailored for the modern enterprise.
        </p>

        <button 
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transform hover:-translate-y-1"
        >
          Access Portal
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Dashboard Preview Mockup (Abstract) */}
        <div className="mt-16 relative max-w-5xl mx-auto rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] group cursor-pointer" onClick={onEnter}>
           <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-transparent to-gray-900 z-10"></div>
           {/* Abstract grid lines simulating a dashboard */}
           <div className="grid grid-cols-4 gap-4 p-6 h-full opacity-30 group-hover:opacity-50 transition-opacity duration-700">
              <div className="col-span-1 bg-gray-700 rounded-lg h-full animate-pulse"></div>
              <div className="col-span-3 grid grid-rows-2 gap-4 h-full">
                  <div className="row-span-1 grid grid-cols-3 gap-4">
                     <div className="bg-indigo-900/30 rounded-lg border border-indigo-500/30"></div>
                     <div className="bg-gray-700 rounded-lg"></div>
                     <div className="bg-gray-700 rounded-lg"></div>
                  </div>
                  <div className="row-span-1 bg-gray-800 rounded-lg border border-gray-700"></div>
              </div>
           </div>
           <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg transform scale-90 group-hover:scale-100 transition-transform">Preview Dashboard</span>
           </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 container mx-auto px-6 py-24 border-t border-gray-800">
        <h2 className="text-3xl font-bold text-center mb-16">System Capabilities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <FeatureCard 
             icon={<BarChart3 className="w-6 h-6 text-indigo-400" />}
             title="Cross-Departmental Analytics"
             desc="Aggregates data from HR, Sales, Inventory, and Finance into a single source of truth."
           />
           <FeatureCard 
             icon={<Cpu className="w-6 h-6 text-purple-400" />}
             title="AI-Powered Insights"
             desc="Integrated Gemini AI analyst to detect anomalies and forecast supply chain trends."
           />
           <FeatureCard 
             icon={<ShieldCheck className="w-6 h-6 text-emerald-400" />}
             title="Role-Based Security"
             desc="Granular access controls ensure stakeholders only see what they need to see."
           />
        </div>
      </div>

      {/* How it Works */}
      <div className="relative z-10 bg-gray-800/30 py-24">
         <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
               {/* Connecting Line (Desktop) */}
               <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-700 via-indigo-900 to-gray-700 z-0"></div>

               <Step 
                 number="01"
                 title="Select Portal"
                 desc="Choose your specific department from the secure carousel."
                 icon={<MousePointerClick className="w-6 h-6 text-white" />}
               />
               <Step 
                 number="02"
                 title="Authenticate"
                 desc="Use your Employee ID and Secure PIN to decrypt your dashboard."
                 icon={<ShieldCheck className="w-6 h-6 text-white" />}
               />
               <Step 
                 number="03"
                 title="Analyze"
                 desc="Interact with live data, generate reports, and ask AI for help."
                 icon={<Zap className="w-6 h-6 text-white" />}
               />
            </div>
         </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 container mx-auto px-6 py-12 text-center text-gray-500 text-sm border-t border-gray-800">
        <p>&copy; 2024 GlobalTrade Logistics Inc. | Enterprise Grade BI Suite</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-6 rounded-2xl bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 transition-colors">
     <div className="mb-4 bg-gray-900 w-12 h-12 rounded-lg flex items-center justify-center border border-gray-700 shadow-sm">
       {icon}
     </div>
     <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
     <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

const Step = ({ number, title, desc, icon }: { number: string, title: string, desc: string, icon: React.ReactNode }) => (
  <div className="relative z-10 flex flex-col items-center text-center">
     <div className="w-24 h-24 bg-gray-900 border-4 border-gray-800 rounded-full flex items-center justify-center mb-6 shadow-xl relative group hover:border-indigo-600 transition-colors">
        <div className="absolute inset-0 bg-indigo-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {icon}
        <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center border-4 border-gray-900 shadow-lg">
           {number}
        </div>
     </div>
     <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
     <p className="text-gray-400 max-w-xs">{desc}</p>
  </div>
);

export default LandingPage;