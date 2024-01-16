import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { MemberRole } from "@prisma/client"
import { NextResponse } from "next/server"

export async function DELETE(
    req: Request,
    {params}: {params: {channelId: string}}
) {
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(req.url)

        const serverId = searchParams.get("serverId")
        const channelId = params.channelId

        if(!profile) {
            return new NextResponse("Unauthorized", {status: 401})
        
        }
        
        if (!serverId) {
            return new NextResponse("Server id missing", {status: 400})
        }

        if (!channelId) {
            return new NextResponse("Channel id missing", {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (e) {
        console.error("[CHANNEL_ID_DELETE]", e)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}


export async function PATCH(
    req: Request,
    {params}: {params: {channelId: string}}
) {
    try {
        const profile = await currentProfile()
        const {name, type} = await req.json()
        const {searchParams} = new URL(req.url)

        const serverId = searchParams.get("serverId")
        const channelId = params.channelId

        if(!profile) {
            return new NextResponse("Unauthorized", {status: 401})
        
        }
        
        if (!serverId) {
            return new NextResponse("Server id missing", {status: 400})
        }

        if (!channelId) {
            return new NextResponse("Channel id missing", {status: 400})
        }

        if (!name) {
            return new NextResponse("Channel name missing", {status: 400})
        }

        if (!type) {
            return new NextResponse("Channel type missing", {status: 400})
        }

        if(name === "general") {
            return new NextResponse("Channel name cannot be 'general", {status: 400})
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: channelId,
                            NOT: {
                                name: "general"
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (e) {
        console.error("[CHANNEL_ID_PATCH]", e)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}