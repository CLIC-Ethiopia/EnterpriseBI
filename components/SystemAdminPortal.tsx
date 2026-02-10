import React, { useState } from 'react';
import { SystemAdminData, User } from '../types';
import { 
  Shield, Search, Plus, MoreHorizontal, Lock, Unlock, AlertTriangle, 
  CheckCircle, UserX, UserCheck, RefreshCw, Eye, Edit, X
} from 'lucide-react';

interface SystemAdminPortalProps {
  data: SystemAdminData;
}

const initialNewUser = {
  name: '',
  email: '',
  employeeId: '',
  department: 'Executive',
  role: '',
  pin: '',
  status: 'Active' as const
};

const SystemAdminPortal: React.FC<SystemAdminPortalProps> = ({ data }) => {
  const [users, setUsers] = useState<User[]>(data.users);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Add User State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newUser, setNewUser] = useState(initialNewUser);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (userId: number, newStatus: 'Active' | 'Suspended' | 'Locked') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  const handleResetPin = (userId: number) => {
    // In a real app, this would trigger an API call
    alert(`PIN reset instructions sent to user #${userId}`);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
        setUsers(prev => prev.map(u => u.id === selectedUser.id ? selectedUser : u));
    }
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    
    const userToAdd: User = {
        id,
        ...newUser,
        lastLogin: 'Never',
        status: 'Active'
    };

    setUsers(prev => [userToAdd, ...prev]);
    setIsAddModalOpen(false);
    setNewUser(initialNewUser);
  };

  const openEditModal = (user: User) => {
    setSelectedUser({ ...user });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
           <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
             <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Security Score</p>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">98/100</h3>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
           <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
             <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Active Users</p>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{users.filter(u => u.status === 'Active').length}</h3>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
           <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
             <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Locked Accounts</p>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{users.filter(u => u.status === 'Locked').length}</h3>
           </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
           <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
             <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
           </div>
           <div>
             <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">2FA Enabled</p>
             <h3 className="text-2xl font-bold text-gray-900 dark:text-white">85%</h3>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col min-h-[500px]">
         <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Manage login credentials and access levels.</p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
               <div className="relative flex-1 sm:flex-none">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-300 w-full sm:w-64 text-gray-900 dark:text-gray-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <button 
                 onClick={() => setIsAddModalOpen(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
               >
                  <Plus className="w-4 h-4" />
                  Add User
               </button>
            </div>
         </div>

         <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-100 dark:border-gray-700">
                  <tr>
                     <th className="px-6 py-4">Employee</th>
                     <th className="px-6 py-4">Department</th>
                     <th className="px-6 py-4">Role</th>
                     <th className="px-6 py-4">Login ID</th>
                     <th className="px-6 py-4">Last Login</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredUsers.map(user => (
                     <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-600 dark:text-gray-300 text-xs">
                                 {user.name.charAt(0)}
                              </div>
                              <div>
                                 <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                                 <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.department}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{user.role}</td>
                        <td className="px-6 py-4 font-mono text-gray-500 text-xs">{user.employeeId}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.lastLogin}</td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit
                              ${user.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                user.status === 'Locked' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                              {user.status === 'Active' && <CheckCircle className="w-3 h-3" />}
                              {user.status === 'Locked' && <Lock className="w-3 h-3" />}
                              {user.status === 'Suspended' && <AlertTriangle className="w-3 h-3" />}
                              {user.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openEditModal(user)} className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors" title="Edit User">
                                 <Edit className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleResetPin(user.id)} className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Reset PIN">
                                 <RefreshCw className="w-4 h-4" />
                              </button>
                              {user.status === 'Locked' ? (
                                 <button onClick={() => handleStatusChange(user.id, 'Active')} className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Unlock Account">
                                    <Unlock className="w-4 h-4" />
                                 </button>
                              ) : (
                                 <button onClick={() => handleStatusChange(user.id, 'Locked')} className="p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors" title="Lock Account">
                                    <Lock className="w-4 h-4" />
                                 </button>
                              )}
                              <button onClick={() => handleDeleteUser(user.id)} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete User">
                                 <UserX className="w-4 h-4" />
                              </button>
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         <div className="p-4 border-t border-gray-100 dark:border-gray-700 text-center text-xs text-gray-400">
            Showing {filteredUsers.length} of {users.length} records
         </div>
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && selectedUser && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit User Details</h3>
                  <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <form onSubmit={handleSaveUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input 
                           type="text" 
                           value={selectedUser.name} 
                           onChange={e => setSelectedUser({...selectedUser, name: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 outline-none"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                        <input 
                           type="text" 
                           value={selectedUser.employeeId} 
                           onChange={e => setSelectedUser({...selectedUser, employeeId: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 outline-none"
                        />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                     <select 
                        value={selectedUser.department}
                        onChange={e => setSelectedUser({...selectedUser, department: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white outline-none"
                     >
                        <option>Executive</option>
                        <option>Finance</option>
                        <option>Warehouse</option>
                        <option>Sales</option>
                        <option>HR</option>
                        <option>IT</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Access PIN</label>
                     <div className="relative">
                        <input 
                           type="text" 
                           value={selectedUser.pin} 
                           onChange={e => setSelectedUser({...selectedUser, pin: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 outline-none font-mono tracking-widest"
                        />
                        <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                     </div>
                  </div>
                  <div className="pt-6 flex gap-3">
                     <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                     <button type="submit" className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">Save Changes</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Add User Modal */}
      {isAddModalOpen && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add New User</h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <X className="w-5 h-5" />
                  </button>
               </div>
               <form onSubmit={handleAddUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                        <input 
                           type="text" 
                           required
                           value={newUser.name} 
                           onChange={e => setNewUser({...newUser, name: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                           placeholder="John Doe"
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Employee ID</label>
                        <input 
                           type="text" 
                           required
                           value={newUser.employeeId} 
                           onChange={e => setNewUser({...newUser, employeeId: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                           placeholder="EMP-XXXX"
                        />
                     </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input 
                       type="email" 
                       required
                       value={newUser.email} 
                       onChange={e => setNewUser({...newUser, email: e.target.value})}
                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                       placeholder="john.doe@globaltrade.co"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
                       <select 
                          value={newUser.department}
                          onChange={e => setNewUser({...newUser, department: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white outline-none"
                       >
                          <option>Executive</option>
                          <option>Finance</option>
                          <option>Warehouse</option>
                          <option>Sales</option>
                          <option>HR</option>
                          <option>IT</option>
                          <option>R&D</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role Title</label>
                       <input 
                          type="text" 
                          required
                          value={newUser.role} 
                          onChange={e => setNewUser({...newUser, role: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                          placeholder="e.g. Manager"
                       />
                    </div>
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial PIN</label>
                     <div className="relative">
                        <input 
                           type="text" 
                           required
                           value={newUser.pin} 
                           onChange={e => setNewUser({...newUser, pin: e.target.value})}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono tracking-widest"
                           placeholder="1234"
                        />
                        <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                     </div>
                  </div>
                  <div className="pt-6 flex gap-3">
                     <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                     <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">Create User</button>
                  </div>
               </form>
            </div>
         </div>
      )}

    </div>
  );
};

export default SystemAdminPortal;