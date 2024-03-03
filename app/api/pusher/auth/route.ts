import { authOptions } from "@/app/lib/config/authOptions";
import { getPusherInstance } from "@/app/lib/pusher";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest | Request) {

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

    const authResponse = getPusherInstance().authorizeChannel(socketId, channelName, data);
    return NextResponse.json(authResponse);
}

