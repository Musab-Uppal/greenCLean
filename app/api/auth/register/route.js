import { NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/db";
import { hashPassword, createToken, COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const { email, phone, password } = await request.json();

    if (!email || !phone || !password) {
      return NextResponse.json(
        { error: "Email, phone number, and password are all required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const existingUser = getUserByEmail(trimmedEmail);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    const result = createUser({
      email: trimmedEmail,
      phone: trimmedPhone,
      password: hashedPassword
    });

    const newUserId = result.lastInsertRowid;

    const token = createToken({
      id: newUserId,
      email: trimmedEmail,
      phone: trimmedPhone
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: newUserId,
        email: trimmedEmail,
        phone: trimmedPhone
      }
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
