import { dbConnect } from '../../utils/mongoose';
import Product from '../../models/product';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    const products = await Product.find(); // Fetch all products from the database
    return NextResponse.json(products);
}
