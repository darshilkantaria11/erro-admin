"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [formData, setFormData] = useState({
    productName: "",
    strikeoutPrice: "",
    originalPrice: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    description: "",
    material: "",
    fontName: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowSuccess(false);

    // Validate inputs
    for (let key in formData) {
      if (!formData[key]) {
        setError("Please fill out all fields.");
        return;
      }
    }
    if (isNaN(formData.strikeoutPrice) || isNaN(formData.originalPrice)) {
      setError("Prices must be valid numbers.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to add product");

      setShowSuccess(true);
      setTimeout(() => router.push("/products"), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => setShowConfirmation(true);
  const handleConfirmCancel = () => router.push("/products");
  const handleDismissCancel = () => setShowConfirmation(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>
       
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className="block font-medium mb-2">{key.replace(/([A-Z])/g, " $1").trim()}</label>
              <input
                type={key.includes("Price") ? "number" : "text"}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").trim()}`}
                required
              />
            </div>
          ))}
           {error && <p className="text-red-500 text-center mb-4">{error}</p>}
           {showSuccess && <p className="text-green-500 text-center mb-4">Product added successfully!</p>}
          <div className="flex gap-4">
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white shadow-md transition-transform transform hover:scale-105 ${isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-500 text-white py-3 rounded-lg shadow-md hover:bg-gray-700 transition-transform transform hover:scale-105"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">Are you sure you want to cancel?</h3>
            <div className="flex justify-center gap-4">
              <button onClick={handleConfirmCancel} className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600">Yes, Cancel</button>
              <button onClick={handleDismissCancel} className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600">No, Stay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}