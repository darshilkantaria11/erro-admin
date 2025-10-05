"use client";

import { useState } from "react";

export default function UpdateChainsPage() {
  const [formData, setFormData] = useState({
    chain1: "",
    chain2: "",
    chain3: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/products/update-chains", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(
          `✅ Updated successfully: ${data.modifiedCount} products modified.`
        );
      } else {
        setMessage(`❌ Error: ${data.error || "Something went wrong"}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          🔗 Update Chain Image URLs
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Chain 1 URL
            </label>
            <input
              type="url"
              name="chain1"
              value={formData.chain1}
              onChange={handleChange}
              placeholder="https://example.com/chain1.jpg"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Chain 2 URL
            </label>
            <input
              type="url"
              name="chain2"
              value={formData.chain2}
              onChange={handleChange}
              placeholder="https://example.com/chain2.jpg"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1 font-medium">
              Chain 3 URL
            </label>
            <input
              type="url"
              name="chain3"
              value={formData.chain3}
              onChange={handleChange}
              placeholder="https://example.com/chain3.jpg"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            {loading ? "Updating..." : "Update Chains"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-5 text-center font-medium ${
              message.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
