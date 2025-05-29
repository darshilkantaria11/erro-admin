import { dbConnect } from "../../../utils/mongoose";
import Order from "../../../models/order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    // 🔒 Unauthorized access check
    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { orderId, status } = await req.json();

    // 🧾 Validation
    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
    }

    // ✅ Update order status for all items with given orderId
    const result = await Order.updateMany(
      { "items.orderId": orderId },
      { $set: { "items.$[elem].orderStatus": status } },
      { arrayFilters: [{ "elem.orderId": orderId }] }
    );

    return NextResponse.json({ message: "Order status updated", updatedCount: result.modifiedCount }, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
