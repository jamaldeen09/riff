"use client";
import { useSelf, useStorage } from "@liveblocks/react";
import { useEffect } from "react";

export default function CatchPageRefreshesInRoom() {
    // Pull the host's Clerk ID from the Liveblocks shared room state
    const roomHostId = useStorage((root) => root.hostId);
    
    // Pull the current active user's internal ID metadata profile block
    const me = useSelf();
    const currentUserId = me?.id;

    useEffect(() => {
        // If the workspace data hasn't loaded yet, don't bind anything
        if (!roomHostId || !currentUserId) return;

        // If the user matches the host database ID, bail out completely!
        // The host can leave, close tabs, or reload cleanly without any annoying browser popups.
        if (currentUserId === roomHostId) return;

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = ""; 
            return "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [roomHostId, currentUserId]);

    return null;
}