import { NextResponse } from "next/server";
import prisma from "@/app/lib/db/prisma";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const { email, password, name } = body;

        if (!email || !password || !name) {
            return new NextResponse("Missing request fields", { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        });

        return NextResponse.json(user);
    } catch (err: any) {
        console.error(err, "error during registration");
        return new NextResponse("Error while registering new user", { status: 500 });
    }
}