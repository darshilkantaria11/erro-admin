"use client";
import { useEffect, useState } from "react";

export default function AbandonedCartPage() {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCarts = async () => {
    const res = await fetch("/api/abandoned-carts");
    const data = await res.json();
    setCarts(data);
  };

  const deleteCart = async (id) => {
    setLoading(true);
    await fetch("/api/abandoned-carts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await fetchCarts();
    setLoading(false);
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Abandoned Carts</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border">Time (IST)</th>
              <th className="text-left px-4 py-2 border">Name</th>
              <th className="text-left px-4 py-2 border">Phone</th>
              <th className="text-left px-4 py-2 border">Product(s)</th>
              <th className="text-left px-4 py-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => (
              <tr key={cart._id} className="border-t">
                <td className="px-4 py-2 border">
                  {new Date(cart.createdAt).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                  })}
                </td>
                <td className="px-4 py-2 border">{cart.name}</td>
                <td className="px-4 py-2 border">{cart.phone}</td>
                <td className="px-4 py-2 border">
                  <ul className="list-disc ml-4">
                    {Object.values(cart.cart).map((item, i) => (
                      <li key={i}>
                        {item.productName} 
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => deleteCart(cart._id)}
                    disabled={loading}
                  >
                    {loading ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
            {carts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center px-4 py-4 text-gray-500">
                  No abandoned carts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
