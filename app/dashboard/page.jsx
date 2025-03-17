"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Check if the token exists and if it matches the expected value
    if (token !== "admin-token") {
      // Redirect to the login page if token doesn't match
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-g3 p-8">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-g4 mb-2">
          Erroneous Gold
        </h1>
        <p className="text-xl text-black">Admin Dashboard</p>
      </div>

      {/* Option Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Add Position to Career Page */}
        <Link href="/products">
          <div className="flex items-center group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform min-h-[250px]">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-g2 mb-4 group-hover:text-g4 transition-colors">
                Single Name Necklace
              </h2>
              <p className="text-gray-600">
                Manage and add new single name necklace products
              </p>
            </div>
          </div>
        </Link>

        {/* Add Slots */}
        {/* <Link href="/slots">
          <div className="flex items-center group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 hover:scale-105 transform min-h-[250px]">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-g2 mb-4 group-hover:text-g4 transition-colors">
                Slots Dashboard
              </h2>
              <p className="text-gray-600">
                Manage and add available slots for parents to visit and explore
                campus.
              </p>
            </div>
          </div>
        </Link> */}
      </div>

      {/* Footer */}
     
    </div>
  );
}
