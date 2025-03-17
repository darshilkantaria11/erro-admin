import { dbConnect } from '../../../utils/mongoose';
import Product from '../../../models/product';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const { 
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
        } = await req.json();

        const newProduct = new Product({
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
        return NextResponse.json({ message: 'Product added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
