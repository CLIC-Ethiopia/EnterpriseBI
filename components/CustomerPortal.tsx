
import React, { useState } from 'react';
import { CustomerSpecificData, Product, CartItem, Order, RegisteredCustomer } from '../types';
import { 
  ShoppingBag, CreditCard, Clock, Package, CheckCircle, Truck, 
  Search, Filter, Plus, Minus, X, ChevronRight, FileText, Info, GraduationCap,
  Users, UserPlus, Trash2, ShoppingCart
} from 'lucide-react';

interface CustomerPortalProps {
  data: CustomerSpecificData;
  onOpenAI: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomerPortal: React.FC<CustomerPortalProps> = ({ 
  data, 
  onOpenAI,
  cart,
  setCart,
  isCartOpen,
  setIsCartOpen
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'orders' | 'customers'>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Customer Management State
  const [customers, setCustomers] = useState<RegisteredCustomer[]>([
    { id: 'CUST-001', name: 'MegaCorp Industries', email: 'procurement@megacorp.com', type: 'Platinum', totalOrders: 145, totalSpent: 1250000 },
    { id: 'CUST-002', name: 'Apex Textiles', email: 'orders@apextextiles.co', type: 'Gold', totalOrders: 89, totalSpent: 850000 },
    { id: 'CUST-003', name: 'Global Chem', email: 'supply@globalchem.net', type: 'Silver', totalOrders: 42, totalSpent: 320000 },
    { id: 'CUST-004', name: 'FastFashion Inc.', email: 'buying@fastfashion.com', type: 'Bronze', totalOrders: 12, totalSpent: 45000 },
  ]);
  const [isCustomerSelectModalOpen, setIsCustomerSelectModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);
  const [selectedCustomerIdForCart, setSelectedCustomerIdForCart] = useState<string>('');
  
  // Quick Add State (Cart Flow)
  const [isAddCustomerMode, setIsAddCustomerMode] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');

  // Full Register State (Registry Tab)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regType, setRegType] = useState<RegisteredCustomer['type']>('Bronze');

  // Cart Logic
  const initiateAddToCart = (product: Product) => {
    setPendingProduct(product);
    setIsCustomerSelectModalOpen(true);
    setSelectedCustomerIdForCart(customers[0]?.id || '');
    setIsAddCustomerMode(false);
  };

  const confirmAddToCart = () => {
    if (!pendingProduct || !selectedCustomerIdForCart) return;

    const customer = customers.find(c => c.id === selectedCustomerIdForCart);
    if (!customer) return;

    setCart(prev => {
      // Check if product exists for THIS customer
      const existing = prev.find(item => item.id === pendingProduct.id && item.customerId === customer.id);
      if (existing) {
        return prev.map(item => 
          (item.id === pendingProduct.id && item.customerId === customer.id) 
            ? {...item, cartQuantity: item.cartQuantity + 1} 
            : item
        );
      }
      return [...prev, {
        ...pendingProduct, 
        cartQuantity: 1, 
        customerId: customer.id, 
        customerName: customer.name
      }];
    });

    setIsCustomerSelectModalOpen(false);
    setPendingProduct(null);
    setIsCartOpen(true);
  };

  const addNewCustomerInline = () => {
    if (!newCustomerName || !newCustomerEmail) return;
    const newId = `CUST-${Math.floor(Math.random() * 10000)}`;
    const newCust: RegisteredCustomer = {
      id: newId,
      name: newCustomerName,
      email: newCustomerEmail,
      type: 'Bronze',
      totalOrders: 0,
      totalSpent: 0
    };
    setCustomers([...customers, newCust]);
    setSelectedCustomerIdForCart(newId);
    setIsAddCustomerMode(false);
    setNewCustomerName('');
    setNewCustomerEmail('');
  };

  const handleRegisterCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail) return;
    
    const newId = `CUST-${Math.floor(Math.random() * 10000)}`;
    const newCust: RegisteredCustomer = {
      id: newId,
      name: regName,
      email: regEmail,
      type: regType,
      totalOrders: 0,
      totalSpent: 0
    };
    
    setCustomers([...customers, newCust]);
    setIsRegisterModalOpen(false);
    setRegName('');
    setRegEmail('');
    setRegType('Bronze');
  };

  const removeFromCart = (itemId: string, custId?: string) => {
    setCart(prev => prev.filter(item => !(item.id === itemId && item.customerId === custId)));
  };

