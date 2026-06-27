"use client"
import { createRoom } from "@/app/rooms/_actions";
import { Runtime } from "@/generated/prisma/enums";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useCreateRoom() {
    return useMutation({
        mutationFn: async ({ name, runtime }: { name: string, runtime: Runtime }) => {
            const result = await createRoom(name, runtime);
            if (!result.success) {
                toast.error(result.message);
                return;
            }

            return result.data
        },
    })
}