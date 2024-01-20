"use client";

import qs from "query-string";
import {usePathname,  useRouter, useSearchParams} from "next/navigation";
import { Video, VideoOff} from "lucide-react";
import {ActionTooltip} from "@/components/action-tooltip";

import React from 'react';

const ChatVideoButton = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
    const isVideoOn = searchParams?.get("video")

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname || "",
            query: {
                video: isVideoOn ? undefined : true
            }
        }, {skipNull: true})
        router.push(url)
    }

    const Icon = isVideoOn ? VideoOff : Video;
    const label = isVideoOn ? "Turn off video" : "Turn on video";
    return (
        <ActionTooltip label={label} side="bottom">
            <button onClick={onClick} className="hover:opacity-65 transition mr-4">
                <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400"/>
            </button>
        </ActionTooltip>
    );
};

export default ChatVideoButton;