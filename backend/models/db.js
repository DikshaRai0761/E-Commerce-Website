import fs from 'fs';
import path from 'path';

// Locate our database JSON file
const DB_DIR = path.resolve('backend/data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial seed products
const initialProducts = [
  {
    id: "p1",
    name: "Premium Wireless Headphones",
    price: 199.99,
    description: "Experience world-class active noise cancellation, balanced audio performance, and extreme comfort for long listening sessions.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "p2",
    name: "Minimalist Leather Backpack",
    price: 89.50,
    description: "Crafted from premium water-resistant leather. Features a padded laptop sleeve (up to 15\"), hidden anti-theft pockets, and comfortable ergonomic shoulder straps.",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "p3",
    name: "Mechanical Gaming Keyboard",
    price: 129.99,
    description: "Ultra-responsive mechanical switches, customizable RGB backlighting, and premium aluminum top frame. Designed for peak typing and gaming performance.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "p4",
    name: "Ergonomic Desk Chair",
    price: 249.00,
    description: "Keep cool and comfortable during long workdays. High-back design with adjustable lumbar support, 3D armrests, and premium breathable mesh back.",
    category: "Home",
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "p5",
    name: "Smart Fitness Watch",
    price: 179.99,
    description: "Track your workouts, heart rate, sleep patterns, and daily steps. Features built-in GPS, 5ATM water resistance, and up to 7 days of battery life.",
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "p6",
    name: "Eco-Friendly Water Bottle",
    price: 24.99,
    description: "Double-walled, vacuum-insulated stainless steel. Keeps drinks cold for 24 hours or hot for 12 hours. BPA-free with a premium powder-coated finish.",
    category: "Home",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&auto=format&fit=crop&q=80"
  }
];

// Load current DB state or initialize it
let dbData = {
  users: [],
  products: initialProducts
};

if (fs.existsSync(DB_FILE)) {
  try {
    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    dbData = JSON.parse(fileContent);
    // Make sure we have the required keys
    if (!dbData.users) dbData.users = [];
    if (!dbData.products) dbData.products = initialProducts;
  } catch (err) {
    console.error("Error reading database file, resetting to initial state", err);
    saveDB();
  }
} else {
  saveDB();
}

// Function to save current state back to db.json
function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
  } catch (err) {
    console.error("Failed to write to database file", err);
  }
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// Mongoose-like Product Model Wrapper
export const Product = {
  find: async (filter = {}) => {
    let result = [...dbData.products];
    if (filter.category) {
      result = result.filter(p => p.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(searchLower) || p.description.toLowerCase().includes(searchLower));
    }
    return result;
  },

  findById: async (id) => {
    const product = dbData.products.find(p => p.id === id);
    if (!product) return null;
    return { ...product };
  },

  create: async (productData) => {
    const newProduct = {
      id: generateId(),
      name: productData.name,
      price: parseFloat(productData.price) || 0,
      description: productData.description || "",
      category: productData.category || "General",
      image: productData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    };
    dbData.products.push(newProduct);
    saveDB();
    return { ...newProduct };
  },

  findByIdAndUpdate: async (id, updatedFields) => {
    const index = dbData.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    dbData.products[index] = {
      ...dbData.products[index],
      ...updatedFields,
      price: updatedFields.price !== undefined ? parseFloat(updatedFields.price) : dbData.products[index].price,
      // Keep ID the same
      id: id
    };
    saveDB();
    return { ...dbData.products[index] };
  },

  findByIdAndDelete: async (id) => {
    const index = dbData.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    const deletedProduct = dbData.products.splice(index, 1)[0];
    saveDB();
    return { ...deletedProduct };
  }
};

// Mongoose-like User Model Wrapper
export const User = {
  find: async () => {
    return dbData.users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
  },

  findOne: async (criteria) => {
    const user = dbData.users.find(u => {
      for (let key in criteria) {
        if (u[key] !== criteria[key]) return false;
      }
      return true;
    });
    if (!user) return null;
    return { ...user };
  },

  create: async (userData) => {
    const exists = dbData.users.some(u => u.email === userData.email);
    if (exists) {
      throw new Error("User already exists with this email");
    }
    const newUser = {
      id: generateId(),
      name: userData.name,
      email: userData.email,
      password: userData.password // In actual apps, this would be hashed
    };
    dbData.users.push(newUser);
    saveDB();
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }
};
