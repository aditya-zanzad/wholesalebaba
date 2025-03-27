import React, { useState } from "react";

const AdminUploadText = () => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const backend = import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await fetch(`${backend}/api/home/data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, subtitle }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: "Text uploaded successfully!", type: "success" });
        setTitle("");
        setSubtitle("");
      } else {
        setMessage({ text: data.message || "Failed to upload text", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "An error occurred. Please try again.", type: "error" });
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6 transform transition-all hover:shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Home Text</h2>

        {/* Message Display */}
        {message && (
          <p
            className={`mb-4 text-center p-2 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="Enter title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              id="subtitle"
              placeholder="Enter subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300"
          >
            Upload Text
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminUploadText;