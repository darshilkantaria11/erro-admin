import { dbConnect } from '../../../utils/mongoose';
import Product from '../../../models/product';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    await dbConnect();

    const { chain1, chain2, chain3 } = await req.json();

    if (!chain1 && !chain2 && !chain3) {
      return NextResponse.json(
        { error: "At least one chain URL is required" },
        { status: 400 }
      );
    }

    // Update all products matching either category
    const result = await Product.updateMany(
      {
        category: { $in: ["singlenamenecklace", "couplenamenecklace"] },
      },
      {
        $set: {
          ...(chain1 && { chain1 }),
          ...(chain2 && { chain2 }),
          ...(chain3 && { chain3 }),
        },
      }
    );

    return NextResponse.json(
      {
        message: "Chain URLs updated successfully",
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating chain images:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
