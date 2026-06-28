import { NextResponse, type NextRequest } from "next/server";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, "") ||
  "http://localhost:5000/api";

export async function POST(request: NextRequest) {
  try {
    // Forward logout to backend (best-effort, ignore errors)
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        // Forward the token from the frontend cookie to backend if needed
        Cookie: `token=${request.cookies.get("token")?.value ?? ""}`,
      },
    }).catch(() => {});

    // Clear the token cookie on the frontend domain
    const response = NextResponse.json({ success: true, message: "Logged out successfully" });

    response.cookies.set("token", "none", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 10, // expire in 10 seconds
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[/api/auth/logout] error:", err);
    return NextResponse.json(
      { success: false, message: "Logout proxy failed" },
      { status: 500 }
    );
  }
}
