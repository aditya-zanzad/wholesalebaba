import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    trim: true,
  },
  name: {  // Added name field
    type: String,
    required: true,
    trim: true,
  },
  query: {
    type: String,
    required: true,
    trim: true,
  },
  response: {
    type: String,
    default: null,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  respondedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["pending", "responded"],
    default: "pending",
  },
});

export default mongoose.model("Query", querySchema);