import { NextResponse } from "next/server";

let cachedToken = null;
let tokenGeneratedAt = null;

export async function GET(req) {
  const authHeader = req.headers.get("x-api-key");
  if (authHeader !== process.env.NEXT_PUBLIC_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  if (cachedToken && tokenGeneratedAt && now - tokenGeneratedAt < 9 * 24 * 60 * 60 * 1000) {
    return NextResponse.json({ token: cachedToken });
  }

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await res.json();
  

  if (!data.token) {
    return NextResponse.json({ error: "Failed to generate token", detail: data }, { status: 500 });
  }


  cachedToken = data.token;
  tokenGeneratedAt = now;

  return NextResponse.json({ token: data.token });
}
