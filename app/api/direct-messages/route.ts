import {currentProfile} from "@/lib/current-profile";
import {DirectMessage} from "@prisma/client";
import {db} from "@/lib/db";
import {NextResponse} from "next/server";

const MESSAGE_BATCH_SIZE = 10

export async function GET(
    request: Request,
) {
    try {
        const profile = await currentProfile()
        const {searchParams} = new URL(request.url)

        const cursor = searchParams.get("cursor")
        const conversationId = searchParams.get("conversationId")

        if(!profile) {
            return new Response("Unauthorized", { status: 401 })
        }

        if(!conversationId) {
            return new Response("Conversation ID missing", { status: 400 })
        }

        let messages: DirectMessage[] = [];

        if(cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH_SIZE,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            })
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGE_BATCH_SIZE,
                where: {
                    conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc",
                }
            })
        }

        let nextCursor = null

        if(messages.length === MESSAGE_BATCH_SIZE) {
            nextCursor = messages[MESSAGE_BATCH_SIZE - 1].id
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        })
    } catch (error) {
        console.log("[DIRECT_MESSAGES_GET]", error)
        return new Response("Internal Server Error", { status: 500 })
    }
}