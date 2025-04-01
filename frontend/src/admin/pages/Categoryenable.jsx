import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // For showing notifications
import 'react-toastify/dist/ReactToastify.css';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const response = await axios.get(`${backend}/api/categories`);
      setCategories(response.data.categories);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
      toast.error('Failed to fetch categories');
    }
  };

  const toggleCategoryStatus = async (categoryId, currentStatus) => {
    setIsUpdating(true);
    try {
      const backend = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      const endpoint = currentStatus ? 'disable' : 'enable';
      
      await axios.patch(`${backend}/api/categories/${categoryId}/${endpoint}`);
      
      // Optimistic UI update
      setCategories(categories.map(category => 
        category._id === categoryId 
          ? { ...category, enabled: !currentStatus } 
          : category
      ));
      
      toast.success(`Category ${currentStatus ? 'disabled' : 'enabled'} successfully`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      toast.error(`Failed to ${currentStatus ? 'disable' : 'enable'} category`);
      // Revert UI if API call fails
      fetchCategories();
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button 
          onClick={fetchCategories}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
        <button 
          onClick={fetchCategories}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={isUpdating}
        >
          {isUpdating ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={category.image}
                          alt={category.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/40';
                          }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {category.name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${category.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {category.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleCategoryStatus(category._id, category.enabled)}
                      disabled={isUpdating}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                        ${category.enabled
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-green-50 text-green-700 hover:bg-green-100'}
                        ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {category.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;