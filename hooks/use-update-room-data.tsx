"use client";
import { updateRoomData } from "@/app/room/[roomId]/_actions";
import { Mode } from "@/generated/prisma/enums";
import { useBroadcastEvent } from "@/liveblocks.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateRoomData(roomId: string) {
    const queryClient = useQueryClient();
    const broadcast = useBroadcastEvent();

    return useMutation({
        // Define mutation function payload contract types
        mutationFn: async (variables: Partial<{ name: string; mode: Mode }>) => {
            const result = await updateRoomData(roomId, variables);
            if (!result.success) throw new Error(result.message);
            return result.data?.room;
        }, 
        
        // Optimistic UI synchronization or straightforward cache invalidation updates
        onSuccess: (data) => {
            console.log("Data:", data)
            if (data?.mode) {
                const label = data.mode === "presentation" ? "presentation" : "collaborative";
                toast.info(`Mode switched to ${label}`);
                broadcast({ 
                    type: "ROOM_MODE_CHANGED", 
                    mode: data.mode 
                });
                broadcast({ 
                    type: "TOAST_NOTIFICATION", 
                    message: `Mode switched to ${label}`, 
                    variant: "default" 
                });
            }

            if (data?.name) {
                toast.info("Room's name has been changed to:", data.name);
                broadcast({ type: "ROOM_NAME_CHANGED", name: data.name });
                broadcast({ 
                    type: "TOAST_NOTIFICATION",
                    message: `Room's name has been changed to: ${data.name}`, 
                    variant: "default" 
                });
            }

            // Invalidate the fetch query you built earlier to force fresh layouts
            queryClient.invalidateQueries({
                queryKey: ["room-metadata", roomId]
            });
        },
        
        onError: (error: Error) => 
            toast.error(error.message || "Failed to update room data parameters")
    });
}