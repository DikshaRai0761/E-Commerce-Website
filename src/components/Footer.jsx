import React from 'react';
import { Link } from 'react-router-dom';
import { Github, ShoppingBag, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ id }) {
  return (
    <footer
      id={id}
      className="bg-slate-900 text-slate-300 border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-black text-lg">
                S
              </div>
              <span className="text-lg font-extrabold text-white">
                ShopEase
              </span>
            </div>
            <p className="text-slate-400 text-sm">
              Your one-stop destination for all premium consumer products. Experience seamless, high-quality shopping with absolute peace of mind.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Shopping
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-indigo-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-400 transition-colors">
                  View Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-indigo-400 transition-colors">
                  Developer Portfolio
                </a>
              </li>
              <li>
                <span className="text-slate-500 text-xs">
                  Stack: React + Node + Express
                </span>
              </li>
              <li>
                <span className="text-slate-500 text-xs">
                  Built for AI Studio Showcase
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>support@shopease.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>100 Innovation Way, CA</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            &copy; {new Date().getFullYear()} ShopEase. All rights reserved by DIKSHA RAI
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-indigo-400 font-semibold bg-indigo-950/50 px-3 py-1 rounded-full border border-indigo-900/30">
              MERN Stack
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
