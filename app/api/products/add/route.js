import { dbConnect } from '../../../utils/mongoose';
import Product from '../../../models/product';
import { NextResponse } from 'next/server';


export async function POST(req) {
    try {
        // 🔒 Extract API Key from Headers
        const authKey = req.headers.get("x-api-key");
        const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;
        
        // ❌ Reject Unauthorized Requests
        if (!authKey || authKey !== SERVER_API_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        const {
            category,
            status, 
            productName, 
            strikeoutPrice, 
            originalPrice, 
            img1, 
            img2, 
            img3, 
            img4, 
            description, 
            material, 
            fontName 
        } = data;

        // ✅ Validate Required Fields
        if (!productName || !originalPrice || !img1) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newProduct = new Product({
            category,
            status,
            productName,
            strikeoutPrice,
            originalPrice,
            img1,
            img2,
            img3,
            img4,
            description,
            material,
            fontName,
        });

        await newProduct.save();
        return NextResponse.json({ message: "Product added successfully" }, { status: 201 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}