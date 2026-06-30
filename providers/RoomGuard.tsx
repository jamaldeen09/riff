"use client";
import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { RoomProvider } from "@/liveblocks.config";
import { useRoomData } from "@/hooks/use-room-data";
import Gate, { GateHeader } from "@/components/room/guard/Gate";
import { Spinner } from "@/components/ui/spinner";
import ErrorOccured from "@/components/room/guard/ErrorOccured";
import EligibleToJoinRoom from "@/components/room/guard/EligibleToJoin";

export function RoomGuard({ children, roomId }: { children: React.ReactNode, roomId: string }) {
  const { userId: currentUserId, isLoaded: isAuthLoaded } = useAuth();
  const { data: room, isLoading: isRoomLoading, error } = useRoomData(roomId, ["hostId"]);
  const [hasJoined, setHasJoined] = useState(false);
  const isHost = (room?.hostId ?? "") === currentUserId;

  // Loading state
  if (!isAuthLoaded || isRoomLoading) {
    return (
      <Gate>
        <GateHeader reactElement={(
          <React.Fragment>
            <Spinner className="size-5 text-muted-foreground" />
            <p className="text-[11px] text-muted-foreground animate-pulse">
              checking room...
            </p>
          </React.Fragment>
        )} />
      </Gate>
    );
  }

  // Handle errors
  if (error || !room || !currentUserId)
    return <ErrorOccured errMsg={error?.message ?? "An unexpected error occured"} roomId={roomId} />

  // If the user isn't a host and they have not joined
  // ask them if they would like to join the room
  if (!isHost && !hasJoined)
    return <EligibleToJoinRoom roomId={roomId} onJoin={() => setHasJoined(true)} />

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ isTyping: false }}
      initialStorage={{ hostId: room.hostId! }}
    >
      {children}
    </RoomProvider>
  );
}