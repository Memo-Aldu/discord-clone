import { currentProfile } from "@/lib/current-profile";
import { NextResponse } from "next/server";
import { db} from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function PATCH (
    req: Request,
    {params}: {params: {serverId: string}}
) {
    try {
        const profile = await currentProfile();
        const {name, imageUrl} = await req.json();
        console.log("serverId", params.serverId);
        if(!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!params.serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }
         
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.error("[SERVER_ID_PATCH", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}