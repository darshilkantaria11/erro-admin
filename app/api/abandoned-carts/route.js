import { dbConnect } from "../../utils/mongoose";
import AbandonedCart from "../../models/AbandonedCart"; // You must create this model

export async function GET() {
  await dbConnect();
  const carts = await AbandonedCart.find().sort({ createdAt: -1 });
  return Response.json(carts);
}

export async function DELETE(req) {
  const { id } = await req.json();
  await dbConnect();
  await AbandonedCart.findByIdAndDelete(id);
  return Response.json({ success: true });
}
