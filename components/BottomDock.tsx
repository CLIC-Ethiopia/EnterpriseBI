import React from 'react';
import { 
  Globe, Printer, Info, Sun, Moon, Home, LogOut 
} from 'lucide-react';

interface BottomDockProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onShowInfo: () => void;
  onHome: () => void;
  onLogout?: () => void;
  showLogout: boolean;
}

const BottomDock: React.FC<BottomDockProps> = ({ 
  isDarkMode, 
  toggleTheme, 
  onShowInfo, 
  onHome,
  onLogout,
  showLogout
}) => {
  const dockItems = [
    { icon: Home, label: 'Home', onClick: onHome },
    { icon: Info, label: 'Documentation', onClick: onShowInfo },
    { icon: Printer, label: 'Print View', onClick: () => window.print() },
    { 
      icon: isDarkMode ? Sun : Moon, 
      label: isDarkMode ? 'Light Mode' : 'Dark Mode', 
      onClick: toggleTheme 
    },
    ...(showLogout && onLogout ? [{ icon: LogOut, label: 'Sign Out', onClick: onLogout }] : [])
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] pointer-events-none flex items-end justify-between px-6 pb-6 print:hidden">
      
      {/* Left: Spacer to maintain layout balance (Company info removed) */}
      <div className="pointer-events-none w-1 h-1"></div>

      {/* Center: Macbook-style Dock */}
      <div className="absolute left-1/2 transform -translate-x-1/2 bottom-4 pointer-events-auto max-w-[90vw]">
         <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-2xl px-4 py-3 shadow-2xl flex items-end gap-3 sm:gap-4">
            {dockItems.map((item, index) => (
               <button 
                 key={index}
                 onClick={item.onClick}
                 className="group relative flex flex-col items-center gap-1 transition-all duration-300 hover:-translate-y-2 focus:outline-none"
               >
                 {/* Tooltip */}
                 <span className="absolute -top-12 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 whitespace-nowrap pointer-events-none shadow-xl">
                   {item.label}
                   <span className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white transform rotate-45"></span>
                 </span>
                 
                 {/* Icon */}
                 <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm group-hover:shadow-[0_0_20px_rgba(79,70,229,0.5)] group-hover:scale-125 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 ease-out border border-gray-200 dark:border-gray-700 group-hover:border-indigo-500">
                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                 </div>
                 
                 {/* Dot indicator */}
                 <div className="w-1 h-1 rounded-full bg-gray-400 dark:bg-gray-600 group-hover:bg-indigo-500 transition-colors mt-1"></div>
               </button>
            ))}
         </div>
      </div>

      {/* Right: Dev Info - Reshaped to be wider and shorter */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200 dark:border-gray-800 rounded-2xl p-3 shadow-2xl pointer-events-auto hidden md:block transition-transform hover:scale-105 origin-bottom-right">
         <div className="flex items-baseline justify-end gap-3 mb-1">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">System Architect</span>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Prof. Frehun A. Demissie</h3>
         </div>
         <div className="flex items-center justify-end gap-3">
            <a href="mailto:frehun.demissie@gmail.com" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">frehun.demissie@gmail.com</a>
            <span className="text-gray-300 dark:text-gray-700 text-[10px]">|</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">+251 911 69 2277</p>
         </div>
      </div>

    </div>
  );
};

export default BottomDock;