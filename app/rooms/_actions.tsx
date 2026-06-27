"use server"
import { Runtime } from "@/generated/prisma/enums";
import { getPrismaErrorMessage, prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createRoom(name: string, runtime: Runtime) {
    // Validate the provided name again (for safety)
    if (!name || typeof name !== "string" || name.length > 50) {
        return {
            success: false,
            message: "Room name must be a valid text string under 50 characters.",
        }
    }

    // Validate the provided runtime value as well
    if (!runtime || !((["node_js", "web"] as Runtime[]).includes(runtime))) {
        return {
            success: false,
            message: "The requested runtime environment is unsupported.",
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
                runtime,
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
        return {
            success: false,
            message: getPrismaErrorMessage(err, "An unexpected error occured while attempting to create your room.")
        }
    }
}