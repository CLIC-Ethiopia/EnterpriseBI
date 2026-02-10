import React, { useRef } from 'react';
import { DepartmentData } from '../types';
import { ChevronLeft, ChevronRight, Package, BadgeDollarSign, TrendingUp, Users, ArrowRight, Banknote, ShieldAlert, Database, LayoutDashboard } from 'lucide-react';

interface DepartmentCarouselProps {
  departments: DepartmentData[];
  onSelect: (dept: DepartmentData) => void;
}

const DepartmentCarousel: React.FC<DepartmentCarouselProps> = ({ departments, onSelect }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getIcon = (name: string) => {
    switch(name) {
      case 'Package': return <Package className="w-8 h-8" />;
      case 'BadgeDollarSign': return <BadgeDollarSign className="w-8 h-8" />;
      case 'Banknote': return <Banknote className="w-8 h-8" />;
      case 'TrendingUp': return <TrendingUp className="w-8 h-8" />;
      case 'Users': return <Users className="w-8 h-8" />;
      case 'LayoutDashboard': return <LayoutDashboard className="w-8 h-8" />;
      case 'Database': return <Database className="w-8 h-8" />;
      case 'ShieldAlert': return <ShieldAlert className="w-8 h-8" />;
      default: return <Package className="w-8 h-8" />;
    }
  };

  const getColorClass = (color: string) => {
     switch(color) {
        case 'emerald': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 group-hover:bg-emerald-600 group-hover:text-white';
        case 'blue': return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:border-blue-400 group-hover:bg-blue-600 group-hover:text-white';
        case 'violet': return 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:border-violet-400 group-hover:bg-violet-600 group-hover:text-white';
        case 'rose': return 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800 hover:border-rose-400 group-hover:bg-rose-600 group-hover:text-white';
        case 'indigo': return 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:border-indigo-400 group-hover:bg-indigo-600 group-hover:text-white';
        case 'slate': return 'bg-slate-50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400 group-hover:bg-slate-600 group-hover:text-white';
        case 'gray': return 'bg-gray-50 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800 hover:border-gray-400 group-hover:bg-gray-600 group-hover:text-white';
        default: return 'bg-gray-50 text-gray-600 border-gray-200';
     }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-4">
      <div className="flex justify-between items-end mb-8 px-4">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Select Department</h2>
           <p className="text-gray-500 dark:text-gray-400 max-w-xl">Secure access points for departmental business intelligence dashboards. Please select your division to proceed.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => scroll('left')} className="p-3 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
             <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
           </button>
           <button onClick={() => scroll('right')} className="p-3 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
             <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
           </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-10 px-4 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {departments.map((dept) => (
          <div 
            key={dept.id} 
            onClick={() => onSelect(dept)}
            className="group relative flex-shrink-0 w-[350px] bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all cursor-pointer snap-center flex flex-col justify-between h-[450px]"
          >
            <div>
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${getColorClass(dept.themeColor)}`}>
                 {getIcon(dept.iconName)}
               </div>
               <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-gray-900 dark:group-hover:text-white">{dept.name}</h3>
               <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">{dept.description}</p>
            </div>
            
            <div className="space-y-4">
               <div className="flex -space-x-3 overflow-hidden border-b border-gray-100 dark:border-gray-700 pb-6">
                 <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800" src={`https://picsum.photos/seed/${dept.id}1/100/100`} alt=""/>
                 <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800" src={`https://picsum.photos/seed/${dept.id}2/100/100`} alt=""/>
                 <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800" src={`https://picsum.photos/seed/${dept.id}3/100/100`} alt=""/>
                 <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-300 ring-2 ring-white dark:ring-gray-800">+5</div>
               </div>
               <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-semibold group-hover:translate-x-1 transition-transform">
                 <span>Enter Dashboard</span>
                 <ArrowRight className="w-5 h-5" />
               </div>
            </div>

            {/* Hover glow effect */}
            <div className={`absolute inset-0 rounded-3xl border-2 border-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300 ${dept.themeColor === 'emerald' ? 'border-emerald-500' : dept.themeColor === 'blue' ? 'border-blue-500' : dept.themeColor === 'violet' ? 'border-violet-500' : dept.themeColor === 'rose' ? 'border-rose-500' : dept.themeColor === 'gray' ? 'border-gray-500' : 'border-indigo-500'}`}></div>
          </div>
        ))}
        {/* Padding element for right scroll */}
        <div className="w-12 flex-shrink-0"></div>
      </div>
    </div>
  );
};

export default DepartmentCarousel;