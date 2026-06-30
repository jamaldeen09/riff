"use server"
import { getPrismaErrorMessage, prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createRoom(name: string) {
    // Validate the provided name again (for safety)
    if (!name || typeof name !== "string" || name.length > 50) {
        return {
            success: false,
            message: "Room name must be a valid text string under 50 characters.",
        }
    }

    try {
        // Make sure the user is authenticated
        const { isAuthenticated, userId } = await auth();
        if (!isAuthenticated || !userId) {
            return {
                success: false,
                message: "Authentication required. Please sign in to create a room.",
            }
        }

        const room = await prisma.room.create({
            data: {
                name,
                hostId: userId
            },

            select: { id: true }
        });

        return {
            success: true,
            message: "Room created successfully.",
            data: { room },
        }
    } catch (err) {
        console.error("[createRoom()] error:", err);
        return {
            success: false,
            message: getPrismaErrorMessage(err, "An unexpected error occured while attempting to create your room.")
        }
    }
}