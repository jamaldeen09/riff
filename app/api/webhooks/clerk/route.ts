import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma/client';
import { WebhookEvent } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
    if (!WEBHOOK_SECRET) throw new Error('Missing webhook secret');
    try {
        const headerPayload = await headers();
        const svix_id = headerPayload.get("svix-id");
        const svix_timestamp = headerPayload.get("svix-timestamp");
        const svix_signature = headerPayload.get("svix-signature");
        if (!svix_id || !svix_timestamp || !svix_signature) {
            return new Response('Error occured -- no svix headers', { status: 400 });
        }
        const payload = await req.json();
        const body = JSON.stringify(payload);
        const wh = new Webhook(WEBHOOK_SECRET);
        let evt: WebhookEvent
        try {
            evt = wh.verify(body, {
                "svix-id": svix_id,
                "svix-timestamp": svix_timestamp,
                "svix-signature": svix_signature,
            }) as WebhookEvent;
        } catch (err) {
            return new Response('Error occured', { status: 400 });
        }
        switch (evt.type) {
            case "user.created":

                const primaryEmail = evt.data.email_addresses.find(
                    (email) => email.id === evt.data.primary_email_address_id
                )?.email_address || evt.data.email_addresses[0]?.email_address;

                // Extract names and format fallback if fields are missing
                const firstName = evt.data.first_name || "";
                const lastName = evt.data.last_name || "";
                const fullName = `${firstName} ${lastName}`.trim() || evt.data.username || "Anonymous User";

                // Explicitly grab the required username
                const username = evt.data.username || `user_${evt.data.id.slice(-6)}`;

                await prisma.user.upsert({
                    where: {
                        id: evt.data.id,
                    },
                    create: {
                        id: evt.data.id,
                        name: fullName,
                        email: primaryEmail,
                        image: evt.data.image_url,
                        username: username,
                    },
                    update: {
                        id: evt.data.id,
                        name: fullName,
                        email: primaryEmail,
                        image: evt.data.image_url,
                        username: username,
                    }
                });

                console.log("[Riff] New user from clerk:", evt.data.id);
                break;

            case "user.deleted":

                try {
                    await prisma.user.delete({
                        where: { id: evt.data.id },
                        select: { id: true }
                    });
                    console.log("[Riff] User deleted account from clerk:", evt.data.id)
                } catch (err) {
                    if (err instanceof Prisma.PrismaClientKnownRequestError && (err as any).code === 'P2025')
                        return new Response("User no longer exists in the database", { status: 200 })

                    return new Response("Database error", { status: 500 });
                }
        }
        return new Response("", { status: 200 });
    } catch (err) {
        console.error("CRITICAL /api/webhooks/clerk error:", err);
        return new Response((err as any)?.message ?? "A server error occured", { status: 400 });
    }
}