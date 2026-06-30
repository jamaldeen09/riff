"use client";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
    AvatarGroup,
} from "@/components/ui/avatar";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { UserMinus } from "lucide-react";
import { useOthers, useBroadcastEvent, useEventListener, useSelf } from "@/liveblocks.config";
import { useStorage } from "@liveblocks/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Members({ roomId }: { roomId: string }) {
    const router = useRouter();
    const broadcast = useBroadcastEvent();

    // Get the current authenticated user's state from the Liveblocks socket connection
    const me = useSelf();
    
    // Read the real-time connected peer arrays
    const others = useOthers();
    
    // Fetch the room's persistent hostId from your shared Liveblocks storage schema
    const hostId = useStorage((root) => root.hostId);

    useEventListener(({ event }) => {
        if (event.type === "KICK_USER" && event.userId === me?.id) {
            toast.error(`You have been removed from a room by the host`);
            router.push("/rooms");
        }
    });

    // 4. Loading fallback state while the socket connection settles
    if (!me || !hostId) {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-7 w-7 rounded-full border-2 border-background" />
                    ))}
                    <Skeleton className="h-7 w-7 rounded-full" />
                </div>
                <Skeleton className="h-4 w-12" />
            </div>
        );
    }

    // 5. Structure the active user dataset list by combining yourself and connected peers
    // Extracting user metadata mapped from your clerk setup via liveblocks-auth route
    const currentUser = {
        id: me.id,
        username: me.info?.username || "Anonymous",
        image: me.info?.avatar,
    };

    const externalMembers = others.map((user) => ({
        id: user.id,
        username: user.info.username || "Anonymous",
        image: user.info.avatar,
    }));

    const allMembers = [currentUser, ...externalMembers];
    const isHost = hostId === me.id;

    function getInitials (str: unknown):string {
        if (typeof str !== "string" || !str) return "??";
        const trimmed = str.trim()
        return trimmed.charAt(0).toUpperCase() + trimmed.charAt(str.length - 1).toUpperCase()
    }
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-2 cursor-pointer outline-none bg-transparent border-none p-0">
                    <AvatarGroup>
                        {allMembers.map((member) => (
                            <Avatar key={member.id} className="h-7 w-7 border-2 border-background">
                                <AvatarImage src={member.image ?? ""} alt={(typeof member.username === "string" ? member.username : "Anonymous user")} />
                                <AvatarFallback className="text-[10px] font-semibold text-white">
                                    {getInitials(member.username)}
                                </AvatarFallback>
                             </Avatar>
                        ))}
                    </AvatarGroup>
                    <span className="text-[11px] text-muted-foreground">
                        {allMembers.length} in room
                    </span>
                </button>
            </PopoverTrigger>

            <PopoverContent
                side="bottom"
                align="center"
                className="w-56 p-1.5 mt-1"
            >
                <p className="text-xs text-muted-foreground px-2 py-1.5 font-mono">
                    Members
                </p>
                <div className="flex flex-col gap-0.5">
                    {allMembers.map((member) => {
                        return (
                            <div
                                key={member.id}
                                className="cursor-default flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-accent transition-colors"
                            >
                                <div className="relative flex-shrink-0">
                                    <Avatar className="h-6 w-6">
                                        <AvatarImage src={member.image ?? ""} alt={(typeof member.username === "string" ? member.username : "Anonymous user")} />
                                        <AvatarFallback className="text-[9px] font-semibold text-white">
                                            {/* {getInitials(member.username)} */}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-[12px] text-foreground truncate leading-none">
                                        {(typeof member.username === "string" && member.username) ?? "Anonymous user"}
                                    </span>

                                    <span className="text-[9px] text-muted-foreground leading-none mt-1">
                                        {hostId === member.id ? "host" : "member"} {me.id === member.id && "(You)"}
                                    </span>
                                </div>

                                {/* Kick Button: Only rendered if you are the host, and the target row is not you */}
                                {(isHost && hostId !== member.id) && (
                                    <Button
                                        variant="destructive"
                                        size="icon-sm"
                                        onClick={() => {
                                            broadcast({ 
                                                type: "KICK_USER", 
                                                userId: member.id as string
                                            });
                                            toast.success(`Removed ${member.username || "Anonymous"} from the room`);
                                        }}
                                        aria-label={`Kick ${member.username || "Anonymous"}`}
                                    >
                                        <UserMinus className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}