  const updateQuantity = (itemId: string, custId: string | undefined, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === itemId && item.customerId === custId) {
        const newQty = Math.max(1, item.cartQuantity + delta);
        return {...item, cartQuantity: newQty};
      }
      return item;
    }));
  };

  const handleDeleteCustomer = (id: string) => {
    if (confirm('Are you sure you want to remove this customer?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.cartQuantity), 0);

  const handleCheckout = () => {
    setIsOrderModalOpen(true);
    setIsCartOpen(false);
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => {
        setIsOrderModalOpen(false);
        setOrderSuccess(false);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-blue-200 text-sm font-medium mb-1">Available Credit</p>
            <h3 className="text-3xl font-bold">Bir {data.availableCredit.toLocaleString()}</h3>
            <div className="mt-4 flex items-center text-xs text-blue-100 bg-white/10 w-fit px-2 py-1 rounded">
              <CreditCard className="w-3 h-3 mr-1" />
              Limit: Bir {data.creditLimit.toLocaleString()}
            </div>
          </div>
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
              <CreditCard className="w-32 h-32" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Outstanding Balance</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Bir {data.outstandingBalance.toLocaleString()}</h3>
            </div>
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-4">Due within 30 days</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Registered Clients</p>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{customers.length}</h3>
            </div>
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <p className="text-xs text-green-600 dark:text-green-400 mt-4 font-medium">Active Accounts</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('shop')}
          className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'shop' ? 'bg-white dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
        >
          Product Catalog
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'orders' ? 'bg-white dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
        >
          Order History
        </button>
        <button 
          onClick={() => setActiveTab('customers')}
          className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeTab === 'customers' ? 'bg-white dark:bg-gray-800 border-x border-t border-gray-200 dark:border-gray-700 text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
        >
          Registered Customers
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'shop' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.products.map(product => (
              <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-md transition-all">
                <div className="h-40 w-full overflow-hidden relative">
                   <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                   {product.stockStatus === 'Low Stock' && (
                     <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-medium">Low Stock</span>
                   )}
                   {product.stockStatus === 'Out of Stock' && (
                     <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">Out of Stock</span>
                   )}
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">{product.category}</span>
                    <span className="text-xs text-gray-400">{product.id}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Bir {product.price}</span>
                      <span className="text-xs text-gray-400 ml-1">/ {product.unit.split(' ')[0]}</span>
                    </div>
                    <div className="flex gap-2">
                       <button onClick={() => setSelectedProduct(product)} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                          <Info className="w-5 h-5" />
                       </button>
                       <button 
                         onClick={() => initiateAddToCart(product)}
                         disabled={product.stockStatus === 'Out of Stock'}
                         className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white p-2 rounded-lg transition-colors"
                       >
                          <Plus className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Order ID</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Items</th>
                    <th className="px-6 py-4 font-medium">PO Number</th>
                    <th className="px-6 py-4 font-medium text-right">Total</th>
                    <th className="px-6 py-4 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                   {data.orders.map(order => (
                     <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                       <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{order.id}</td>
                       <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{order.date}</td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                           order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                           order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                           order.status === 'Shipped' ? 'bg-purple-100 text-purple-700' :
                           'bg-gray-100 text-gray-700'
                         }`}>
                           {order.status}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{order.items} Items</td>
                       <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{order.poNumber}</td>
                       <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">Bir {order.total.toLocaleString()}</td>
                       <td className="px-6 py-4 text-right">
                         <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs font-medium flex items-center justify-end gap-1">
                           Details <ChevronRight className="w-3 h-3" />
                         </button>
                       </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}

        {/* Registered Customers Tab */}
        {activeTab === 'customers' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
             <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <div>
                   <h3 className="font-bold text-gray-900 dark:text-white">Customer Registry</h3>
                   <div className="text-xs text-gray-500">Manage client list for ordering</div>
                </div>
                <button 
                  onClick={() => setIsRegisterModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <Plus className="w-3 h-3" /> Register Customer
                </button>
             </div>
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">Customer ID</th>
                    <th className="px-6 py-4 font-medium">Name / Email</th>
                    <th className="px-6 py-4 font-medium">Tier</th>
                    <th className="px-6 py-4 font-medium text-center">Orders</th>
                    <th className="px-6 py-4 font-medium text-right">Total Spent</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                   {customers.map(cust => (
                     <tr key={cust.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                       <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">{cust.id}</td>
                       <td className="px-6 py-4">
                          <p className="font-bold text-gray-900 dark:text-white">{cust.name}</p>
                          <p className="text-xs text-gray-500">{cust.email}</p>
                       </td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                           cust.type === 'Platinum' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                           cust.type === 'Gold' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                           cust.type === 'Silver' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                           'bg-orange-50 text-orange-800 border-orange-200'
                         }`}>
                           {cust.type}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">{cust.totalOrders}</td>
                       <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">Bir {cust.totalSpent.toLocaleString()}</td>
                       <td className="px-6 py-4 text-right">
                         <button 
                           onClick={() => handleDeleteCustomer(cust.id)}
                           className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                           title="Remove Customer"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </td>
                     </tr>
                   ))}
                   {customers.length === 0 && (
                      <tr>
                         <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No registered customers. Add one via cart flow or register button.</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
        )}
      </div>

      {/* Cart Drawer - Z-index elevated to 200 to clear BottomDock */}
      <div className={`fixed inset-y-0 right-0 w-96 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 z-[200] flex flex-col border-l border-gray-200 dark:border-gray-700 ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center gap-2">
               <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
               <h3 className="font-bold text-gray-900 dark:text-white">Active Order Queue</h3>
            </div>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
         </div>
         
         <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
               <div className="text-center py-10 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Order queue is empty.</p>
               </div>
            ) : (
               cart.map((item, idx) => (
                 <div key={`${item.id}-${item.customerId}-${idx}`} className="flex gap-4 border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <img src={item.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100 flex-shrink-0" alt="" />
                    <div className="flex-1 min-w-0">
                       <div className="flex justify-between items-start mb-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-1">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id, item.customerId)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                       </div>
                       
                       {/* Customer Badge */}
                       <div className="flex items-center gap-1 mb-2">
                          <Users className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-blue-600 dark:text-blue-400 truncate font-medium">{item.customerName || 'Unknown Customer'}</span>
                       </div>

                       <div className="flex justify-between items-center">
                          <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded">
                             <button onClick={() => updateQuantity(item.id, item.customerId, -1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><Minus className="w-3 h-3" /></button>
                             <span className="px-2 text-sm text-gray-900 dark:text-white">{item.cartQuantity}</span>
                             <button onClick={() => updateQuantity(item.id, item.customerId, 1)} className="px-2 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><Plus className="w-3 h-3" /></button>
                          </div>
                          <div className="text-right">
                             <span className="block text-sm font-bold text-gray-900 dark:text-white">Bir {(item.price * item.cartQuantity).toLocaleString()}</span>
                             <span className="text-[10px] text-gray-400">{item.unit}</span>
                          </div>
                       </div>
                    </div>
                 </div>
               ))
            )}
         </div>

         <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="flex justify-between items-center mb-4">
               <span className="text-gray-500">Total Value</span>
               <span className="text-xl font-bold text-gray-900 dark:text-white">Bir {cartTotal.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 dark:shadow-none"
            >
               Process Orders
            </button>
         </div>
      </div>

      {/* Customer Selection Modal (Add to Cart Flow) - Z-index elevated */}
      {isCustomerSelectModalOpen && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Who is ordering?</h3>
                  <button onClick={() => {setIsCustomerSelectModalOpen(false); setPendingProduct(null);}} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
               </div>

               {pendingProduct && (
                  <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-100 dark:border-gray-700">
                     <img src={pendingProduct.image} alt="" className="w-12 h-12 rounded object-cover" />
                     <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">{pendingProduct.name}</p>
                        <p className="text-xs text-gray-500">Bir {pendingProduct.price.toLocaleString()}</p>
                     </div>
                  </div>
               )}

               {!isAddCustomerMode ? (
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Registered Customer</label>
                        <select 
                           value={selectedCustomerIdForCart}
                           onChange={(e) => setSelectedCustomerIdForCart(e.target.value)}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                           <option value="" disabled>Choose a customer...</option>
                           {customers.map(c => (
                              <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                           ))}
                        </select>
                     </div>
                     <div className="flex items-center justify-between">
                        <button 
                           onClick={() => setIsAddCustomerMode(true)}
                           className="text-sm text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 hover:underline"
                        >
                           <UserPlus className="w-4 h-4" /> Add New Customer
                        </button>
                     </div>
                     <button 
                        onClick={confirmAddToCart}
                        disabled={!selectedCustomerIdForCart}
                        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                        Confirm & Add to Cart
                     </button>
                  </div>
               ) : (
                  <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company / Customer Name</label>
                        <input 
                           type="text" 
                           value={newCustomerName}
                           onChange={e => setNewCustomerName(e.target.value)}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder="e.g. New Ventures Ltd."
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input 
                           type="email" 
                           value={newCustomerEmail}
                           onChange={e => setNewCustomerEmail(e.target.value)}
                           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                           placeholder="contact@company.com"
                        />
                     </div>
                     <div className="flex gap-3 pt-2">
                        <button 
                           onClick={() => setIsAddCustomerMode(false)}
                           className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                        >
                           Cancel
                        </button>
                        <button 
                           onClick={addNewCustomerInline}
                           disabled={!newCustomerName || !newCustomerEmail}
                           className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
                        >
                           Save & Select
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      )}

      {/* Product Details Modal - Z-index elevated */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 relative">
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
              <div className="flex flex-col md:flex-row gap-6">
                 <div className="w-full md:w-1/2">
                    <img src={selectedProduct.image} className="w-full h-64 object-cover rounded-xl" alt={selectedProduct.name} />
                 </div>
                 <div className="w-full md:w-1/2">
                    <span className="text-blue-600 text-sm font-bold tracking-wide uppercase mb-2 block">{selectedProduct.category}</span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedProduct.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{selectedProduct.description}</p>
                    
                    <div className="space-y-2 mb-6">
                       {selectedProduct.specs.map((spec, i) => (
                          <div key={i} className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                             <span className="text-sm text-gray-500">{spec.label}</span>
                             <span className="text-sm font-medium text-gray-900 dark:text-white">{spec.value}</span>
                          </div>
                       ))}
                    </div>

                    <div className="flex items-center justify-between">
                       <span className="text-2xl font-bold text-gray-900 dark:text-white">Bir {selectedProduct.price}</span>
                       <button 
                         onClick={() => { initiateAddToCart(selectedProduct); setSelectedProduct(null); }}
                         className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
                       >
                          Add to Cart
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Checkout Modal - Z-index elevated */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-8 relative">
              {orderSuccess ? (
                 <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                       <CheckCircle className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Order Request Sent!</h2>
                    <p className="text-gray-500">Your account manager will review and confirm your PO shortly.</p>
                 </div>
              ) : (
                 <>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Submit Order Request</h2>
                  <form onSubmit={submitOrder} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Purchase Order (PO) Number</label>
                        <input type="text" required className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. PO-9923" />
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Shipping Address</label>
                        <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white outline-none">
                           <option>Main Warehouse - New York, NY</option>
                           <option>Distribution Center - Chicago, IL</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Notes</label>
                        <textarea className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" rows={3}></textarea>
                     </div>
                     
                     <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg flex justify-between items-center">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Total Amount</span>
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Bir {cartTotal.toLocaleString()}</span>
                     </div>

                     <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setIsOrderModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none">Submit Request</button>
                     </div>
                  </form>
                 </>
              )}
           </div>
        </div>
      )}

      {/* Customer Registration Modal (Registry Tab) - Z-index elevated */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
           <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Register New Customer</h3>
                 <button onClick={() => setIsRegisterModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleRegisterCustomer} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                    <input 
                       type="text" 
                       required
                       value={regName}
                       onChange={e => setRegName(e.target.value)}
                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="e.g. Acme Corp"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                    <input 
                       type="email" 
                       required
                       value={regEmail}
                       onChange={e => setRegEmail(e.target.value)}
                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-transparent text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="contact@acme.corp"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Tier</label>
                    <select 
                       value={regType}
                       onChange={e => setRegType(e.target.value as any)}
                       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                    >
                       <option value="Bronze">Bronze</option>
                       <option value="Silver">Silver</option>
                       <option value="Gold">Gold</option>
                       <option value="Platinum">Platinum</option>
                    </select>
                 </div>
                 <div className="flex gap-3 pt-4">
                    <button 
                       type="button"
                       onClick={() => setIsRegisterModalOpen(false)}
                       className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 font-medium"
                    >
                       Cancel
                    </button>
                    <button 
                       type="submit"
                       className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none"
                    >
                       Register Client
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default CustomerPortal;
