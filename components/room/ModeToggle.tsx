"use client"
import { Eye, Pencil, ChevronDown, Lock } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Mode } from "@/generated/prisma/enums";
import { useUpdateRoomData } from "@/hooks/use-update-room-data";
import { Spinner } from "../ui/spinner";

interface ModeType {
    value: Mode;
    label: string;
    description: string;
    Icon: typeof Pencil
}

const MODES: ModeType[] = [
    {
        value: "collaborative",
        label: "collaborative",
        description: "everyone can edit",
        Icon: Pencil
    },

    {
        value: "presentation",
        label: "presentation",
        description: "host drives, others watch",
        Icon: Eye
    },
];

export function ModeToggle({ mode, isHost, roomId }: {
    mode: Mode;
    isHost: boolean;
    roomId: string;
}) {
    const Icon = mode === "presentation" ? Eye : Pencil;
    const { mutate, isPending } = useUpdateRoomData(roomId);

    const trigger = (
        <button
            type="button"
            disabled={!isHost || isPending}
            className={cn(
                "group flex items-center gap-1.5 text-[11px] px-2.5 h-7 rounded-md border transition-colors",
                isPending
                    ? "border-border bg-surface/40 text-muted-foreground cursor-wait opacity-70"
                    : isHost
                        ? "border-border bg-surface/40 hover:bg-accent hover:border-border-strong text-foreground cursor-pointer"
                        : "border-border bg-surface/40 text-muted-foreground cursor-default opacity-80",
            )}
        >
            {isPending ? (
                <Spinner className="size-2.5 text-brand-soft" />
            ) : (
                <Icon size={11} className="text-brand-soft size-2.5" />
            )}
            <span>{isPending ? "updating..." : mode}</span>
            {!isPending && (
                isHost ? (
                    <ChevronDown size={10} className="text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                ) : (
                    <Lock size={9} className="text-muted-foreground" />
                )
            )}
        </button>
    );

    // Disable tooltip during pending — just return the trigger naked
    if (!isHost) {
        return (
            <Tooltip>
                <TooltipTrigger asChild disabled={isPending}>{trigger}</TooltipTrigger>
                {!isPending && (
                    <TooltipContent side="bottom" className="text-[10px]">
                        only the host can change the mode
                    </TooltipContent>
                )}
            </Tooltip>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isPending}>{trigger}</DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                {MODES.map(({ value, label, description, Icon: I }) => (
                    <DropdownMenuItem
                        key={value}
                        disabled={mode === value}
                        onClick={() => mutate({ mode: value })}
                        className="flex items-start gap-2.5 text-[11px] py-2"
                    >
                        <I size={12} className="mt-0.5 text-brand-soft" />
                        <div className="flex flex-col gap-0.5">
                            <span className={cn("text-foreground", mode === value && "text-brand-soft")}>
                                {label}
                                {mode === value && (
                                    <span className="ml-1.5 text-[9px] text-muted-foreground">active</span>
                                )}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{description}</span>
                        </div>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
