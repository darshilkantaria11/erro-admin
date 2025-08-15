"use client";

import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";
import {
    FiClock,
    FiPackage,
    FiTruck,
    FiCheckCircle,
    FiCalendar
} from "react-icons/fi";

// Status helper function
const getItemStatus = (status) => {
    switch (status) {
        case "Confirmed":
            return {
                text: "Confirmed",
                color: "bg-yellow-100 text-yellow-800",
                icon: <FiClock className="text-yellow-500" />,
            };
        case "Crafting":
            return {
                text: "Crafting",
                color: "bg-purple-100 text-purple-800",
                icon: <FiPackage className="text-purple-500" />,
            };
        case "Shipped":
            return {
                text: "Shipped",
                color: "bg-blue-100 text-blue-800",
                icon: <FiTruck className="text-blue-500" />,
            };
        case "Delivered":
            return {
                text: "Delivered",
                color: "bg-green-100 text-green-800",
                icon: <FiCheckCircle className="text-green-500" />,
            };
        case "Cancelled":
            return {
                text: "Cancelled by Customer",
                color: "bg-red-100 text-red-800",
                icon: <FiCalendar className="text-red-500" />,
            };
        case "Rejected":
            return {
                text: "Rejected by Store",
                color: "bg-gray-100 text-gray-800",
                icon: <FiCalendar className="text-gray-500" />,
            };
        case "Replaced":
            return {
                text: "Replaced",
                color: "bg-orange-100 text-orange-800",
                icon: <FiTruck className="text-orange-500" />,
            };
        default:
            return {
                text: "Processing",
                color: "bg-yellow-100 text-yellow-800",
                icon: <FiClock className="text-yellow-500" />,
            };
    }
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [groupedOrders, setGroupedOrders] = useState({});
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [productDetailsMap, setProductDetailsMap] = useState({});
    const [searchPhone, setSearchPhone] = useState("");
    const [searchOrderId, setSearchOrderId] = useState("");

    const [statusDropdowns, setStatusDropdowns] = useState({});

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            const res = await fetch("/api/order");
            const data = await res.json();
            if (data.orders) {
                setOrders(data.orders);
                groupOrdersById(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        }
    }

    function groupOrdersById(allOrders) {
        const grouped = {};
        [...allOrders].reverse().forEach((order) => {
            [...order.items].reverse().forEach((item) => {
                if (!grouped[item.orderId]) {
                    grouped[item.orderId] = {
                        orderId: item.orderId,
                        createdAt: item.createdAt,
                        method: item.method,
                        orderStatus: item.orderStatus,
                        amount: 0,
                        user: { name: order.name, number: order.number, email: order.email },
                        items: [],
                    };
                }
                grouped[item.orderId].amount = item.amount;
                grouped[item.orderId].items.push({
                    ...item,
                    user: { name: order.name, number: order.number },
                });
            });
        });
        setGroupedOrders(grouped);

        // Initialize dropdown states
        const dropdowns = {};
        Object.keys(grouped).forEach(orderId => {
            dropdowns[orderId] = grouped[orderId].orderStatus;
        });
        setStatusDropdowns(dropdowns);
    }

    const fetchAllProductDetails = async (items) => {
        const detailsMap = {};
        for (const item of items) {
            const pid = item.productId;
            if (!detailsMap[pid]) {
                try {
                    const res = await fetch(`/api/products/fetch/${pid}`, {
                        headers: { "x-api-key": process.env.NEXT_PUBLIC_API_KEY },
                    });
                    const product = await res.json();
                    detailsMap[pid] = product;
                } catch (err) {
                    console.error(`Failed to fetch product ${pid}`, err);
                }
            }
        }
        setProductDetailsMap(detailsMap);
    };

    const handleViewDetails = async (orderId) => {
        const orderGroup = groupedOrders[orderId];
        if (!orderGroup) return;

        await fetchAllProductDetails(orderGroup.items);
        setSelectedOrderId(orderId);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const res = await fetch("/api/order/status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
                },
                body: JSON.stringify({ orderId, status: newStatus }),
            });

            const result = await res.json();

            if (res.ok) {
                alert("Order status updated");
                fetchOrders();
            } else {
                alert(result.error || "Failed to update");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Error occurred");
        }
    };

    const handleStatusChange = (orderId, newStatus) => {
        setStatusDropdowns(prev => ({
            ...prev,
            [orderId]: newStatus
        }));
        updateOrderStatus(orderId, newStatus);
    };

    // Get all possible status options
    const statusOptions = [
        "Confirmed", "Crafting", "Shipped",
        "Delivered", "Cancelled", "Rejected", "Replaced"
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans">
            <h1 className="text-3xl font-extrabold mb-8 text-gray-800">
                Orders Dashboard
            </h1>

            <div className="mb-6 max-w-md">
                <input
                    type="text"
                    placeholder="Search by phone number"
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div className="mb-6 max-w-md">
                <input
                    type="text"
                    placeholder="Search by order ID"
                    value={searchOrderId}
                    onChange={(e) => setSearchOrderId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            {[
                                "Order ID",
                                "Date & Time",
                                "Total Amount",
                                "Payment Method",
                                "Status",
                                "Actions",
                                "View Details",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {Object.values(groupedOrders).length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="text-center py-10 text-gray-400 font-semibold"
                                >
                                    No Orders Found
                                </td>
                            </tr>
                        )}
                        {Object.values(groupedOrders)
                            .filter((orderGroup) => {
                                const phoneMatch =
                                    searchPhone.trim() === "" ||
                                    orderGroup.user.number.includes(searchPhone.trim());

                                const orderIdMatch =
                                    searchOrderId.trim() === "" ||
                                    orderGroup.orderId.includes(searchOrderId.trim());

                                return phoneMatch && orderIdMatch;
                            })
                            .sort((a, b) => {
                                if (searchPhone.trim() === "") {
                                    return new Date(b.createdAt) - new Date(a.createdAt);
                                } else {
                                    return 0;
                                }
                            })
                            .map((orderGroup) => {
                                const statusInfo = getItemStatus(orderGroup.orderStatus);
                                return (
                                    <tr
                                        key={orderGroup.orderId}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-mono text-sm max-w-[120px] truncate">
                                            {orderGroup.orderId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600 text-sm">
                                            {format(new Date(orderGroup.createdAt), "dd MMM yyyy, HH:mm")}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                                            ₹{orderGroup.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700 uppercase font-medium">
                                            {orderGroup.method}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.color}`}
                                            >
                                                {statusInfo.icon}
                                                {statusInfo.text}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <select
                                                value={statusDropdowns[orderGroup.orderId] || orderGroup.orderStatus}
                                                onChange={(e) => handleStatusChange(orderGroup.orderId, e.target.value)}
                                                className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                                            >
                                                {statusOptions.map(option => (
                                                    <option key={option} value={option}>
                                                        {getItemStatus(option).text}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleViewDetails(orderGroup.orderId)}
                                                className="inline-flex items-center px-3 py-1 rounded bg-green-600 text-white text-sm hover:bg-green-700 transition"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </div>

            {/* Order Details Popup */}
            {selectedOrderId && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                        <button
                            onClick={() => setSelectedOrderId(null)}
                            className="absolute top-4 right-4 text-gray-600 hover:text-red-600 text-2xl font-bold"
                            aria-label="Close details"
                        >
                            &times;
                        </button>

                        <h3 className="text-2xl font-semibold mb-6 border-b pb-2">
                            Order Details - #{selectedOrderId}
                        </h3>


                        {/* Products List */}
                        <div className="space-y-6">
                            {groupedOrders[selectedOrderId].items.map((item, idx) => {
                                const product = productDetailsMap[item.productId];
                                return (
                                    <div
                                        key={idx}
                                        className="flex flex-col md:flex-row gap-6 border rounded-md p-4 bg-gray-50"
                                    >
                                        <div className="flex-shrink-0">
                                            {product ? (
                                                <img
                                                    src={product.img1}
                                                    alt={product.productName}
                                                    className="rounded-md object-cover w-32 h-32"
                                                />
                                            ) : (
                                                <div className="w-32 h-32 bg-gray-300 animate-pulse rounded-md"></div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            {product ? (
                                                <>
                                                    <h4 className="text-lg font-semibold mb-1">
                                                        {product.productName}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        MRP: ₹{product.originalPrice.toLocaleString()}
                                                    </p>
                                                    <p className="text-sm mb-1">
                                                        Quantity: <strong>{item.quantity}</strong>
                                                    </p>
                                                    <p className="text-sm mb-1">
                                                        Total: <strong>₹{(item.quantity * product.originalPrice).toLocaleString()}</strong>
                                                    </p>
                                                </>
                                            ) : (
                                                <p>Loading product info...</p>
                                            )}
                                            {item.engravedName && (
                                                <p className="text-sm mt-2">
                                                    Engraved Name: <strong>{item.engravedName}</strong>
                                                </p>
                                            )}

                                            {item.chain && (
                                                <p className="text-sm mt-2 flex items-center gap-2">
                                                    Chain:
                                                    <img
                                                        src={item.chain}
                                                        alt="Selected Chain"
                                                        className="rounded-md object-cover w-32 h-32"
                                                    />
                                                </p>
                                            )}

                                            <p className="text-xs text-gray-500 mt-1">
                                                Product ID: {item.productId}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Shipping & Order Info */}
                        <div className="mt-8 border-t pt-6">
                            <h4 className="text-xl font-semibold mb-3">Shipping Address</h4>
                            <p className="text-gray-700">{groupedOrders[selectedOrderId].user.name}</p>
                            <p className="text-gray-700">{groupedOrders[selectedOrderId].items[0].fullAddress}</p>
                            <p className="text-gray-700">
                                {groupedOrders[selectedOrderId].items[0].city},{" "}
                                {groupedOrders[selectedOrderId].items[0].state} -{" "}
                                {groupedOrders[selectedOrderId].items[0].pincode}
                            </p>
                            <p className="text-gray-700">Phone: {groupedOrders[selectedOrderId].user.number}</p>
                            <p className="text-gray-700">Email: {groupedOrders[selectedOrderId].user.email}</p>


                            <div className="mt-4 space-y-1 text-gray-800 font-medium">
                                <p>Payment Method: {groupedOrders[selectedOrderId].method}</p>
                                <p>Status: {groupedOrders[selectedOrderId].orderStatus}</p>
                                <p>Order ID: {groupedOrders[selectedOrderId].orderId}</p>
                            </div>
                            {(() => {
                                let totalMRP = 0;
                                groupedOrders[selectedOrderId].items.forEach((item) => {
                                    const product = productDetailsMap[item.productId];
                                    if (product) {
                                        totalMRP += item.quantity * product.originalPrice;
                                    }
                                });

                                const purchasedAt = groupedOrders[selectedOrderId].amount;
                                const discount = totalMRP - purchasedAt;

                                return (
                                    <div className="mt-4 space-y-1 text-gray-800 font-medium">
                                        <p>Total MRP: ₹{totalMRP.toLocaleString()}</p>
                                        <p className="text-green-600 font-bold">
                                            Discount given: ₹{discount > 0 ? discount.toLocaleString() : 0}
                                        </p>
                                        <p className="font-bold text-g2 bg-g1">Purchased at: ₹{purchasedAt.toLocaleString()}</p>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}