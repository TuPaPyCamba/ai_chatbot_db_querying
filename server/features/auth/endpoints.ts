import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findUserByEmail, createUser } from "../../services/database/users";
import { generateSessionToken, verifySessionToken } from "../../utils/local_functions/cryptoHelper";

export async function loginEndpoint(request: Request): Promise<Response> {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user || user.passwordHash !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = generateSessionToken({ email: user.email, name: user.name });
    
    // Set cookie on server
    const cookieStore = await cookies();
    cookieStore.set("app_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function signupEndpoint(request: Request): Promise<Response> {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
      const user = await createUser(name, email, password); // password saved plain text for mock simplicity
      const token = generateSessionToken({ email: user.email, name: user.name });

      const cookieStore = await cookies();
      cookieStore.set("app_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });

      return NextResponse.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email },
      });
    } catch (e: any) {
      return NextResponse.json({ error: e.message || "User already exists" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function meEndpoint(request: Request): Promise<Response> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("app_session")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      // Clear expired cookie
      cookieStore.delete("app_session");
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await findUserByEmail(payload.email);
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error: any) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

export async function logoutEndpoint(): Promise<Response> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("app_session");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
