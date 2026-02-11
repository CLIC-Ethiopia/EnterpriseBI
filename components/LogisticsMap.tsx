
import React, { useState } from 'react';
import { LogisticsRoute } from '../types';
import { Plane, Ship, Truck, Clock, CheckCircle2 } from 'lucide-react';

interface LogisticsMapProps {
  routes: LogisticsRoute[];
}

const LogisticsMap: React.FC<LogisticsMapProps> = ({ routes }) => {
  const [selectedRoute, setSelectedRoute] = useState<LogisticsRoute | null>(null);

  // Simplified World Map SVG Path (Abstract)
  const worldMapPath = "M20,50 Q40,40 50,50 T100,50 T150,40 T200,50 T250,60 T300,50 T350,40 T400,50 T450,60 T500,50 T550,40 T600,50 T650,60 T700,50 T750,40 T800,50"; 
  
  // Using a cleaner, stylized approach for the map background instead of complex geojson for performance/aesthetics
  // This represents landmasses abstractly
  const landmasses = [
    // North America
    <path d="M50,40 L120,40 L100,100 L40,90 Z" fill="currentColor" className="text-gray-200 dark:text-gray-700 opacity-30" />,
    // South America
    <path d="M110,110 L160,110 L140,190 L110,160 Z" fill="currentColor" className="text-gray-200 dark:text-gray-700 opacity-30" />,
    // Europe/Asia
    <path d="M220,40 L450,40 L430,120 L240,100 Z" fill="currentColor" className="text-gray-200 dark:text-gray-700 opacity-30" />,
    // Africa
    <path d="M220,110 L300,110 L280,180 L230,160 Z" fill="currentColor" className="text-gray-200 dark:text-gray-700 opacity-30" />,
    // Australia
    <path d="M450,150 L520,150 L500,190 L460,180 Z" fill="currentColor" className="text-gray-200 dark:text-gray-700 opacity-30" />
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-full relative overflow-hidden">
      <div className="flex justify-between items-start mb-6 z-10">
         <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Global Logistics Control Tower</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Live shipment tracking and route optimization.</p>
         </div>
         <div className="flex gap-2">
            <span className="flex items-center text-xs font-semibold text-blue-500"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Air</span>
            <span className="flex items-center text-xs font-semibold text-emerald-500"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Sea</span>
            <span className="flex items-center text-xs font-semibold text-orange-500"><span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span> Land</span>
         </div>
      </div>

      <div className="relative flex-1 bg-blue-50/50 dark:bg-gray-900/50 rounded-xl border border-blue-100 dark:border-gray-700 overflow-hidden w-full h-[400px]">
         {/* Map Visualization */}
         <svg viewBox="0 0 600 300" className="w-full h-full absolute inset-0 preserve-3d">
            {/* Background Grid */}
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
               <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-gray-800 opacity-20" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Landmasses */}
            <g transform="translate(0,0)">
               {landmasses.map((l, i) => <React.Fragment key={i}>{l}</React.Fragment>)}
            </g>

            {/* Routes */}
            {routes.map((route) => {
               // Calculate simple curve control point
               const cx = (route.coordinates.x1 + route.coordinates.x2) / 2;
               const cy = (route.coordinates.y1 + route.coordinates.y2) / 2 - 20; // Curve upwards
               
               // Scale percentages to SVG viewbox
               const x1 = route.coordinates.x1 * 6; // 0-100 -> 0-600
               const y1 = route.coordinates.y1 * 3; // 0-100 -> 0-300
               const x2 = route.coordinates.x2 * 6;
               const y2 = route.coordinates.y2 * 3;
               const cX = cx * 6;
               const cY = cy * 3;

               const pathD = `M${x1},${y1} Q${cX},${cY} ${x2},${y2}`;
               
               const color = route.type === 'Air' ? '#3b82f6' : route.type === 'Sea' ? '#10b981' : '#f97316';
               const isSelected = selectedRoute?.id === route.id;

               return (
                  <g key={route.id} onClick={() => setSelectedRoute(route)} className="cursor-pointer transition-all hover:opacity-100" style={{opacity: selectedRoute && !isSelected ? 0.3 : 1}}>
                     {/* Route Line Shadow */}
                     <path d={pathD} fill="none" stroke={color} strokeWidth={isSelected ? 3 : 1} strokeOpacity="0.3" />
                     {/* Route Line Dashed */}
                     <path d={pathD} fill="none" stroke={color} strokeWidth={isSelected ? 1.5 : 0.5} strokeDasharray="4,2" />
                     
                     {/* Animated Particle */}
                     {route.status === 'In Transit' && (
                        <circle r="3" fill={color}>
                           <animateMotion dur={route.type === 'Air' ? '3s' : '8s'} repeatCount="indefinite" path={pathD} />
                        </circle>
                     )}

                     {/* Endpoints */}
                     <circle cx={x1} cy={y1} r="2" fill="white" stroke={color} strokeWidth="1" />
                     <circle cx={x2} cy={y2} r="2" fill="white" stroke={color} strokeWidth="1" />
                  </g>
               );
            })}
         </svg>

         {/* Overlay Info Card */}
         {selectedRoute && (
            <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 w-64 animate-in slide-in-from-bottom-5">
               <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     {selectedRoute.type === 'Air' ? <Plane className="w-4 h-4" /> : selectedRoute.type === 'Sea' ? <Ship className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
                     {selectedRoute.id}
                  </h4>
                  <button onClick={(e) => {e.stopPropagation(); setSelectedRoute(null)}} className="text-gray-400 hover:text-gray-600">&times;</button>
               </div>
               <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                     <span className="text-gray-500">Origin:</span>
                     <span className="font-medium dark:text-gray-200">{selectedRoute.origin}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-gray-500">Destination:</span>
                     <span className="font-medium dark:text-gray-200">{selectedRoute.destination}</span>
                  </div>
                  <div className="flex justify-between">
                     <span className="text-gray-500">Cargo:</span>
                     <span className="font-medium dark:text-gray-200">{selectedRoute.goods}</span>
                  </div>
                   <div className="flex justify-between">
                     <span className="text-gray-500">Value:</span>
                     <span className="font-medium dark:text-gray-200">{selectedRoute.value}</span>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
                     {selectedRoute.status === 'In Transit' ? <Clock className="w-3 h-3 text-blue-500" /> : <CheckCircle2 className="w-3 h-3 text-green-500" />}
                     <span className={`font-bold ${selectedRoute.status === 'Delayed' ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>{selectedRoute.status}</span>
                  </div>
               </div>
            </div>
         )}
      </div>
    </div>
  );
};

export default LogisticsMap;
