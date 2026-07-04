import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import Button from './Button.jsx';

export default function ProductCard({ id, product, onAddToCart }) {
  const { id: productId, name, price, category, image, description } = product;

  return (
    <div
      id={id}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col h-full"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <img
          src={image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"}
          alt={name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          {category}
        </span>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${productId}`} className="hover:text-indigo-600 transition-colors">
          <h3 className="text-base font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-slate-500 text-xs mt-1.5 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Pricing & CTA Grid */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Price</span>
            <span className="text-lg font-bold text-slate-900">${price.toFixed(2)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link to={`/product/${productId}`}>
              <Button
                variant="secondary"
                size="sm"
                className="!p-2 text-slate-600 hover:text-indigo-600"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onAddToCart && onAddToCart(product)}
              className="gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
