"use client";

import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles;
    role: MemberRole | undefined;
}

export const ServerHeader = ({server, role} : ServerHeaderProps) => {

    const { onOpen } = useModal();

    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none" asChild>
                <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200
                dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
                dark:hover:bg-zinc-700/50 transition">
                    {server.name}
                    <ChevronDown className="ml-auto h-5 w-5"/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400
            space-y-[2px]">
                {isModerator && (
                    <DropdownMenuItem 
                    onClick={() => onOpen("invite", { server })}
                    className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm
                    cursor-pointer">
                        Invite People
                        <UserPlus className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>)}

                    {isAdmin && (
                    <DropdownMenuItem 
                    onClick={() => onOpen("editServer", { server })}
                    className="px-3 py-2 text-sm cursor-pointer">
                        Server Settings
                        <Settings className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>)}

                    {isAdmin && (
                    <DropdownMenuItem 
                    onClick={() => onOpen("members", { server })}
                    className="px-3 py-2 text-sm cursor-pointer">
                        Manage Members
                        <Users className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>)}

                    {isModerator && (
                    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer">
                        Create Channel
                        <PlusCircle className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>)}

                    {isModerator && (
                        <DropdownMenuSeparator className="my-1"/>
                    )}

                    {isAdmin && (
                    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer text-rose-500">
                        Delete Server
                        <Trash className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>)}

                    {!isAdmin && (
                    <DropdownMenuItem className="px-3 py-2 text-sm cursor-pointer text-rose-500">
                        Leave Server
                        <LogOut className="ml-auto h-4 w-4"/>
                    </DropdownMenuItem>)}
            </DropdownMenuContent>
        </DropdownMenu>
    )
};