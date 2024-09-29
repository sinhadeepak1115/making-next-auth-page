import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  return NextResponse.json({ success: true });
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, username, password } = body;

    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    //Check if email exists
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "Email already exists" },
        { status: 400 },
      );
    }
    //check if username already exists
    const existingUserByUsername = await db.user.findUnique({
      where: { username: username },
    });
    if (existingUserByUsername) {
      return NextResponse.json(
        { user: null, message: "Username already exists" },
        { status: 400 },
      );
    }
    //create user
    const newUser = await db.user.create({
      data: { email, username, password },
    });
    return NextResponse.json(
      { user: newUser, message: "User created" },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json({ success: false, error: e }, { status: 500 });
  }
}
