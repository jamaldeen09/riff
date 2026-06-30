"use server"
import { Mode } from "@/generated/prisma/enums";
import { getPrismaErrorMessage, prisma } from "@/lib/prisma";

export async function getRoomData (roomId: string, fields?:  ("hostId" | "name" | "createdAt" | "mode")[]): Promise<{
    success: boolean;
    message: string;
    data?: {
        room: { id: string } & Partial<{
            hostId: string;
            name: string;
            createdAt: Date;
            mode: Mode;
        }>
    }
}> {
    try {
        const selectPayload: Record<string, boolean> = { id: true };
        if (fields) 
            fields.forEach((field) => selectPayload[field] = true);

        const room = await prisma.room.findUnique({
            where: { id: roomId },
            select: selectPayload
        });

        if (!room) {
            return {
                success: false,
                message: "The requested room does not exist."
            }
        }

        return {
            success: true,
            message: "Successfully fetched room",
            data: { room } as any
        }    
    } catch (err) {
        console.error("[getRoomData()] error:", err);
        return {
            success: false,
            message: getPrismaErrorMessage(err)
        }
    }
}


export async function updateRoomData(
    roomId: string, 
    data: Partial<{ name: string; mode: Mode }>
) {
    // Block empty modifications immediately
    if (!data || Object.keys(data).length <= 0) {
        return {
            success: false,
            message: "No configuration fields were provided for updating."
        };
    }

    // Build explicit selection mask matching incoming keys
    const select: Record<string, boolean> = { id: true };
    if (data.mode) select["mode"] = true;
    if (data.name) select["name"] = true;
    try {
        const updatedRoomData = await prisma.room.update({
            where: { id: roomId },
            data,
            select
        });

        console.log("Updated room data:", updatedRoomData);
        return {
            success: true,
            message: "Workspace configurations updated successfully.",
            data: { room: updatedRoomData }
        };
    } catch (err) {
        console.error("[updateRoomData()] error:", err);
        return {
            success: false,
            message: getPrismaErrorMessage(err) || "An unexpected error occurred while modifying room settings."
        };
    }
}