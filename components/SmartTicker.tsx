
import React from 'react';
import { TrendingUp, TrendingDown, Bell, Zap } from 'lucide-react';
import { TickerItem } from '../types';

interface SmartTickerProps {
  items: TickerItem[];
}

const SmartTicker: React.FC<SmartTickerProps> = ({ items }) => {
  return (
    <div className="bg-gray-900 text-white overflow-hidden py-2 border-b border-gray-700 relative z-20 print:hidden">
       <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
       <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
       
       <div className="flex animate-scroll whitespace-nowrap gap-8 items-center px-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest mr-4">
             <Zap className="w-3 h-3" /> Live Market Data
          </div>
          {/* Double map for smooth infinite scroll effect */}
          {[...items, ...items].map((item, i) => (
             <div key={i} className="flex items-center gap-3 text-sm font-medium">
                <span className="text-gray-400">{item.label}</span>
                <span className="text-white">{item.value}</span>
                {item.type !== 'alert' && (
                  <span className={`flex items-center text-xs ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                     {item.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                     {Math.abs(item.change)}%
                  </span>
                )}
                {item.type === 'alert' && (
                   <span className="text-orange-400 flex items-center text-xs gap-1">
                      <Bell className="w-3 h-3" /> Urgent
                   </span>
                )}
                <span className="text-gray-700 mx-2">|</span>
             </div>
          ))}
       </div>
       <style>{`
         @keyframes scroll {
           0% { transform: translateX(0); }
           100% { transform: translateX(-50%); }
         }
         .animate-scroll {
           animation: scroll 40s linear infinite;
         }
         .animate-scroll:hover {
           animation-play-state: paused;
         }
       `}</style>
    </div>
  );
};

export default SmartTicker;
