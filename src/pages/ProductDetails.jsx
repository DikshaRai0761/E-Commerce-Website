import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Truck, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { productAPI } from '../services/api.js';
import Button from '../components/Button.jsx';

export default function ProductDetails({ id, onAddToCart }) {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await productAPI.getById(productId);
        setProduct(data);
      } catch (err) {
        console.error("Error loading product detail:", err);
        setError("Product not found or failed to load. Please verify the URL.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (val) => {
    const newQuantity = quantity + val;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCartClick = () => {
    if (!product) return;
    
    // Call the parent's add-to-cart handler with selected quantity
    onAddToCart(product, quantity);
    
    // Trigger quick visual success state
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2500);
  };

  if (isLoading) {
    return (
      <div id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse space-y-8">
        <div className="h-6 bg-slate-200 rounded w-24"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-2xl"></div>
          <div className="space-y-6">
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
            <div className="h-8 bg-slate-200 rounded w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded w-1/3"></div>
            <div className="space-y-2 pt-4">
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3"></div>
            </div>
            <div className="h-12 bg-slate-200 rounded w-1/2 pt-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div id={id} className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">Oops!</h2>
          <p className="text-slate-500 mt-2 text-sm">{error || "Product could not be retrieved."}</p>
          <Button variant="primary" onClick={() => navigate('/products')} className="mt-6">
            Back to Products Catalogue
          </Button>
        </div>
      </div>
    );
  }

  const { name, price, description, category, image } = product;

  return (
    <div id={id} className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 font-semibold text-sm mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Products</span>
        </Link>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm overflow-hidden">
          {/* Image Column */}
          <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
            <img
              src={image}
              alt={name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Details Column */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              {/* Category Tag */}
              <div>
                <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full border border-indigo-100">
                  {category}
                </span>
              </div>

              {/* Title & Price */}
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {name}
                </h1>
                <div className="text-2xl sm:text-3xl font-black text-indigo-600">
                  ${price.toFixed(2)}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-slate-100" />

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Product Description</h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Divider */}
              <hr className="border-slate-100" />

              {/* Quantity Selector */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity</span>
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 font-bold text-sm transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-slate-800 text-sm w-12 text-center bg-white border-x border-slate-100">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-3.5 py-2 text-slate-600 hover:bg-slate-200 font-bold text-sm transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTA & Delivery Guarantee */}
            <div className="mt-8 space-y-6 pt-6 border-t border-slate-100">
              {/* Add to Cart Actions */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button
                  variant={addedMessage ? "secondary" : "primary"}
                  size="lg"
                  onClick={handleAddToCartClick}
                  className="w-full sm:flex-1 gap-2.5 h-12"
                >
                  {addedMessage ? (
                    <>
                      <Check className="w-5 h-5 text-emerald-500" />
                      <span className="text-emerald-700">Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add to Cart — ${(price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Safety Badges */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-50 pt-4 text-center">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-5 h-5 text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-700">Secure Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-slate-100 px-2">
                  <RotateCcw className="w-5 h-5 text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-700">30-Day Refund</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-5 h-5 text-indigo-500" />
                  <span className="text-[10px] font-bold text-slate-700">Genuine Brand</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
