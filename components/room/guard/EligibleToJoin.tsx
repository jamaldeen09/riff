"use client"
import { Button } from "@/components/ui/button";
import Gate, { GateHeader } from "./Gate";

export default function EligibleToJoinRoom({ roomId, onJoin }: { roomId: string; onJoin: () => void }) {
    return (
        <Gate addWordMark addLabel roomId={roomId}>
            <GateHeader title="You're not in this room yet" description="join to start coding together" />
            <Button onClick={onJoin} size="lg" className="mt-2">
                Join room
            </Button>
        </Gate>
    )
}