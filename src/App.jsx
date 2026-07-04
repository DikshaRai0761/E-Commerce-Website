import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import ProductListing from './pages/ProductListing.jsx';
import ProductDetails from './pages/ProductDetails.jsx';
import Cart from './pages/Cart.jsx';
import Auth from './pages/Auth.jsx';
import Admin from './pages/Admin.jsx';

export default function App() {
  // Load initial User session from local storage if available
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Load initial Cart items from local storage if available
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Sync user session changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
    }
  }, [user]);

  // Sync cart item changes to localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Calculate total items count in cart
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Authentication Handlers
  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('userToken', token);
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Cart Operation Handlers
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      
      if (existingIndex > -1) {
        // Product exists, increment the quantity
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Product is new, add as row item
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      // If quantity is dropped below 1, remove the product row entirely
      handleRemoveFromCart(productId);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
        {/* Sticky Global Navigation */}
        <Navbar
          user={user}
          onLogout={handleLogout}
          cartCount={cartCount}
        />

        {/* Core Screen Routing */}
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={<Home onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/products"
              element={<ProductListing onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/product/:productId"
              element={<ProductDetails onAddToCart={handleAddToCart} />}
            />
            <Route
              path="/cart"
              element={
                <Cart
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveFromCart={handleRemoveFromCart}
                  onClearCart={handleClearCart}
                />
              }
            />
            <Route
              path="/auth"
              element={<Auth onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/admin"
              element={<Admin user={user} />}
            />
            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}
