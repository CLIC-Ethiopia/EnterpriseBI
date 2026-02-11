import React, { useState } from 'react';
import { WarehouseProduct } from '../types';
import { X, Search, Filter, Package, Truck, Plus, Save, Loader2 } from 'lucide-react';
import { addProduct } from '../services/api';

interface WarehouseCatalogProps {
  products: WarehouseProduct[];
  onClose: () => void;
}

const initialProduct: Partial<WarehouseProduct> = {
  id: '',
  name: '',
  category: 'Raw Material',
  price: 0,
  unit: 'Unit',
  stockStatus: 'In Stock',
  description: '',
  quantity: 0,
  location: '',
  supplier: '',
  lastRestock: new Date().toISOString().split('T')[0],
  incoming: 0
};

const WarehouseCatalog: React.FC<WarehouseCatalogProps> = ({ products: initialProducts, onClose }) => {
  const [products, setProducts] = useState<WarehouseProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  
  // Add Product State
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<WarehouseProduct>>(initialProduct);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
        ...prev,
        [name]: name === 'price' || name === 'quantity' || name === 'incoming' ? Number(value) : value
    }));
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Auto-generate ID if empty (client-side fallback, server handles main gen)
    const productToSend = {
        ...newProduct,
        id: newProduct.id || `PROD-${Math.floor(Math.random() * 10000)}`,
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400', // Default placeholder
        specs: [] // Simplifying specs for this demo
    };

    const success = await addProduct(productToSend);
    
    if (success) {
        setProducts(prev => [productToSend as WarehouseProduct, ...prev]);
        setIsAdding(false);
        setNewProduct(initialProduct);
        alert('Product added successfully!');
    } else {
        alert('Failed to add product. Please check connection.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative w-full max-w-6xl h-[85vh] md:h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transform transition-all mx-auto border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
           <div className="flex items-center gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg">
                 <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                 <h2 className="text-xl font-bold text-gray-900 dark:text-white">Warehouse Product Catalogue</h2>
                 <p className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Real-time inventory levels and SKU details.</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <X className="w-6 h-6" />
           </button>
        </div>

        {/* Toolbar */}
        {!isAdding && (
            <div className="flex-shrink-0 p-4 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center bg-white dark:bg-gray-800">
            <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search by SKU, Name..." 
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {categories.map(cat => (
                    <button 
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${filterCategory === cat ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <button 
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors whitespace-nowrap"
            >
                <Plus className="w-4 h-4" />
                Add Product
            </button>
            </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50/50 dark:bg-gray-900/20 scroll-smooth">
           {isAdding ? (
               <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                   <div className="flex justify-between items-center mb-6">
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Product</h3>
                       <button onClick={() => setIsAdding(false)} className="text-sm text-gray-500 hover:underline">Cancel</button>
                   </div>
                   <form onSubmit={handleAddSubmit} className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Product ID (SKU)</label>
                               <input type="text" name="id" value={newProduct.id} onChange={handleInputChange} placeholder="Auto-generated if empty" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" />
                           </div>
                           <div>
                               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Product Name</label>
                               <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" />
                           </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Category</label>
                               <select name="category" value={newProduct.category} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                                   <option>Raw Fiber</option>
                                   <option>Raw Material</option>
                                   <option>Dyes & Pigments</option>
                                   <option>Process Chemicals</option>
                                   <option>Auxiliaries</option>
                                   <option>Fabric</option>
                                   <option>Textile Roll</option>
                                   <option>Yarn</option>
                               </select>
                           </div>
                           <div>
                               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Stock Status</label>
                               <select name="stockStatus" value={newProduct.stockStatus} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white">
                                   <option>In Stock</option>
                                   <option>Low Stock</option>
                                   <option>Out of Stock</option>
                               </select>
                           </div>
                       </div>

                       <div className="grid grid-cols-3 gap-4">
                           <div>
                               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Price</label>
                               <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" />
                           </div>
                           <div>
                               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Quantity</label>
                               <input type="number" name="quantity" value={newProduct.quantity} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" />
                           </div>
                           <div>
                               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Unit</label>
                               <input type="text" name="unit" value={newProduct.unit} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" placeholder="kg, L, Bale" />
                           </div>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                           <div>
                               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Location</label>
                               <input type="text" name="location" value={newProduct.location} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" placeholder="Zone A-01" />
                           </div>
                           <div>
                               <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Supplier</label>
                               <input type="text" name="supplier" value={newProduct.supplier} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white" />
                           </div>
                       </div>

                       <div>
                           <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Description</label>
                           <textarea name="description" value={newProduct.description} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none dark:text-white"></textarea>
                       </div>

                       <div className="pt-4 flex justify-end gap-3">
                           <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Cancel</button>
                           <button 
                             type="submit" 
                             disabled={isSubmitting}
                             className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
                           >
                               {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                               Save Product
                           </button>
                       </div>
                   </form>
               </div>
           ) : (
               <>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(product => (
                     <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full group">
                        <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                           <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                           <div className="absolute top-2 right-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                                 product.stockStatus === 'In Stock' ? 'bg-green-100/90 text-green-700' :
                                 product.stockStatus === 'Low Stock' ? 'bg-orange-100/90 text-orange-700' :
                                 'bg-red-100/90 text-red-700'
                              }`}>
                                 {product.stockStatus}
                              </span>
                           </div>
                           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                              <span className="text-white text-xs font-mono opacity-90 tracking-wide">{product.id}</span>
                           </div>
                        </div>
                        
                        <div className="p-4 flex-1 flex flex-col">
                           <div className="mb-2">
                              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">{product.category}</span>
                              <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 text-sm sm:text-base mt-1" title={product.name}>{product.name}</h3>
                           </div>
                           
                           <div className="space-y-2 mb-4 flex-1">
                              <div className="flex justify-between text-xs sm:text-sm border-b border-gray-50 dark:border-gray-700 pb-1">
                                 <span className="text-gray-500 dark:text-gray-400">Price/Unit</span>
                                 <span className="font-medium text-gray-900 dark:text-white">Bir {product.price.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs sm:text-sm border-b border-gray-50 dark:border-gray-700 pb-1">
                                 <span className="text-gray-500 dark:text-gray-400">Stock Qty</span>
                                 <span className={`font-bold ${product.quantity < 50 ? 'text-orange-500' : 'text-gray-900 dark:text-white'}`}>
                                    {product.quantity} <span className="text-xs font-normal text-gray-400">{product.unit.split(' ')[0]}s</span>
                                 </span>
                              </div>
                              <div className="flex justify-between text-xs sm:text-sm border-b border-gray-50 dark:border-gray-700 pb-1">
                                 <span className="text-gray-500 dark:text-gray-400">Location</span>
                                 <span className="font-medium text-gray-700 dark:text-gray-300">{product.location}</span>
                              </div>
                              <div className="flex justify-between text-xs sm:text-sm pb-1">
                                 <span className="text-gray-500 dark:text-gray-400">Supplier</span>
                                 <span className="font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]" title={product.supplier}>{product.supplier}</span>
                              </div>
                           </div>

                           {/* Status Footer */}
                           <div className="pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs">
                              {product.incoming > 0 ? (
                                 <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                    <Truck className="w-3 h-3" />
                                    <span className="font-semibold">+{product.incoming} In</span>
                                 </div>
                              ) : (
                                 <div className="text-gray-400 italic">No pending</div>
                              )}
                              <span className="text-gray-400">{product.lastRestock}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
               
               {filteredProducts.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                     <Package className="w-16 h-16 mb-4 opacity-20" />
                     <p className="text-lg">No products found matching your criteria.</p>
                  </div>
               )}
               </>
           )}
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end">
           <button onClick={onClose} className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors shadow-sm">
              Close Catalogue
           </button>
        </div>
      </div>
    </div>
  );
};

export default WarehouseCatalog;