"use client";

import React, {Fragment, useRef, ElementRef} from 'react';
import {Member, Message, Profile} from "@prisma/client";
import ChatWelcome from "@/components/chat/chat-welcome";
import {useChatQuery} from "@/hooks/use-chat-hook";
import {Loader2, ServerCrash} from "lucide-react";
import ChatItem from "@/components/chat/chat-item";
import { format } from "date-fns";
import {useChatSocket} from "@/hooks/use-chat-socket";
import {useChatScroll} from "@/hooks/use-chat-sroll";

const DATE_FORMAT = "d MMM yyyy, HH:mm";

interface ChatMessagesProps {
    name: string;
    member: Member;
    chatId: string;
    apiUrl: string;
    socketUrl: string;
    query: Record<string, string>
    paramKey: "channelId" | "conversationId";
    paramValue: string;
    type: "channel" | "conversation";
}

type MessageWithMemberWithProfile = Message & {
    member: Member & {
        profile: Profile;
    }
}

const ChatMessages = ({
    name, member, chatId, apiUrl,
    socketUrl, query, paramKey, paramValue, type}: ChatMessagesProps) => {

    const queryKey = `chat:${chatId}`
    const addKey = `chat:${chatId}:messages`
    const updateKey = `chat:${chatId}:messages:update`

    const chatRef = useRef<ElementRef<"div">>(null);
    const bottomRef = useRef<ElementRef<"div">>(null);

    const {data, fetchNextPage,
        hasNextPage, isFetchingNextPage, status
    } = useChatQuery({queryKey, apiUrl, paramKey, paramValue})

    useChatSocket({queryKey, addKey, updateKey})
    useChatScroll({
        chatRef, bottomRef,
        loadMore: fetchNextPage,
        shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
        count: data?.pages?.[0]?.items?.length ?? 0
    })



  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }

    return (
        <div ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
            {!hasNextPage && <div className="flex-1"/> }
            {!hasNextPage && <ChatWelcome type={type} name={name}/> }
            {
                hasNextPage && (
                    <div className="flex justify-center">
                        <button
                            className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                            onClick={() => fetchNextPage()}
                            disabled={!hasNextPage || isFetchingNextPage}
                        >
                            {isFetchingNextPage ? <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4"/>
                                : <button
                                    onClick={() => fetchNextPage()}
                                    className="tex-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4
                                    dark:hover:text-zinc-300 transition">
                                    Load previous messages
                            </button>}
                        </button>
                    </div>
                )
            }
            <div className="flex flex-col-reverse mt-auto">
                {data?.pages.map((page, index) => (
                    <Fragment key={index}>
                        {page.items.map((message: MessageWithMemberWithProfile) => (
                            <ChatItem
                                key={message.id}
                                id={message.id}
                                currentMember={member}
                                content={message.content}
                                fileUrl={message.fileUrl}
                                deleted={message.deleted}
                                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                                isUpdate={message.updatedAt !== message.createdAt}
                                socketUrl={socketUrl}
                                socketQuery={query}
                                member={message.member}
                             />
                        ))}
                    </Fragment>
                ))}
            </div>
            <div ref={bottomRef}/>
        </div>
    );
};

export default ChatMessages;