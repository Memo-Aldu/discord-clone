import {db} from "@/lib/db"

export const getConversation = async (memberOneId: string, memberTwoId: string) => {
    const conversation = await findConversation(memberOneId, memberTwoId) ||
        await findConversation(memberTwoId, memberOneId);
    if (conversation) {
        return conversation;
    } else {
        return await createNewConversation(memberOneId, memberTwoId);
    }
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.findFirst({
            where: {
                AND: [
                    {memberOneId: memberOneId},
                    {memberTwoId: memberTwoId},
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                },
            }
        });
    } catch {
        return null;
    }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
    try {
        return await db.conversation.create({
            data: {
                memberOneId: memberOneId,
                memberTwoId: memberTwoId,
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                },
            }
        })

    } catch {
        return null;
    }
}