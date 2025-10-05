"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_OPTIONS = [
  "singlenamenecklace",
  "couplenamenecklace",
  "keychain",
  "rakhi",
  "carcharam",
  "skeychain",
  "ckeychain",
  "designerpendents",
];
const STATUS_OPTIONS = ["live", "inactive"];


export default function AddProduct() {
  const [formData, setFormData] = useState({
    category: "skeychain", // default
    status: "live", // default
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
      setTimeout(() => router.push("/product6"), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => setShowConfirmation(true);
  const handleConfirmCancel = () => router.push("/product6");
  const handleDismissCancel = () => setShowConfirmation(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-g3">
      <div className="w-full max-w-2xl bg-g1 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {Object.keys(formData).map((key) => {
           if (key === "category" || key === "status") {
  return (
    <div key={key}>
      <label className="block font-medium mb-2">
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </label>
      <select
        name={key}
        value={formData[key]}
        onChange={handleChange}
        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
        required
      >
        {(key === "category" ? CATEGORY_OPTIONS : STATUS_OPTIONS).map(
          (option) => (
            <option key={option} value={option}>
              {option.replace(/([a-z])([A-Z])/g, "$1 $2")}
            </option>
          )
        )}
      </select>
    </div>
  );
}
            
            

            return (
              <div key={key}>

                <label className="block font-medium mb-2">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <input
                  type={key.includes("Price") ? "number" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2"
                  placeholder={`Enter ${key.replace(/([A-Z])/g, " $1").trim()}`}
                  required
                />
                {key.startsWith("img") && formData[key] && (
                  <div className="mt-2">
                    <img
                      src={formData[key]}
                      alt={`Preview ${key}`}
                      className="w-auto h-60 object-cover rounded-lg border border-gray-300 shadow-md"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {showSuccess && <p className="text-green-500 text-center mb-4">Product added successfully!</p>}

          <div className="flex gap-4">
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white shadow-md transition-transform transform hover:scale-105 ${isSubmitting ? "bg-gray-400" : "bg-g2 hover:bg-g2"
                }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-red-600 text-white py-3 rounded-lg shadow-md hover:bg-gray-700 transition-transform transform hover:scale-105"
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
