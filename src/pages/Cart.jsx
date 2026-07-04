import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2, Plus, Minus, CreditCard, Sparkles, ShoppingCart } from 'lucide-react';
import Button from '../components/Button.jsx';

export default function Cart({ id, cartItems, onUpdateQuantity, onRemoveFromCart, onClearCart }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  // Calculate pricing numbers
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% simulated sales tax
  const grandTotal = subtotal + shipping + tax;

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    
    // Simulate API checkout processing delay
    setTimeout(() => {
      setIsCheckingOut(false);
      setCheckoutComplete(true);
      onClearCart(); // Empty the cart upon success
    }, 1800);
  };

  // If order was successfully placed
  if (checkoutComplete) {
    return (
      <div id={id} className="bg-slate-50 min-h-screen py-16 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 animate-bounce" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Placed Successfully!</h2>
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            Thank you for shopping with us! Since this is a MERN Stack Resume Showcase, the database has registered your simulation, and your cart has been reset.
          </p>
          <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl my-6 text-left text-xs text-indigo-950">
            <p className="font-bold mb-1">Developer Notes:</p>
            <p>You can easily connect this checkout button to payment gateways such as Stripe or PayPal SDKs by passing the grand total of <strong>${grandTotal.toFixed(2)}</strong> to an Express payment proxy endpoint.</p>
          </div>
          <Link to="/products">
            <Button variant="primary" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // If cart is completely empty
  if (cartItems.length === 0) {
    return (
      <div id={id} className="bg-slate-50 min-h-screen py-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
            <ShoppingCart className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Your shopping cart is empty</h2>
          <p className="text-sm text-slate-400 mt-2">
            Looks like you haven't added any products to your shopping cart yet. Explore our top categories and catalog!
          </p>
          <Link to="/products">
            <Button variant="primary" className="mt-8 gap-2">
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div id={id} className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">
          Shopping Cart
        </h1>

        {/* Cart Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT: Cart items list */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                {/* Product Detail Thumbnail */}
                <div className="flex items-center gap-4 self-start sm:self-center w-full sm:w-auto">
                  <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] bg-slate-50 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-100">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1 hover:text-indigo-600 transition-colors">
                      <Link to={`/product/${item.id}`}>{item.name}</Link>
                    </h3>
                    <p className="text-xs text-indigo-600 font-bold mt-1">${item.price.toFixed(2)} each</p>
                  </div>
                </div>

                {/* Right utility columns */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-500 transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-bold text-slate-800 text-xs w-8 text-center bg-white border-x border-slate-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-500 transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Total price for the item row */}
                  <div className="text-right flex flex-col min-w-[70px]">
                    <span className="text-xs text-slate-400">Total</span>
                    <span className="text-sm font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>

                  {/* Remove row item */}
                  <button
                    onClick={() => onRemoveFromCart(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear Cart control */}
            <div className="flex justify-between items-center bg-white/50 px-4 py-3 rounded-2xl">
              <Link to="/products" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">
                &larr; Add more items
              </Link>
              <button
                onClick={onClearCart}
                className="text-xs text-rose-500 hover:text-rose-700 font-semibold"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* RIGHT: Order summary and Payment simulation */}
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-50">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Items Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Sales Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              
              <hr className="border-slate-50" />
              
              <div className="flex justify-between text-slate-900 font-bold text-base">
                <span>Grand Total</span>
                <span className="text-indigo-600">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Custom Payment Form Simulator */}
            <form onSubmit={handleCheckoutSubmit} className="space-y-4 pt-4 border-t border-slate-50">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Simulated Secure Payment</span>
              </h4>
              
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="1111 2222 3333 4444"
                    required
                    maxLength="19"
                    className="col-span-2 w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    required
                    maxLength="4"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-11"
                isLoading={isCheckingOut}
              >
                <span>Place Simulated Order</span>
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
