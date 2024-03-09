import tenorAxios, { TenorResponse } from "@/app/api/tenor/tenorAxios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query"), mode = searchParams.get("mode") || "featured";
    if (mode === "featured") {
        return NextResponse.json((await tenorAxios.get<TenorResponse>("/featured", {
            params: {
                key: process.env.TENOR_API_KEY,
                client_key: "Next Messenger",
                country: "RU",
                locals: "ru_RU",
                limit: 16,
                media_filter: "gif,tinygif,mp4,tinymp4"
            }
        })).data);
    } else if (mode === "search") {
        if (!query) {
            throw new Error("No query provided");
        }
        return NextResponse.json((await tenorAxios.get<TenorResponse>("/search", {
            params: {
                key: process.env.TENOR_API_KEY,
                client_key: "Next Messenger",
                q: query,
                country: "RU",
                locals: "ru_RU",
                limit: 16,
                media_filter: "gif,tinygif,mp4,tinymp4"
            }
        })).data);

    }
}