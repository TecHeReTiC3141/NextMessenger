import { authOptions } from "@/app/lib/config/authOptions";
import { pusherServer } from "@/app/lib/pusher";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json({
            status: 401,
            message: "Unauthorized",
        });
    }
    const requestData = await request.text();
    const [socketId, channelName] = requestData.split("&")
        .map((str) => str.split("=")[1]);
    const data = {
        user_id: session.user.email,
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channelName, data);
    return NextResponse.json(authResponse);
}

