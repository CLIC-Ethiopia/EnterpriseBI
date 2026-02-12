
import React from 'react';
import { DepartmentData } from '../types';
import { 
  Package, BadgeDollarSign, TrendingUp, Users, ArrowRight, Banknote, 
  ShieldAlert, Database, LayoutDashboard, Activity, Calculator, Anchor
} from 'lucide-react';

interface DepartmentCarouselProps {
  departments: DepartmentData[];
  onSelect: (dept: DepartmentData) => void;
}

const DepartmentCarousel: React.FC<DepartmentCarouselProps> = ({ departments, onSelect }) => {
  
  const getIcon = (name: string) => {
    const props = { className: "w-8 h-8" };
    switch(name) {
      case 'Package': return <Package {...props} />;
      case 'BadgeDollarSign': return <BadgeDollarSign {...props} />;
      case 'Banknote': return <Banknote {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'Users': return <Users {...props} />;
      case 'LayoutDashboard': return <LayoutDashboard {...props} />;
      case 'Database': return <Database {...props} />;
      case 'ShieldAlert': return <ShieldAlert {...props} />;
      case 'Calculator': return <Calculator {...props} />;
      case 'Anchor': return <Anchor {...props} />;
      default: return <Package {...props} />;
    }
  };

  const getThemeClasses = (color: string) => {
    switch(color) {
        case 'emerald': return {
            bg: 'bg-emerald-100 dark:bg-emerald-900/40',
            text: 'text-emerald-700 dark:text-emerald-300',
            border: 'border-emerald-200 dark:border-emerald-700',
            hover: 'group-hover:border-emerald-500 dark:group-hover:border-emerald-400',
            button: 'bg-emerald-600 hover:bg-emerald-700'
        };
        case 'blue': return {
            bg: 'bg-blue-100 dark:bg-blue-900/40',
            text: 'text-blue-700 dark:text-blue-300',
            border: 'border-blue-200 dark:border-blue-700',
            hover: 'group-hover:border-blue-500 dark:group-hover:border-blue-400',
            button: 'bg-blue-600 hover:bg-blue-700'
        };
        case 'cyan': return {
            bg: 'bg-cyan-100 dark:bg-cyan-900/40',
            text: 'text-cyan-700 dark:text-cyan-300',
            border: 'border-cyan-200 dark:border-cyan-700',
            hover: 'group-hover:border-cyan-500 dark:group-hover:border-cyan-400',
            button: 'bg-cyan-600 hover:bg-cyan-700'
        };
        case 'violet': return {
            bg: 'bg-violet-100 dark:bg-violet-900/40',
            text: 'text-violet-700 dark:text-violet-300',
            border: 'border-violet-200 dark:border-violet-700',
            hover: 'group-hover:border-violet-500 dark:group-hover:border-violet-400',
            button: 'bg-violet-600 hover:bg-violet-700'
        };
        case 'rose': return {
            bg: 'bg-rose-100 dark:bg-rose-900/40',
            text: 'text-rose-700 dark:text-rose-300',
            border: 'border-rose-200 dark:border-rose-700',
            hover: 'group-hover:border-rose-500 dark:group-hover:border-rose-400',
            button: 'bg-rose-600 hover:bg-rose-700'
        };
        case 'indigo': return {
            bg: 'bg-indigo-100 dark:bg-indigo-900/40',
            text: 'text-indigo-700 dark:text-indigo-300',
            border: 'border-indigo-200 dark:border-indigo-700',
            hover: 'group-hover:border-indigo-500 dark:group-hover:border-indigo-400',
            button: 'bg-indigo-600 hover:bg-indigo-700'
        };
        case 'slate': return {
            bg: 'bg-slate-100 dark:bg-slate-900/40',
            text: 'text-slate-700 dark:text-slate-300',
            border: 'border-slate-200 dark:border-slate-700',
            hover: 'group-hover:border-slate-500 dark:group-hover:border-slate-400',
            button: 'bg-slate-600 hover:bg-slate-700'
        };
        case 'gray': return {
            bg: 'bg-gray-200 dark:bg-gray-800',
            text: 'text-gray-700 dark:text-gray-300',
            border: 'border-gray-300 dark:border-gray-600',
            hover: 'group-hover:border-gray-500 dark:group-hover:border-gray-500',
            button: 'bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600'
        };
        default: return {
            bg: 'bg-gray-100 dark:bg-gray-900/40',
            text: 'text-gray-700 dark:text-gray-300',
            border: 'border-gray-200 dark:border-gray-700',
            hover: 'group-hover:border-gray-500',
            button: 'bg-gray-900'
        };
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
        <div>
           <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-3 tracking-tight">Departmental Catalogue</h2>
           <p className="text-gray-600 dark:text-gray-300 max-w-xl text-lg font-medium">
             Access specialized dashboards, operational tools, and secure data registries.
           </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
           <Activity className="w-4 h-4 text-green-500" />
           <span>System Status: <span className="text-green-600 dark:text-green-400">Online</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {departments.map((dept) => {
          const theme = getThemeClasses(dept.themeColor);
          const primaryKpi = dept.kpis?.[0];

          return (
            <div 
              key={dept.id} 
              onClick={() => onSelect(dept)}
              className={`group relative flex flex-col bg-white dark:bg-gray-800 rounded-2xl p-7 border-2 ${theme.border} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer overflow-hidden ${theme.hover}`}
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                 <div className={`p-4 rounded-xl shadow-inner ${theme.bg} ${theme.text}`}>
                    {getIcon(dept.iconName)}
                 </div>
                 {primaryKpi && (
                   <div className="text-right">
                     <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider mb-1">Key Metric</p>
                     <p className={`font-extrabold text-lg ${theme.text}`}>{primaryKpi.value}</p>
                   </div>
                 )}
              </div>

              {/* Content */}
              <div className="mb-8 flex-1">
                 <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                   {dept.name}
                 </h3>
                 <p className="text-gray-600 dark:text-gray-300 text-base font-medium leading-relaxed">
                   {dept.description}
                 </p>
              </div>

              {/* Footer / Action */}
              <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                 <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-gray-300">
                      {dept.id.substring(0,2)}
                    </div>
                 </div>
                 <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${theme.bg} ${theme.text} hover:opacity-80`}>
                    Access <ArrowRight className="w-4 h-4" />
                 </button>
              </div>

              {/* Decorative Background Blob */}
              <div className={`absolute -right-4 -bottom-4 w-32 h-32 rounded-full opacity-0 group-hover:opacity-10 transition-opacity ${theme.bg} blur-2xl pointer-events-none`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DepartmentCarousel;
