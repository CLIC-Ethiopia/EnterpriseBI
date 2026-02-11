
import React, { useState } from 'react';
import { WarehouseProduct } from '../types';
import { Info, Box } from 'lucide-react';

interface WarehouseHeatmapProps {
  products: WarehouseProduct[];
}

const WarehouseHeatmap: React.FC<WarehouseHeatmapProps> = ({ products }) => {
  // Mocking Zone Data based on product locations
  // Assuming locations format "Zone X-YY"
  const zones = ['A', 'B', 'C', 'D', 'E', 'F'];
  const aisles = [1, 2, 3, 4, 5, 6, 7, 8];

  const getZoneCapacity = (zone: string, aisle: number) => {
    // Simulate capacity based on existing products in that zone
    const code = `Zone ${zone}-${aisle < 10 ? '0'+aisle : aisle}`;
    const productCount = products.filter(p => p.location.includes(zone)).length;
    // Add some randomness for visual variety if no exact match
    const randomFill = Math.random() * 100; 
    return Math.floor(randomFill);
  };

  const getFillColor = (percentage: number) => {
    if (percentage > 90) return 'bg-red-500';
    if (percentage > 70) return 'bg-orange-500';
    if (percentage > 40) return 'bg-emerald-500';
    if (percentage > 10) return 'bg-emerald-300';
    return 'bg-gray-200 dark:bg-gray-700';
  };

  const [hoveredCell, setHoveredCell] = useState<{zone: string, aisle: number, fill: number} | null>(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
       <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <Box className="w-5 h-5 text-indigo-500" /> Warehouse Utilization Heatmap
          </h3>
          <div className="flex gap-2 text-xs">
             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> &gt;90% Full</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-orange-500 rounded-sm"></div> 70-90%</div>
             <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Optimal</div>
          </div>
       </div>

       <div className="relative">
         <div className="grid grid-cols-9 gap-2">
            {/* Header Row */}
            <div className="col-span-1"></div>
            {aisles.map(a => (
               <div key={a} className="text-center text-xs font-bold text-gray-400">Aisle {a}</div>
            ))}

            {/* Rows */}
            {zones.map(z => (
               <React.Fragment key={z}>
                  <div className="flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 text-sm">Zone {z}</div>
                  {aisles.map(a => {
                     const fill = getZoneCapacity(z, a);
                     return (
                        <div 
                           key={`${z}-${a}`}
                           onMouseEnter={() => setHoveredCell({zone: z, aisle: a, fill})}
                           onMouseLeave={() => setHoveredCell(null)}
                           className={`h-10 rounded-md cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${getFillColor(fill)} opacity-80 hover:opacity-100 relative`}
                        >
                        </div>
                     );
                  })}
               </React.Fragment>
            ))}
         </div>

         {/* Tooltip Overlay */}
         {hoveredCell && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 text-white p-3 rounded-lg shadow-xl z-10 pointer-events-none text-xs">
               <p className="font-bold mb-1">Zone {hoveredCell.zone}, Aisle {hoveredCell.aisle}</p>
               <p>Utilization: {hoveredCell.fill}%</p>
               <p className="text-gray-400 mt-1">
                  {hoveredCell.fill > 90 ? 'Critical Capacity' : hoveredCell.fill < 20 ? 'Underutilized' : 'Optimal Storage'}
               </p>
            </div>
         )}
       </div>
    </div>
  );
};

export default WarehouseHeatmap;
