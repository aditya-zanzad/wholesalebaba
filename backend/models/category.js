// models/categoryModel.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: String,
  image: String,
  enabled: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('Category', categorySchema);