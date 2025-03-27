import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [queries, setQueries] = useState([]);
  const [response, setResponse] = useState({});
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/queries`);
        setQueries(Array.isArray(res.data.queries) ? res.data.queries : []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching queries:", error);
        setError("Failed to load queries. Please try again later.");
        setLoading(false);
      }
    };
    fetchQueries();
  }, []);

  const handleResponseSubmit = async (queryId) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/queries/${queryId}/respond`, {
        response: response[queryId],
      });
      setQueries(
        queries.map((q) =>
          q._id === queryId
            ? { ...q, response: response[queryId], status: "responded", respondedAt: new Date() }
            : q
        )
      );
      setResponse({ ...response, [queryId]: "" });
    } catch (error) {
      console.error("Error responding to query:", error);
      alert("Failed to submit response. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading queries...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 animate-fade-in">
          Admin Dashboard - User Queries
        </h1>

        {queries.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center animate-fade-in-up">
            <p className="text-gray-600 text-lg">No queries found at the moment.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {queries.map((query) => (
              <div
                key={query._id}
                className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in-up"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-800">
                      <strong className="font-semibold">Name:</strong> {query.name}
                    </p>
                    <p className="text-gray-800">
                      <strong className="font-semibold">User ID:</strong>{" "}
                      <span className="font-mono text-sm">{query.userId}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">
                      <strong className="font-semibold">Submitted:</strong>{" "}
                      {new Date(query.submittedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg mb-4">
                  <strong className="font-semibold">Query:</strong> {query.query}
                </p>

                {query.status === "responded" ? (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-700">
                      <strong className="font-semibold">Response:</strong> {query.response}
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                      <strong className="font-semibold">Responded:</strong>{" "}
                      {new Date(query.respondedAt).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <textarea
                      value={response[query._id] || ""}
                      onChange={(e) => setResponse({ ...response, [query._id]: e.target.value })}
                      placeholder="Type your response here..."
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24 transition-all duration-200"
                    />
                    <button
                      onClick={() => handleResponseSubmit(query._id)}
                      disabled={!response[query._id]?.trim()}
                      className="mt-3 w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Submit Response
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Add this CSS in your global stylesheet or use a CSS-in-JS solution
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out;
  }

  @media (max-width: 640px) {
    .animate-fade-in-up {
      animation-delay: 0.1s;
    }
  }
`;

export default AdminDashboard;