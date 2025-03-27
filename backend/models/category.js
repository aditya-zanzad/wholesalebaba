import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate category names
  },
  image: {
    type: String, // Store image URL or path
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true, // Categories are enabled by default
  },
});

export default mongoose.model("Category", categorySchema);