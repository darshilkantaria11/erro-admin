"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [strikeoutPrice, setStrikeoutPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("");
  const [fontName, setFontName] = useState("");
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (
      !productName ||
      !strikeoutPrice ||
      !originalPrice ||
      !img1 ||
      !img2 ||
      !img3 ||
      !img4 ||
      !description ||
      !material ||
      !fontName
    ) {
      setError("Please fill out all fields.");
      return;
    }

    const newProduct = {
      productName,
      strikeoutPrice,
      originalPrice,
      img1,
      img2,
      img3,
      img4,
      description,
      material,
      fontName,
    };

    try {
      const response = await fetch("/api/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      setShowSuccess(true);
      setTimeout(() => {
        router.push("/products");
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(true);
  };

  const handleConfirmCancel = () => {
    setShowConfirmation(false);
    router.push("/products");
  };

  const handleDismissCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-g3 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-g4 mb-6 text-center">
          Add New Product
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-3 border border-g2 rounded-lg focus:outline-none focus:ring-2 focus:ring-g2"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Strikeout Price
            </label>
            <input
              type="number"
              value={strikeoutPrice}
              onChange={(e) => setStrikeoutPrice(e.target.value)}
              className="w-full px-4 py-3 border border-g2 rounded-lg focus:outline-none focus:ring-2 focus:ring-g2"
              placeholder="Enter strikeout price"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Original Price
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full px-4 py-3 border border-g2 rounded-lg focus:outline-none focus:ring-2 focus:ring-g2"
              placeholder="Enter original price"
              required
            />
          </div>

          {[1, 2, 3, 4].map((num) => (
            <div key={num}>
              <label className="block text-base font-medium text-g4 mb-2">
                Image {num} URL
              </label>
              <input
                type="text"
                value={eval(`img${num}`)}
                onChange={(e) => eval(`setImg${num}`)(e.target.value)}
                className="w-full px-4 py-3 border border-g2 rounded-lg focus:outline-none focus:ring-2 focus:ring-g2"
                placeholder={`Enter image ${num} URL`}
                required
              />
            </div>
          ))}

          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-g2 rounded-lg focus:outline-none focus:ring-2 focus:ring-g2"
              placeholder="Enter product description"
              rows="4"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Material
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-4 py-3 border border-g2 rounded-lg focus:outline-none focus:ring-2 focus:ring-g2"
              placeholder="Enter material type"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Font Name
            </label>
            <input
              type="text"
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
              className="w-full px-4 py-3 border border-g2 rounded-lg focus:outline-none focus:ring-2 focus:ring-g2"
              placeholder="Enter font name"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-g2 text-white py-3 rounded-lg shadow-md hover:bg-g4 transition-transform transform hover:scale-105"
            >
              Add Product
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

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-g4 mb-4 text-center">
              Are you sure you don&apos;t want to add the product?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmCancel}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
              >
                Yes, Cancel
              </button>
              <button
                onClick={handleDismissCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
              >
                No, Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
