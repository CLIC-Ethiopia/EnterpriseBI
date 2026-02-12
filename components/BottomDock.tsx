
import React from 'react';
import { 
  Globe, Printer, Info, Sun, Moon, Home, LogOut, ShoppingCart
} from 'lucide-react';

interface BottomDockProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
  onShowInfo: () => void;
  onHome: () => void;
  onLogout?: () => void;
  showLogout: boolean;
  onOpenCart?: () => void;
  cartCount?: number;
}

const BottomDock: React.FC<BottomDockProps> = ({ 
  isDarkMode, 
  toggleTheme, 
  onShowInfo, 
  onHome,
  onLogout,
  showLogout,
  onOpenCart,
  cartCount
}) => {
  const dockItems = [
    { icon: Home, label: 'Home', onClick: onHome },
    ...(onOpenCart ? [{ 
      icon: ShoppingCart, 
      label: 'Cart', 
      onClick: onOpenCart, 
      badge: cartCount 
    }] : []),
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
      
      {/* Left: Spacer to maintain layout balance */}
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
                 {/* Badge */}
                 {item.badge !== undefined && item.badge > 0 && (
                   <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-gray-800 z-20 shadow-sm animate-in zoom-in">
                     {item.badge}
                   </span>
                 )}

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

      {/* Right: Spacer (Dev Info removed) */}
      <div className="pointer-events-none w-1 h-1"></div>

    </div>
  );
};

export default BottomDock;
