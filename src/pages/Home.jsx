import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Sparkles, Laptop, Shirt, Sofa, TrendingUp } from 'lucide-react';
import { productAPI } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import Button from '../components/Button.jsx';

export default function Home({ id, onAddToCart }) {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const data = await productAPI.getAll();
        // Just take the first 3 or 4 products as featured
        setFeaturedProducts(data.slice(0, 3));
      } catch (err) {
        console.error("Error fetching featured products", err);
        setError("Could not load featured products.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleCategorySelect = (categoryName) => {
    navigate(`/products?category=${categoryName}`);
  };

  return (
    <div id={id} className="bg-slate-50 min-h-screen">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        {/* Abstract shapes in the background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,indigo_400,transparent_50%)] pointer-events-none"></div>
        <div className="absolute top-1/2 left-10 w-72 h-72 bg-indigo-500 rounded-full filter blur-[100px] opacity-20 animate-pulse pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-400/20 px-3.5 py-1.5 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Discover the Summer Sale</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              Elevate Your <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Shopping Experience
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
              Explore our curated selection of high-end electronics, premium fashion statement items, and ergonomic furniture designed to transform your daily lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <Link to="/products">
                <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                  <span>Explore Products</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-slate-700 hover:bg-white/10">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Visual Image */}
          <div className="relative flex justify-center">
            <div className="relative w-full max-w-md h-80 sm:h-96 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80"
                alt="Modern Storefront"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-left">
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest">Featured Collection</p>
                <h3 className="text-xl font-bold text-white mt-1">Smart Lifestyle Accessories</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-slate-500 mt-2 text-sm">
            Quickly browse through our highly specialized categories to find exactly what you need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Electronics */}
          <div
            onClick={() => handleCategorySelect('Electronics')}
            className="cursor-pointer group relative bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Electronics</h3>
            <p className="text-xs text-slate-400 mt-1">Audio, watch gears, accessories</p>
          </div>

          {/* Fashion */}
          <div
            onClick={() => handleCategorySelect('Fashion')}
            className="cursor-pointer group relative bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Fashion</h3>
            <p className="text-xs text-slate-400 mt-1">Bags, wearables, leather gear</p>
          </div>

          {/* Home */}
          <div
            onClick={() => handleCategorySelect('Home')}
            className="cursor-pointer group relative bg-white border border-slate-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300"
          >
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
              <Sofa className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Home</h3>
            <p className="text-xs text-slate-400 mt-1">Chairs, bottles, decor utilities</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Products Section */}
      <section className="bg-slate-100/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 justify-center sm:justify-start text-indigo-600 font-semibold text-xs uppercase tracking-widest">
                <TrendingUp className="w-4 h-4" />
                <span>Trending Now</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Featured Products
              </h2>
            </div>
            <Link to="/products">
              <Button variant="outline" className="text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                View All Products
              </Button>
            </Link>
          </div>

          {/* Loader or Error states */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4 animate-pulse">
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
            <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-slate-500 shadow-sm max-w-md mx-auto">
              <p>{error}</p>
              <Button variant="secondary" onClick={() => window.location.reload()} className="mt-4">
                Retry Connection
              </Button>
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-slate-400 py-12">No products available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Quality Guarantee Bento banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900">Free Secure Shipping</h3>
            <p className="text-sm text-slate-500">Fully tracked express shipping on all orders exceeding $50. No hidden delivery duties.</p>
          </div>
          <div className="space-y-2 text-center md:text-left border-y md:border-y-0 md:border-x border-slate-100 py-6 md:py-0 md:px-8">
            <h3 className="text-xl font-bold text-slate-900">30-Day Easy Returns</h3>
            <p className="text-sm text-slate-500">If you are not 100% satisfied with your item, return it within 30 days for a hassle-free cash refund.</p>
          </div>
          <div className="space-y-2 text-center md:text-left md:pl-4">
            <h3 className="text-xl font-bold text-slate-900">24/7 Expert Support</h3>
            <p className="text-sm text-slate-500">Our customer care experts are ready around the clock to assist you with any questions or claims.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
