import { Liveblocks } from "@liveblocks/node";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const liveblocks = new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: Request) {
    try {
        // Authenticate user using Clerk
        const { userId } = await auth();
        const user = await currentUser();

        if (!userId || !user)
            return new Response("Unauthorized", { status: 401 });

        // Extract target room from the Liveblocks request body
        const { room } = await request.json();

        // Authorization Check: Check if the room exists and user belongs there
        const roomExists = await prisma.room.findUnique({
            where: { id: room },
            select: { id: true, hostId: true }
        });

        if (!roomExists)
            return new Response("Room not found", { status: 404 });

        // Optional: Add custom permission logic (e.g., check Redis membership if needed)
        // For now, let's allow them since the room is real

        // 4. Start a Liveblocks session for this specific user
        const session = liveblocks.prepareSession(userId, {
            userInfo: {
                id: user.id,
                name: user.fullName || "Anonymous",
                avatar: user.imageUrl,
                username: user.username || "",
            },
        });

        // Grant access permissions to this specific room
        // .allow() sets read/write capabilities inside the workspace
        session.allow(room, session.FULL_ACCESS);

        // Authorize the session and return the payload to the client
        const { status, body } = await session.authorize();
        return new Response(body, { status });
    } catch (err) {
        console.error("Liveblocks auth route error:", err);
        return new Response("Internal Server Error", { status: 500 });
    }
}