"use client"
import { useUi } from "@/contexts/UiContext";
import useSharedRoomData from "@/hooks/use-shared-room-data";
import { useUpdateRoomData } from "@/hooks/use-update-room-data";
import { useCallback, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

export function UpdateRoomName({ roomId, isHost }: { roomId: string, isHost: boolean }) {
    const { activateTrigger, ui: { activeTrigger }, deactivateTrigger } = useUi();
    const { mutate, isPending } = useUpdateRoomData(roomId);
    const { name: currentName } = useSharedRoomData(roomId);
    const [name, setName] = useState("");
    const MAX = 50;

    const onOpenChange = (value: boolean) => {
        if (value) {
            setName(currentName ?? ""); // seed with current name
            activateTrigger("update-room-name-dialog");
        } else {
            deactivateTrigger();
        }
    };

    const handleSubmit = useCallback(() => {
        const trimmed = name.trim();
        if (!isHost) return toast.error("You do not have the permission to update this room's name");
        if (!trimmed) return;
        if (trimmed === currentName) return deactivateTrigger();
        if (trimmed.length > MAX) return toast.error("Room name cannot exceed 50 characters.");
        mutate({ name: trimmed }, { onSuccess: () => deactivateTrigger() });
    }, [name, currentName, mutate]);
    return (
        <Dialog open={activeTrigger === "update-room-name-dialog"} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 max-w-[280px] group cursor-pointer">
                    <span className="text-[12px] font-bold text-muted-foreground truncate">
                        {currentName}
                    </span>
                    <Pencil className="h-3 w-3 text-muted-foreground/60 flex-shrink-0 transition-colors group-hover:text-muted-foreground" />
                </button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Rename room</DialogTitle>
                    <DialogDescription>
                        Update the name of this room. Max 50 characters.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-2">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="room-name" className="text-xs text-muted-foreground">
                                Room Name
                            </Label>
                            <span className={cn(
                                "text-[10px] tabular-nums",
                                name.length > MAX ? "text-destructive" : "text-muted-foreground"
                            )}>
                                {name.length}/{MAX}
                            </span>
                        </div>
                        <Input
                            id="room-name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="what are you building?"
                            disabled={isPending}
                            maxLength={MAX}
                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button size="sm" variant="ghost" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        disabled={!name.trim() || name.length > MAX || isPending || name.trim() === currentName}
                    >
                        {isPending && <Spinner className="size-3" />}
                        {isPending ? "Saving" : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}