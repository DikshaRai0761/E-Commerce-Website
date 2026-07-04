import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Plus, Pencil, Trash2, Sliders, AlertCircle, RefreshCw, X, FolderPlus } from 'lucide-react';
import { productAPI } from '../services/api.js';
import Button from '../components/Button.jsx';

export default function Admin({ id, user }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State for Adding / Editing
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null); // null means "Add Product", string ID means "Edit Product"
  
  // Field values
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [image, setImage] = useState('');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // 1. Guard check: Only admins are allowed here
  const isAdmin = user && user.isAdmin;

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Admin products loading error:", err);
      setError("Failed to fetch product list. Ensure your server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadProducts();
    }
  }, [isAdmin]);

  // Open the slide-over form for creating a new product
  const handleOpenCreateForm = () => {
    setEditingProductId(null);
    setName('');
    setPrice('');
    setDescription('');
    setCategory('Electronics');
    setImage('');
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  // Open the slide-over form for editing an existing product
  const handleOpenEditForm = (product) => {
    setEditingProductId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setDescription(product.description);
    setCategory(product.category);
    setImage(product.image);
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  // Handle Form Submission (Both CREATE and UPDATE)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    // Validations
    if (!name.trim() || !price || !description.trim() || !category) {
      setFormError("All fields are required.");
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      setFormError("Price must be a valid positive number.");
      return;
    }

    const payload = {
      name: name.trim(),
      price: parseFloat(price),
      description: description.trim(),
      category,
      image: image.trim() || undefined // If empty, server fallback handles it
    };

    try {
      if (editingProductId) {
        // Run UPDATE operation
        await productAPI.update(editingProductId, payload);
        setFormSuccess("Product updated successfully!");
      } else {
        // Run CREATE operation
        await productAPI.create(payload);
        setFormSuccess("Product added successfully!");
      }

      // Refresh list
      await loadProducts();

      // Close modal/slider after a brief success message delay
      setTimeout(() => {
        setIsFormOpen(false);
        setEditingProductId(null);
      }, 1000);
    } catch (err) {
      console.error("Form submit error:", err);
      setFormError(err.response?.data?.message || "Failed to submit product data.");
    }
  };

  // Handle Delete operation
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you absolutely sure you want to delete this product? This action is irreversible.")) {
      return;
    }

    try {
      await productAPI.delete(productId);
      // Reload catalogue
      await loadProducts();
    } catch (err) {
      console.error("Product deletion error:", err);
      alert("Error deleting product. Please try again.");
    }
  };

  // Render Access Denied if not an authorized administrator
  if (!isAdmin) {
    return (
      <div id={id} className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-xl space-y-6">
          <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-950 tracking-tight">Access Denied</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              This panel is restricted to administrative staff only. Please sign in with an administrator account to manage store inventories.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-3">
            <Button variant="primary" onClick={() => navigate('/auth')}>
              Sign In as Admin
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Go back Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Grid */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Admin Management</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Store Control Panel
            </h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadProducts} className="gap-1.5 hover:bg-slate-100">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
            <Button variant="primary" size="sm" onClick={handleOpenCreateForm} className="gap-1.5 shadow-md">
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </Button>
          </div>
        </div>

        {/* Dashboard Mini-Analytics bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
              {products.length}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Products</p>
              <h3 className="text-lg font-black text-slate-800 mt-0.5">Active Catalog Items</h3>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold">
              Online
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Database Sync</p>
              <h3 className="text-lg font-black text-slate-800 mt-0.5">Local Persistent JSON</h3>
            </div>
          </div>
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-bold">
              Role
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Staff Profile</p>
              <h3 className="text-lg font-black text-slate-800 mt-0.5 max-w-[200px] truncate">{user.name} (Admin)</h3>
            </div>
          </div>
        </div>

        {/* Main Products Grid Display */}
        {isLoading ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400 animate-pulse">
            Loading database files...
          </div>
        ) : error ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold">Catalogue Sync Error</h3>
            <p className="text-sm mt-2">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
            <Sliders className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800">No catalogue products</h3>
            <p className="text-sm mt-2 text-slate-500">Your store database contains no products. Add a product to seed your inventory.</p>
            <Button variant="primary" onClick={handleOpenCreateForm} className="mt-6 gap-2">
              <Plus className="w-4 h-4" />
              <span>Create First Product</span>
            </Button>
          </div>
        ) : (
          /* Responsive Table layout */
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Thumbnail</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-lg overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-center"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        <div>
                          <p>{p.name}</p>
                          <p className="text-xs text-slate-400 font-normal line-clamp-1 max-w-sm mt-0.5">{p.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-100">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-slate-900">
                        ${p.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditForm(p)}
                            className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Product details"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ----------------- MODAL/SLIDE-OVER OVERLAY FORM ----------------- */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-xs flex justify-end">
            {/* Background cancel trigger */}
            <div className="absolute inset-0" onClick={() => setIsFormOpen(false)} />
            
            {/* Form sheet panel */}
            <div className="relative w-full max-w-lg bg-white h-full shadow-2xl border-l border-slate-100 flex flex-col justify-between p-6 sm:p-8 animate-in slide-in-from-right duration-300">
              
              {/* Form panel header */}
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-xl font-bold text-slate-900">
                    {editingProductId ? 'Edit Product details' : 'Add New Product'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Error / Success banners */}
              <div className="overflow-y-auto flex-grow py-6 space-y-5">
                {formError && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>{formError}</span>
                  </div>
                )}
                {formSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>{formSuccess}</span>
                  </div>
                )}

                {/* Actual form layout fields */}
                <form id="admin-product-form" onSubmit={handleFormSubmit} className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Product Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Pro Noise Cancelling Headset"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  {/* Price & Category Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 199.99"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
                      >
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Home">Home</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  {/* Image URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Image URL</label>
                    <input
                      type="url"
                      placeholder="e.g. https://images.unsplash.com/..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                    <span className="text-[10px] text-slate-400 block pt-0.5">Leave empty to use standard default Unsplash mockup.</span>
                  </div>

                  {/* Description field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Description</label>
                    <textarea
                      placeholder="Enter extensive description explaining materials, durability, dimensions..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none"
                      required
                    />
                  </div>
                </form>
              </div>

              {/* Form footer submit */}
              <div className="border-t border-slate-100 pt-4 flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="admin-product-form"
                  variant="primary"
                  className="flex-1"
                >
                  <span>{editingProductId ? 'Save Changes' : 'Create Product'}</span>
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
