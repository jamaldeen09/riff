"use client";
import { getRoomData } from "@/app/room/[roomId]/_actions";
import { useQuery } from "@tanstack/react-query";

export function useRoomData(roomId: string, fields?: ("hostId" | "name" | "createdAt" | "mode")[]) {
  return useQuery({
    queryKey: ["room-metadata", roomId, fields],
    
    queryFn: async () => {
      const response = await getRoomData(roomId, fields);
      if (!response.success || !response.data) 
        throw new Error(response.message)

      return response.data.room;
    },
    enabled: !!roomId,
    staleTime: 1000 * 60 * 5,
  });
}