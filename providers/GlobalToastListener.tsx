"use client";
import { useEventListener, useOthersListener, useStatus } from "@/liveblocks.config";
import { useStorage } from "@liveblocks/react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function GlobalToastListener() {
    const status = useStatus();
    const ready = useRef(false);
    const hostId = useStorage((root) => root.hostId);

    useEffect(() => {
        if (status !== "connected") return;
        const t = setTimeout(() => { ready.current = true; }, 800);
        return () => clearTimeout(t);
    }, [status]);

    useOthersListener(({ type, user }) => {
        if (!ready.current) return;
        if (user?.id === hostId) return; // ← host's presence stays silent

        const username = user?.info?.username ?? "Someone";
        if (type === "enter") toast.success(`${username} joined the room`);
        if (type === "leave") toast.info(`${username} left the room`);
    });

    useEventListener(({ event }) => {
        if (event.type === "TOAST_NOTIFICATION") 
            toast(event.message);
    });
    return null;
}