"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token !== "admin-token") {
            router.push("/");
        }
    }, [router]);

    const cardClasses =
        "flex flex-col justify-center items-center text-center group bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition duration-300 hover:scale-105 min-h-[250px]";

    return (
        <div className="min-h-screen bg-g3 p-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-g4 mb-2">Erroneous Gold</h1>
                <p className="text-xl text-black">Admin Dashboard</p>
            </div>

            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                <Link href="/product1">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-g2 mb-2 group-hover:text-g4 transition-colors">
                            Single Name Necklace
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Single Name Necklaces</p>

                    </div>
                </Link>
                <Link href="/product2">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-g2 mb-2 group-hover:text-g4 transition-colors">
                            Couple Name Necklace
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Couple Name Necklaces</p>

                    </div>
                </Link>
                <Link href="/product3">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-g2 mb-2 group-hover:text-g4 transition-colors">
                            Keychains
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Keychains</p>

                    </div>
                </Link>
                <Link href="/product6">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-g2 mb-2 group-hover:text-g4 transition-colors">
                            Single Name Keychains
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Single Name Keychains</p>

                    </div>
                </Link>
                <Link href="/product7">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-g2 mb-2 group-hover:text-g4 transition-colors">
                           Couple Name Keychains
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Couple Name Keychains</p>

                    </div>
                </Link>
                <Link href="/product4">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-g2 mb-2 group-hover:text-g4 transition-colors">
                            Rakhi
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Rakhi</p>

                    </div>
                </Link>
                 <Link href="/product5">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-g2 mb-2 group-hover:text-g4 transition-colors">
                            Car Charam
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Car Charam</p>

                    </div>
                </Link>
                  <Link href="/product8">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-g2 mb-2 group-hover:text-g4 transition-colors">
                            Designer Pendents
                        </h2>
                        <p className="text-gray-600 mb-4">Add and Manage Designer Pendents</p>

                    </div>
                </Link>
                <Link href="/products">
                    <div className={cardClasses}>
                        <h2 className="text-3xl font-bold text-g2 mb-2 group-hover:text-g4 transition-colors">
                            All Products
                        </h2>
                        <p className="text-gray-600 mb-4">View and Manage All Products</p>

                    </div>
                </Link>
            </div>
        </div>
    );
}
