
import React, { useState } from 'react';
import { ReportMetric, ReportRequest } from '../types';
import { 
  FileBarChart, CheckSquare, GripVertical, Download, X, Plus, 
  Filter, Calendar, ArrowRight, Eye, Check, XCircle, FileText
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line 
} from 'recharts';

const DEFAULT_METRICS: ReportMetric[] = [
  { id: 'm1', name: 'Total Revenue', category: 'Finance', type: 'currency' },
  { id: 'm2', name: 'Cost of Goods Sold', category: 'Finance', type: 'currency' },
  { id: 'm3', name: 'Gross Margin %', category: 'Finance', type: 'percentage' },
  { id: 'm4', name: 'Sales Volume', category: 'Sales', type: 'number' },
  { id: 'm5', name: 'New Clients', category: 'Sales', type: 'number' },
  { id: 'm6', name: 'Inventory Turnover', category: 'Inventory', type: 'number' },
  { id: 'm7', name: 'Stock Value', category: 'Inventory', type: 'currency' },
  { id: 'm8', name: 'Headcount', category: 'HR', type: 'number' },
];

const DEFAULT_REQUESTS: ReportRequest[] = [
  { id: 'REQ-101', title: 'Q3 Regional Sales Performance', submittedBy: 'Tigist Bekele', department: 'Sales', dateSubmitted: '2024-10-24', priority: 'High', status: 'Pending', description: 'Detailed breakdown of sales by region including discount analysis.' },
  { id: 'REQ-102', title: 'Warehouse Capacity Forecast', submittedBy: 'Dawit Kebede', department: 'Inventory', dateSubmitted: '2024-10-23', priority: 'Normal', status: 'Pending', description: 'Projection of storage needs for upcoming holiday imports.' },
  { id: 'REQ-103', title: 'Audit Trail: Sep 2024', submittedBy: 'Anteneh Aseres', department: 'Accounting', dateSubmitted: '2024-10-20', priority: 'High', status: 'Approved', description: 'Monthly ledger audit for compliance review.' },
  { id: 'REQ-104', title: 'Employee Churn Rate', submittedBy: 'Hanna Alemu', department: 'HR', dateSubmitted: '2024-10-22', priority: 'Low', status: 'Rejected', description: 'Analysis of exit interviews and retention statistics.' },
];

interface ExecutiveReportingProps {
  metrics?: ReportMetric[];
  initialRequests?: ReportRequest[];
}

