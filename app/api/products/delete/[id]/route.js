import { dbConnect } from '../../../../utils/mongoose';
import Product from '../../../../models/product';
import { NextResponse } from 'next/server';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY; // Store API key securely in .env file

export async function DELETE(req, { params }) {
    const { id } = params;

    // Extract API key from headers
    const apiKey = req.headers.get("x-api-key");

    // Validate API key
    if (!apiKey || apiKey !== API_KEY) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        await Product.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
