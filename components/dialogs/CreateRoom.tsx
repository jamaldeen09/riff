"use client"
import { useCallback, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Globe } from "lucide-react";
import NodeJsIcon from "../NodeJsIcon";
import { Runtime } from "@/generated/prisma/enums";
import { useUi } from "@/contexts/UiContext";
import { toast } from "sonner";
import useCreateRoom from "@/hooks/use-create-room";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

export function CreateRoom() {
    const { activateTrigger, ui: { activeTrigger }, deactivateTrigger } = useUi();
    const { mutate, isPending } = useCreateRoom();
    const { push } = useRouter();

    const [name, setName] = useState("");
    const [runtime, setRuntime] = useState<Runtime>("web");

    const onOpenChange = (value: boolean) => {
        if (value) activateTrigger("create-room-dialog")
        else deactivateTrigger()
    }

    const handleSubmit = useCallback(() => {
        const trimmed = name.trim();
        if (!trimmed) return;
        else if (trimmed.length > 50) return toast.error("Room name cannot be longer than 50 characters.")

        else mutate({ name: trimmed, runtime }, {
            onSuccess: (data) => {
                const roomId = data?.room.id
                if (!roomId) return;

                const path = `${process.env.NEXT_PUBLIC_APP_URL}/room/${roomId}`;
                push(path);
                deactivateTrigger();
            }
        })
    }, [name, runtime, mutate]);
    return (
        <Dialog open={activeTrigger === "create-room-dialog"} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a room</DialogTitle>
                    <DialogDescription>
                        Spin up a live coding room. Anyone with the link can join.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="room-name" className="text-xs text-muted-foreground">
                            Room Name (max 50 characters)
                        </Label>
                        <Input
                            id="room-name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="what are you building?"
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Runtime ({runtime === "web" ? "Web" : "Node JS"})</Label>
                        <ToggleGroup
                            type="single"
                            value={runtime}
                            onValueChange={(v) => v && setRuntime(v as Runtime)}
                            variant="outline"
                            disabled={isPending}
                        >
                            <ToggleGroupItem value="web" >
                                <Globe className="size-2.5" />
                                Web
                            </ToggleGroupItem>
                            <ToggleGroupItem value="node_js">
                                <NodeJsIcon className="size-2.5" />
                                Node JS
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button size="sm" onClick={handleSubmit} disabled={(!name.trim() || name.length > 50 || isPending)}>
                        {isPending && (<Spinner className="size-3" />)}
                        {isPending ? "Creating" : "Continue"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}