"use client"
import { useUi } from "@/contexts/UiContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "../ui/button";
import { useState } from "react";
import { Spinner } from "../ui/spinner";
import { useRoom } from "@liveblocks/react";
import { useRouter } from "next/navigation";

export default function LeaveRoomConfirmation() {
    const [leaving, setLeaving] = useState(false);
    const { activateTrigger, deactivateTrigger, ui } = useUi();
    const room = useRoom();
    const { push } = useRouter();

    const onOpenChange = (value: boolean) => {
        if (value) activateTrigger("leave-room-confirmation-dialog")
        else deactivateTrigger()
    }

    const leaveRoom = async () => {
        setLeaving(true);
        try {
            room.disconnect();
            deactivateTrigger();
            push("/rooms");
        } catch (error) {
            console.error("Failed to disconnect from room safely:", error);
            setLeaving(false);
        } finally { setLeaving(false) }
    };
    return (
        <Dialog open={ui.activeTrigger === "leave-room-confirmation-dialog"} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Leave this room?</DialogTitle>
                    <DialogDescription>
                        You'll lose your spot — if the room fills up while you're gone, you won't be able to rejoin.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button size="sm" disabled={leaving} onClick={leaveRoom}>
                        {leaving && (<Spinner />)}
                        {leaving ? "Leaving..." : "Continue"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}