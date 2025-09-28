// app/api/delhivery/order/route.js

export async function POST(req) {
  try {
    const payload = await req.json();

    const shipments = [
      {
        order: payload.orderId,
        phone: payload.number,
        name: payload.name,
        add: payload.address,
        city: payload.city,
        state: payload.state,
        pin: payload.pincode,
        cod_amount: payload.method === "COD" ? payload.amount : 0,
        product: payload.items.map(i => i.productName).join(", "),
        total_amount: payload.amount,
        payment_mode: payload.method === "COD" ? "COD" : "Prepaid", // ✅ REQUIRED
        weight: 0.3, // ✅ 300 grams in kilograms
      },
    ];

    const dataObject = {
      client: process.env.DELHIVERY_CLIENT_NAME,
      pickup_location: {
        name: process.env.DELHIVERY_PICKUP_NAME,
        address: process.env.DELHIVERY_PICKUP_ADDRESS,
        city: process.env.DELHIVERY_PICKUP_CITY,
        state: process.env.DELHIVERY_PICKUP_STATE,
        pin: process.env.DELHIVERY_PICKUP_PINCODE,
        phone: process.env.DELHIVERY_PICKUP_PHONE,
        country: "India",
      },
      shipments,
    };

    const bodyString = `format=json&data=${JSON.stringify(dataObject)}`;

    const delhiveryRes = await fetch(
      process.env.DELHIVERY_ENV === "production"
        ? "https://track.delhivery.com/api/cmu/create.json"
        : "https://staging-express.delhivery.com/api/cmu/create.json",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${process.env.DELHIVERY_API_TOKEN}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: bodyString,
      }
    );

    const result = await delhiveryRes.json();

    if (!delhiveryRes.ok) {
      return new Response(
        JSON.stringify({ error: "Delhivery order creation failed", details: result }),
        { status: delhiveryRes.status }
      );
    }

    return new Response(JSON.stringify({ success: true, data: result }), { status: 200 });
  } catch (err) {
    console.error("Error in /api/delhivery/order:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500 }
    );
  }
}
