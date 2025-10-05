"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products", {
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY, // Secure API key
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Unable to fetch products`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-g3 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 tracking-wide">
            Designer Pendents
          </h1>
          <button
            onClick={() => router.push("/product8/add")}
            className="bg-g2 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-g2 transition-all transform hover:scale-105"
          >
            + Add Designer Pendents
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[300px]">
            <div className="w-12 h-12 border-4 border-t-g2 border-gray-300 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-500 font-semibold text-lg">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 bg-g3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {products.length > 0 ? (
              products
                .filter((product) => product.category === "designerpendents")
                .map((product) => {
                  const bgColor =
                    product.status === "live" ? "bg-green-200" : "bg-red-200";

                  return (
                    <motion.div
                      key={product._id}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={`/product8/${product._id}`}>
                        <div className={`${bgColor} p-5 rounded-xl shadow-md hover:shadow-2xl transition-all cursor-pointer`}>
                          {/* Product Image */}
                          {product.img1 ? (
                            <img
                              src={product.img1}
                              alt={product.productName}
                              className="w-full h-40 object-cover rounded-md mb-4"
                            />
                          ) : (
                            <div className="w-full h-40 bg-gray-300 flex items-center justify-center rounded-md">
                              <span className="text-gray-500">No Image</span>
                            </div>
                          )}

                          {/* Product Details */}
                          <h2 className="text-xl font-semibold text-gray-800 truncate">
                            {product.productName}
                          </h2>
                          <p className="text-lg font-bold text-g2 mt-1">
                            ₹{product.originalPrice?.toLocaleString()}
                          </p>

                          {/* View Details Button */}
                          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                            <span>View Details</span>
                            <span className="text-g2 text-lg">→</span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })
            ) : (
              <div className="text-center text-gray-500 col-span-full">
                No products found.
              </div>
            )}

          </motion.div>
        )}
      </div>
    </div>
  );
}
