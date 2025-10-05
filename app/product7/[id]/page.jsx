"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/fetch/${id}`, {
          method: "GET",
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY, // Use environment variable
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      }
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);


  // Update product handler
  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`/api/products/update/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY, // Secure API key authentication
        },
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          router.push("/product7");
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update product");
      }
    } catch (error) {
      setError(error.message);
    }
  };


  // Delete product handler
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/products/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY, // Ensure the API key is exposed in the frontend
        },
      });

      if (response.ok) {
        router.push("/product7");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to delete product");
      }
    } catch (error) {
      setError(error.message);
    }
  };


  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  if (!product)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-g2 border-gray-300 border-solid rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-g3 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-g1 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-g4 mb-6 text-center">
          Product Details
        </h1>


        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-6">
          {/* Category Dropdown */}
          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Category
            </label>
            <select
              value={product.category || "ckeychain"}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
              className="w-full px-4 py-3 border border-g2 rounded-lg"
              required
            >
              <option value="singlenamenecklace">Single Name Necklace</option>
              <option value="couplenamenecklace">Couple Name Necklace</option>
              <option value="keychain">Keychain</option>
              <option value="rakhi">Rakhi</option>
              <option value="carcharam">Car Charam</option>
               <option value="skeychain">Single Name Keychain</option>
              <option value="ckeychain">Couple Name Keychain</option>
              <option value="designerpendents">Designer Pendents</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Status
            </label>
            <select
              value={product.status || "live"}
              onChange={(e) =>
                setProduct({ ...product, status: e.target.value })
              }
              className="w-full px-4 py-3 border border-g2 rounded-lg"
              required
            >
              <option value="live">Live</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>



          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Product Name
            </label>
            <input
              type="text"
              value={product.productName}
              onChange={(e) =>
                setProduct({ ...product, productName: e.target.value })
              }
              className="w-full px-4 py-3 border border-g2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Strikeout Price
            </label>
            <input
              type="number"
              value={product.strikeoutPrice}
              onChange={(e) =>
                setProduct({ ...product, strikeoutPrice: e.target.value })
              }
              className="w-full px-4 py-3 border border-g2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Original Price
            </label>
            <input
              type="number"
              value={product.originalPrice}
              onChange={(e) =>
                setProduct({ ...product, originalPrice: e.target.value })
              }
              className="w-full px-4 py-3 border border-g2 rounded-lg"
              required
            />
          </div>

          {/* Image Inputs */}
          {["img1", "img2", "img3", "img4"].map((img, index) => (
            <div key={index} className="mb-6">
              <label className="block text-base font-medium text-g4 mb-2">
                Image {index + 1} URL
              </label>
              <input
                type="text"
                value={product[img] || ""}
                onChange={(e) =>
                  setProduct({ ...product, [img]: e.target.value })
                }
                className="w-full px-4 py-3 border border-g2 rounded-lg"
                required
              />

              {/* Show Image Preview if URL is available */}
              {product[img] && (
                <div className="mt-2">
                  <img
                    src={product[img]}
                    alt={`Product Image ${index + 1}`}
                    className="w-auto h-60 object-cover rounded-lg border border-gray-300 shadow-md"
                  />
                </div>
              )}
            </div>
          ))}


          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Description
            </label>
            <textarea
              rows="5"
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="w-full px-4 py-3 border border-g2 rounded-lg resize-none"
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Material
            </label>
            <input
              type="text"
              value={product.material}
              onChange={(e) =>
                setProduct({ ...product, material: e.target.value })
              }
              className="w-full px-4 py-3 border border-g2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-base font-medium text-g4 mb-2">
              Font Name
            </label>
            <input
              type="text"
              value={product.fontName}
              onChange={(e) =>
                setProduct({ ...product, fontName: e.target.value })
              }
              className="w-full px-4 py-3 border border-g2 rounded-lg"
              required
            />
          </div>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="flex gap-4">
            <button
              type="submit"
              className="w-full bg-g2 text-white py-3 rounded-lg hover:bg-g4"
            >
              Update Product
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600"
            >
              Delete Product
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-400 text-white py-3 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Confirmation Modals */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                Delete
              </button>
              <button onClick={() => setShowConfirm(false)} className="bg-gray-300 px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
