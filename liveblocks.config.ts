import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { Mode } from "./generated/prisma/enums";

const client = createClient({
    authEndpoint: "/api/liveblocks-auth",
});

type Presence = {
    isTyping?: boolean;
};

export type Storage = {
    hostId: string;
};

export type RoomEvent =
    | { type: "TOAST_NOTIFICATION"; message: string; variant?: "default" | "destructive" | "success" }
    | { type: "ROOM_MODE_CHANGED"; mode: Mode }
    | { type: "ROOM_NAME_CHANGED"; name: string }
    | { type: "KICK_USER"; userId: string };

type UserMeta = {
    id: string;
    info: {
        id: string;
        name: string;
        avatar: string;
        username: string;
    };
};

export const {
    RoomProvider,
    useRoom,
    useMyPresence,
    useOthers,
    useUpdateMyPresence,
    useBroadcastEvent,
    useEventListener,
    useSelf,   
    useOthersListener, 
    useStatus,
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);