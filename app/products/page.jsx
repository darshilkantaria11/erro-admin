"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.log("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-g3 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-g4 tracking-wide">
            Products
          </h1>
          <button
            onClick={() => router.push("/products/add")}
            className="bg-g2 text-white px-6 py-3 rounded-lg shadow-xl hover:bg-g4 transition duration-300 transform hover:scale-105"
          >
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="w-16 h-16 border-4 border-t-g2 border-gray-300 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link href={`/products/${product._id}`} key={product._id}>
                <div className="bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer h-80 flex flex-col justify-between">
                  <div>
                    {/* Product Image */}
                    {product.img1 && (
                      <img
                        src={product.img1}
                        alt={product.productName}
                        className="w-full h-40 object-cover rounded-md mb-4"
                      />
                    )}

                    {/* Product Name */}
                    <h2 className="text-2xl font-semibold text-g4 mb-2">
                      {product.productName}
                    </h2>

                    {/* Product Price */}
                    <p className="text-lg font-bold text-g2">
                      ₹{product.originalPrice?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm text-g4">View Details</span>
                    <span className="text-sm text-g2">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
