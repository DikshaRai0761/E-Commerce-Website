import { User } from './db.js';

// Beginner-friendly MERN explanation:
// In a production MongoDB-connected MERN stack, you would import mongoose:
//
// import mongoose from 'mongoose';
//
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// }, { timestamps: true });
//
// export default mongoose.model('User', userSchema);

export default User;
