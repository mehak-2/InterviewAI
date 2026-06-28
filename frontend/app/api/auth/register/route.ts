import { NextResponse, type NextRequest } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
  "http://localhost:5000/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward register to the backend
    const backendRes = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok || !data.success) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // Set the token cookie on the frontend domain
    const response = NextResponse.json(data, { status: 201 });

    response.cookies.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[/api/auth/register] error:", err);
    return NextResponse.json(
      { success: false, message: "Register proxy failed" },
      { status: 500 }
    );
  }
}
