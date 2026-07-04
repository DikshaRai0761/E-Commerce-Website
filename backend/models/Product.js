import { Product } from './db.js';

// Beginner-friendly MERN explanation:
// In a production MongoDB-connected MERN stack, you would import mongoose:
//
// import mongoose from 'mongoose';
//
// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   price: { type: Number, required: true },
//   description: { type: String, required: true },
//   category: { type: String, required: true },
//   image: { type: String, required: true }
// }, { timestamps: true });
//
// export default mongoose.model('Product', productSchema);

export default Product;
