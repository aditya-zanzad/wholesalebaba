import mongoose from "mongoose";

const hometextSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

export default mongoose.model("Hometext", hometextSchema);