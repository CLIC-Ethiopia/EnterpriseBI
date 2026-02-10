import React, { useState } from 'react';
import { DepartmentData, DepartmentType } from '../types';
import { 
  Database, Table, FileJson, Code, RefreshCw, Save, Plus, Trash2, Edit2, 
  Search, Filter, ChevronDown, Check, X, Clipboard
} from 'lucide-react';

interface DataAdminPortalProps {
  allDepartments: DepartmentData[];
}

const DataAdminPortal: React.FC<DataAdminPortalProps> = ({ allDepartments }) => {
  const [selectedDeptId, setSelectedDeptId] = useState<DepartmentType>(DepartmentType.INVENTORY);
  const [dataType, setDataType] = useState<'kpis' | 'mainChartData' | 'summaryTableData' | 'products'>('kpis');
  const [showJson, setShowJson] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedDept = allDepartments.find(d => d.id === selectedDeptId);

  // Helper to get data based on selection
  const getCurrentData = () => {
    if (!selectedDept) return [];
    if (dataType === 'products' && selectedDept.customerData) return selectedDept.customerData.products;
    return (selectedDept as any)[dataType] || [];
  };

  const currentData = getCurrentData();

  // Helper to extract columns from data objects
  const getColumns = (data: any[]) => {
    if (!data || data.length === 0) return [];
    // Deep check for the first item to get all keys, filtering out complex objects/arrays for simple table view if needed
    // For this demo, we'll take top-level keys
    return Object.keys(data[0]).filter(key => typeof data[0][key] !== 'object' || Array.isArray(data[0][key]) === false);
  };

  const columns = getColumns(currentData);

  const handleEdit = (item: any) => {
    setEditItem({ ...item });
  };

  const handleSave = () => {
    // In a real app, this would dispatch an action or call an API
    console.log("Saving item:", editItem);
    setEditItem(null);
    alert("Data updated in local state (simulated).");
  };

  const filteredData = currentData.filter((item: any) => 
    JSON.stringify(item).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-600" />
            Central Data Registry
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and audit company-wide datasets.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowJson(!showJson)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${showJson ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
          >
            {showJson ? <Table className="w-4 h-4" /> : <Code className="w-4 h-4" />}
            {showJson ? "Table View" : "JSON View"}
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none transition-colors">
            <Plus className="w-4 h-4" />
            Add Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">Department</label>
            <div className="space-y-1">
              {allDepartments.filter(d => d.id !== DepartmentType.DATA_ADMIN && d.id !== DepartmentType.GENERAL).map(dept => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDeptId === dept.id ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {dept.name}
                </button>
              ))}
              <button
                  onClick={() => setSelectedDeptId(DepartmentType.CUSTOMER)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedDeptId === DepartmentType.CUSTOMER ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  Customer Data
                </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 block">Data Category</label>
            <div className="space-y-1">
              <button 
                onClick={() => setDataType('kpis')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${dataType === 'kpis' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
              >
                KPI Metrics
              </button>
              <button 
                onClick={() => setDataType('mainChartData')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${dataType === 'mainChartData' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
              >
                Performance Chart
              </button>
              <button 
                onClick={() => setDataType('summaryTableData')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${dataType === 'summaryTableData' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
              >
                Summary Records
              </button>
              {selectedDeptId === DepartmentType.CUSTOMER && (
                <button 
                  onClick={() => setDataType('products')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${dataType === 'products' ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                >
                  Product Catalog
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Data Area */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-[600px]">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-2xl">
             <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search records..." 
                  className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-64 text-gray-700 dark:text-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-mono bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-xs">{filteredData.length} records</span>
                <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300" title="Refresh">
                   <RefreshCw className="w-4 h-4" />
                </button>
             </div>
          </div>

          <div className="flex-1 overflow-auto">
             {showJson ? (
               <div className="p-4 h-full">
                 <textarea 
                   className="w-full h-full font-mono text-xs bg-gray-900 text-green-400 p-4 rounded-xl outline-none resize-none border border-gray-700"
                   value={JSON.stringify(filteredData, null, 2)}
                   readOnly
                 />
               </div>
             ) : (
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700 sticky top-0">
                     <tr>
                        {columns.map(col => (
                           <th key={col} className="px-6 py-3 font-medium border-b border-gray-200 dark:border-gray-700 whitespace-nowrap">{col}</th>
                        ))}
                        <th className="px-6 py-3 font-medium border-b border-gray-200 dark:border-gray-700 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                     {filteredData.map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                           {columns.map(col => (
                              <td key={`${i}-${col}`} className="px-6 py-4 text-gray-900 dark:text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                                {typeof row[col] === 'string' && row[col].length > 30 ? row[col].substring(0, 30) + '...' : row[col]}
                              </td>
                           ))}
                           <td className="px-6 py-4 text-right whitespace-nowrap">
                              <button onClick={() => handleEdit(row)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mr-3">
                                 <Edit2 className="w-4 h-4" />
                              </button>
                              <button className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">
                                 <Trash2 className="w-4 h-4" />
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Record</h3>
                 <button onClick={() => setEditItem(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="w-5 h-5" />
                 </button>
              </div>
              <div className="space-y-4">
                 {Object.keys(editItem).filter(key => typeof editItem[key] !== 'object').map(key => (
                    <div key={key}>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                       <input 
                         type="text" 
                         className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                         value={editItem[key]}
                         onChange={(e) => setEditItem({...editItem, [key]: e.target.value})}
                       />
                    </div>
                 ))}
              </div>
              <div className="mt-8 flex gap-3">
                 <button onClick={() => setEditItem(null)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                 <button onClick={handleSave} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Save Changes</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DataAdminPortal;