"use client"
import { useEffect, useState } from "react";
import { useRoomData } from "./use-room-data"
import { Mode } from "@/generated/prisma/enums";
import { useEventListener } from "@/liveblocks.config";

export default function useSharedRoomData(roomId: string) {
    const { 
        data: room, 
        isPending: isFetchingRoomData 
    } = useRoomData(roomId, ["name", "mode", "hostId"]);

    const [mode, setMode] = useState<Mode | null>(null);
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        if (room?.mode) setMode(room.mode);
        if (room?.name) setName(room.name)
    }, [room?.mode, room?.name]);

    useEventListener(({ event }) => {
        switch (event.type) {
            case "ROOM_MODE_CHANGED":
                setMode(event.mode)
                break;

            case "ROOM_NAME_CHANGED":
                setName(event.name)
                break;
        }
    });

    return { mode, name, isFetchingRoomData, hostId: room?.hostId }
}