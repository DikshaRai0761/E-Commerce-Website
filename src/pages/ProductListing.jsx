import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, RefreshCw, Grid, HelpCircle } from 'lucide-react';
import { productAPI } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import Button from '../components/Button.jsx';

export default function ProductListing({ id, onAddToCart }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read initial search state from URL query parameters
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [searchText, setSearchText] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('default');

  // Load products from backend whenever filters or search criteria change
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Pass active filter options to backend API
        const data = await productAPI.getAll(
          searchText, 
          categoryFilter === 'All' ? '' : categoryFilter
        );
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Unable to load product list. Please verify your connection.");
      } finally {
        setIsLoading(false);
      }
    };
    loadProducts();
  }, [categoryFilter, searchText]);

  // Sync category filter changes with searchParams
  const handleCategoryChange = (categoryName) => {
    setCategoryFilter(categoryName);
    
    // Update the URL parameters
    const newParams = {};
    if (categoryName !== 'All') newParams.category = categoryName;
    if (searchText) newParams.search = searchText;
    setSearchParams(newParams);
  };

  // Handle Search Input Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is triggered dynamically because of the useEffect, but we update params on enter/submit
    const newParams = {};
    if (categoryFilter !== 'All') newParams.category = categoryFilter;
    if (searchText) newParams.search = searchText;
    setSearchParams(newParams);
  };

  // Reset all active filters
  const handleResetFilters = () => {
    setCategoryFilter('All');
    setSearchText('');
    setSortBy('default');
    setSearchParams({});
  };

  // Local client-side sorting of retrieved database products
  const getSortedProducts = () => {
    const productsCopy = [...products];
    if (sortBy === 'price-low-high') {
      return productsCopy.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high-low') {
      return productsCopy.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'alphabetical') {
      return productsCopy.sort((a, b) => a.name.localeCompare(b.name));
    }
    return productsCopy;
  };

  const sortedProducts = getSortedProducts();

  return (
    <div id={id} className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Catalogue Explorer
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Browse, filter, and discover products suited to your lifestyle.
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="default">Default Relevance</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="alphabetical">Name: A-Z</option>
            </select>
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* LEFT COLUMN: Filters Sidebar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-fit space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between pb-4 border-b border-slate-50">
              <span className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <SlidersHorizontal className="w-4 h-4 text-indigo-500" />
                <span>Filters</span>
              </span>
              {(categoryFilter !== 'All' || searchText || sortBy !== 'default') && (
                <button
                  onClick={handleResetFilters}
                  className="text-indigo-600 hover:text-indigo-800 text-xs font-semibold"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Search filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Search</label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Enter product name..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </form>
            </div>

            {/* Category filter */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Category</label>
              <div className="flex flex-col gap-1.5">
                {['All', 'Electronics', 'Fashion', 'Home'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`text-left text-sm px-3 py-2 rounded-lg font-medium transition-colors ${
                      categoryFilter === cat
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Cards Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 animate-pulse">
                    <div className="aspect-square bg-slate-200 rounded-xl"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-full"></div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-5 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm max-w-md mx-auto">
                <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800">Connection Error</h3>
                <p className="text-sm mt-2 text-slate-500">{error}</p>
                <Button variant="secondary" onClick={() => window.location.reload()} className="mt-4 gap-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Reload list</span>
                </Button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 shadow-sm">
                <Grid className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800">No matching products</h3>
                <p className="text-sm mt-2 text-slate-500">
                  We couldn't find any products matching your active filters. Try clearing some selections or searching for a different item name.
                </p>
                <Button variant="outline" onClick={handleResetFilters} className="mt-6">
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
