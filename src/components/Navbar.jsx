import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Menu, X, ShieldAlert, Store } from 'lucide-react';
import Button from './Button.jsx';

export default function Navbar({ id, user, onLogout, cartCount }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/auth');
    setIsOpen(false);
  };

  return (
    <nav
      id={id}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">
                S
              </div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
                ShopEase
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-4">
              <Link
                to="/"
                className="inline-flex items-center px-3 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center px-3 py-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                Products
              </Link>
            </div>
          </div>

          {/* Desktop Right Side Utilities */}
          <div className="hidden md:flex md:items-center md:gap-4">
            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-50">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-indigo-600 rounded-full animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Admin Dashboard Entry (If Admin) */}
            {user && user.isAdmin && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="gap-1.5 border-amber-200 text-amber-700 hover:bg-amber-50">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Admin Panel</span>
                </Button>
              </Link>
            )}

            {/* User Session Profile menu */}
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="text-sm font-medium text-slate-700 hidden lg:inline max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogoutClick}
                  className="!p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-transparent hover:border-rose-100"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="primary" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-4 space-y-3 shadow-lg">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            Products
          </Link>
          <Link
            to="/cart"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
            </span>
            {cartCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {user && user.isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-amber-700 bg-amber-50"
            >
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <span>Admin Panel</span>
            </Link>
          )}

          <div className="border-t border-slate-100 pt-3 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-400">{user.email}</div>
                  </div>
                </div>
                <Button
                  variant="danger"
                  onClick={handleLogoutClick}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </Button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setIsOpen(false)} className="w-full">
                <Button variant="primary" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
