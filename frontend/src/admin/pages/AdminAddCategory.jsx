import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Image } from "lucide-react";

const AdminAddCategory = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [image, setImage] = useState(""); // Direct URL string
  const [preview, setPreview] = useState(null); // Preview URL
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if user is admin
  const isAdmin = localStorage.getItem("userRole") === "admin";
  if (!isAdmin) {
    navigate("/login");
    return null;
  }

  const handleImageChange = (e) => {
    const url = e.target.value;
    setImage(url);
    setPreview(url); // Set preview to the entered URL
  };

  const handleRemovePreview = () => {
    setImage("");
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !image) {
      setMessage({ text: "Please provide both name and image URL.", type: "error" });
      return;
    }

    setLoading(true);
    const categoryData = { name, image };

    try {
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await axios.post(`${backend}/api/categories`, categoryData, {
        headers: {
          "Content-Type": "application/json",
          // Add authorization header if required, e.g., "Authorization": `Bearer ${token}`
        },
      });

      if (response.data.success) {
        setMessage({ text: "Category added successfully!", type: "success" });
        setName("");
        setImage("");
        setPreview(null);
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      setMessage({
        text: error.response?.data?.message || "Failed to add category.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-gray-800 bg-opacity-95 rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
        <h2 className="text-4xl font-extrabold text-white mb-8 text-center bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-fade-in">
          Add Premium Category
        </h2>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg text-center text-white animate-slide-in ${
              message.type === "success" ? "bg-green-700" : "bg-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Category Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter category name"
              className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
              required
              disabled={loading}
            />
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-300 mb-2">
              Image URL
            </label>
            <div className="relative">
              <input
                type="url"
                id="image"
                value={image}
                onChange={handleImageChange}
                placeholder="Enter image URL (e.g., /assets/shirt.png)"
                className="w-full p-4 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                required
                disabled={loading}
              />
              <Image className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="mt-4 relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                  onError={() => setPreview(null)} // Remove preview if URL is invalid
                />
                <button
                  type="button"
                  onClick={handleRemovePreview}
                  className="absolute top-2 right-2 p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors duration-300"
                >
                  
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-300 ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-lg"
            }`}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </form>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors duration-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Inline CSS for Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slide-in {
            animation: slideIn 0.5s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default AdminAddCategory;