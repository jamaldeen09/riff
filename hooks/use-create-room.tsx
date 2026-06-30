"use client"
import { createRoom } from "@/app/rooms/_actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useCreateRoom() {
    return useMutation({
        mutationFn: async ({ name }: { name: string }) => {
            const result = await createRoom(name);
            if (!result.success) {
                toast.error(result.message);
                return;
            }

            return result.data
        },
    })
}