const ExecutiveReporting: React.FC<ExecutiveReportingProps> = ({ 
  metrics = DEFAULT_METRICS, 
  initialRequests = DEFAULT_REQUESTS 
}) => {
  const [activeTab, setActiveTab] = useState<'builder' | 'approvals'>('builder');
  
  // Builder State
  const [selectedMetrics, setSelectedMetrics] = useState<ReportMetric[]>([]);
  const [reportTitle, setReportTitle] = useState('New Ad-hoc Report');
  const [isExporting, setIsExporting] = useState(false);

  // Approval State
  const [requests, setRequests] = useState<ReportRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<ReportRequest | null>(null);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, metric: ReportMetric) => {
    e.dataTransfer.setData('metricId', metric.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const metricId = e.dataTransfer.getData('metricId');
    const metric = metrics.find(m => m.id === metricId);
    if (metric && !selectedMetrics.find(m => m.id === metric.id)) {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeMetric = (id: string) => {
    setSelectedMetrics(selectedMetrics.filter(m => m.id !== id));
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert(`Report "${reportTitle}" exported to Excel successfully!`);
    }, 1500);
  };

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
    setSelectedRequest(null);
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected' } : r));
    setSelectedRequest(null);
  };

  // Mock Data for Preview Chart based on selected metrics
  const previewData = [
    { name: 'Jan', val1: 4000, val2: 2400, val3: 2400 },
    { name: 'Feb', val1: 3000, val2: 1398, val3: 2210 },
    { name: 'Mar', val1: 2000, val2: 9800, val3: 2290 },
    { name: 'Apr', val1: 2780, val2: 3908, val3: 2000 },
    { name: 'May', val1: 1890, val2: 4800, val3: 2181 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex gap-2">
          <button 
            onClick={() => setActiveTab('builder')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'builder' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <FileBarChart className="w-4 h-4" /> Report Builder
          </button>
          <button 
            onClick={() => setActiveTab('approvals')}
            className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'approvals' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Approval Hub
            {requests.filter(r => r.status === 'Pending').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {requests.filter(r => r.status === 'Pending').length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* REPORT BUILDER TAB */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px]">
          
          {/* Left: Metrics Source */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Available Metrics</h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {metrics.map(metric => (
                <div 
                  key={metric.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, metric)}
                  className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-600 cursor-grab active:cursor-grabbing hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors flex items-center gap-3 group"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{metric.name}</p>
                    <span className="text-[10px] bg-gray-200 dark:bg-gray-600 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">{metric.category}</span>
                  </div>
                  <Plus className="w-4 h-4 text-indigo-500 ml-auto opacity-0 group-hover:opacity-100" />
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400 text-center">
              Drag items to the canvas area
            </div>
          </div>

          {/* Center: Canvas Drop Zone */}
          <div className="lg:col-span-6 flex flex-col">
            <div 
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed ${selectedMetrics.length === 0 ? 'border-gray-300 dark:border-gray-600' : 'border-indigo-400 dark:border-indigo-600 bg-indigo-50/10'} transition-all p-6 flex flex-col relative`}
            >
              {/* Report Header Config */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <input 
                  type="text" 
                  value={reportTitle} 
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full text-xl font-bold bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-400 mb-2"
                />
                <div className="flex gap-4">
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select className="pl-9 pr-4 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm border-none outline-none dark:text-gray-200">
                      <option>Last 30 Days</option>
                      <option>This Quarter</option>
                      <option>Year to Date</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select className="pl-9 pr-4 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm border-none outline-none dark:text-gray-200">
                      <option>All Regions</option>
                      <option>North America</option>
                      <option>EMEA</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Selected Columns Visualization */}
              <div className="flex-1 overflow-y-auto">
                {selectedMetrics.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400">
                    <FileBarChart className="w-16 h-16 mb-4 opacity-20" />
                    <p className="font-medium">Report Canvas Empty</p>
                    <p className="text-sm opacity-70">Drag metrics from the left sidebar to build your report.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <span>Column</span>
                      <span>Format</span>
                    </div>
                    {selectedMetrics.map((metric, idx) => (
                      <div key={`${metric.id}-${idx}`} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex justify-between items-center group animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">{idx + 1}</span>
                          <span className="font-semibold text-gray-800 dark:text-white">{metric.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded capitalize">{metric.type}</span>
                          <button onClick={() => removeMetric(metric.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleExport}
                  disabled={selectedMetrics.length === 0 || isExporting}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-none hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? 'Generating Excel...' : <><Download className="w-4 h-4" /> Export Report</>}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 flex flex-col">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Live Preview</h3>
            <div className="flex-1 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-2 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
              {selectedMetrics.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={previewData} margin={{top: 20, right: 10, left: -20, bottom: 0}}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{fontSize: '12px'}} />
                    <Bar dataKey="val1" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                    {selectedMetrics.length > 1 && <Bar dataKey="val2" fill="#10b981" radius={[4, 4, 0, 0]} />}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <span className="text-xs font-medium">Add metrics to view</span>
                </div>
              )}
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">Preview Data</p>
              <div className="space-y-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-6 w-full bg-gray-100 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPROVAL HUB TAB */}
      {activeTab === 'approvals' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[700px]">
          
          {/* List */}
          <div className="space-y-4 overflow-y-auto pr-2">
            {requests.map((req) => (
              <div 
                key={req.id}
                onClick={() => setSelectedRequest(req)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  selectedRequest?.id === req.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 shadow-md transform scale-[1.02]' 
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      req.priority === 'High' ? 'bg-red-500' : req.priority === 'Normal' ? 'bg-blue-500' : 'bg-gray-400'
                    }`}></span>
                    <span className="text-xs font-bold text-gray-400">{req.id}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    req.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {req.status}
                  </span>
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">{req.title}</h4>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{req.submittedBy} • {req.department}</span>
                  <span>{req.dateSubmitted}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail View */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 flex flex-col relative overflow-hidden">
            {selectedRequest ? (
              <>
                <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>
                
                <div className="mb-8 relative z-10">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{selectedRequest.title}</h2>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-lg">{selectedRequest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8 relative z-10">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Submitted By</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedRequest.submittedBy}</p>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400">{selectedRequest.department}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-1">Priority Level</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${selectedRequest.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedRequest.priority}</p>
                    </div>
                  </div>
                </div>

                {/* Simulated Report Content Preview */}
                <div className="flex-1 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 relative z-10">
                  <h4 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Content Preview
                  </h4>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4 flex items-center justify-center text-gray-400 text-sm">
                      [Chart Visualization Placeholder]
                    </div>
                  </div>
                </div>

                {selectedRequest.status === 'Pending' ? (
                  <div className="flex gap-4 mt-auto relative z-10">
                    <button 
                      onClick={() => handleReject(selectedRequest.id)}
                      className="flex-1 py-3 border border-red-200 dark:border-red-900/50 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-5 h-5" /> Reject Report
                    </button>
                    <button 
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none transition-colors flex items-center justify-center gap-2"
                    >
                      <Check className="w-5 h-5" /> Approve & Publish
                    </button>
                  </div>
                ) : (
                  <div className={`mt-auto text-center p-4 rounded-xl font-bold ${
                    selectedRequest.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    This report has been {selectedRequest.status.toLowerCase()}.
                  </div>
                )}
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
                <CheckSquare className="w-20 h-20 mb-4" />
                <p className="text-xl font-medium">Select a request to review</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveReporting;
