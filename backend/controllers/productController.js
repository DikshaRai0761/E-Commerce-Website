import Product from '../models/Product.js';

// Get all products (with optional search filter)
// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};
    
    if (search) filter.search = search;
    if (category) filter.category = category;

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error retrieving products", error: error.message });
  }
};

// Get a single product by ID
// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error retrieving product detail", error: error.message });
  }
};

// Create a new product (Admin)
// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;

    // Validation
    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: "Please fill out all required fields (name, price, description, category)" });
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      return res.status(400).json({ message: "Price must be a valid positive number" });
    }

    const newProduct = await Product.create({
      name,
      price: parseFloat(price),
      description,
      category,
      image: image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80"
    });

    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error creating product", error: error.message });
  }
};

// Update an existing product (Admin)
// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category, image } = req.body;

    // Check if product exists
    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validation if price is updated
    if (price !== undefined) {
      if (isNaN(price) || parseFloat(price) <= 0) {
        return res.status(400).json({ message: "Price must be a valid positive number" });
      }
    }

    const updatedFields = {};
    if (name !== undefined) updatedFields.name = name;
    if (price !== undefined) updatedFields.price = parseFloat(price);
    if (description !== undefined) updatedFields.description = description;
    if (category !== undefined) updatedFields.category = category;
    if (image !== undefined) updatedFields.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields);
    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error updating product", error: error.message });
  }
};

// Delete a product (Admin)
// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({ message: "Product not found" });
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error deleting product", error: error.message });
  }
};
