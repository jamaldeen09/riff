"use client"
import { useUi } from "@/contexts/UiContext";
import { useAuth } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";
import Members from "./Members";
import { ModeToggle } from "./ModeToggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Button } from "../ui/button";
import LeaveRoomConfirmation from "../dialogs/LeaveRoomConfirmation";
import useSharedRoomData from "@/hooks/use-shared-room-data";
import { UpdateRoomName } from "../dialogs/UpdateRoomName";

export function Topbar({ roomId }: { roomId: string }) {
  const { activateTrigger } = useUi();
  const { userId: currentUserId, isLoaded: isAuthLoaded } = useAuth();
  const { mode, name, hostId, isFetchingRoomData } = useSharedRoomData(roomId);
  const isLoading = isFetchingRoomData || !isAuthLoaded;
  const isHost = !isLoading && hostId === currentUserId;
  const canLeaveRoom = !isLoading && !isHost;
  return (
    <header className="relative h-12 flex items-center justify-between px-4 border-b border-border bg-surface/60 backdrop-blur-sm flex-shrink-0">
      {/* left — brand + room */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center text-[15px] font-semibold tracking-tight">
          <span className="text-foreground text-sm">Riff</span>
          <span className="text-brand">.</span>
        </div>
        <Separator orientation="vertical" />
        {isLoading || !name ? (
          <Skeleton className="max-w-[280px] h-4" />
        ) : isHost ? (
          <UpdateRoomName roomId={roomId} isHost={isHost} />
        ) : (
          <span className="text-[12px] font-bold text-muted-foreground truncate" title={name}>
            {name}
          </span>
        )}
      </div>

      {/* center — members */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
        <Members />
      </div>

      {/* right — controls */}
      <div className="flex items-center gap-2">
        {/* live indicator */}
        <div className="flex items-center gap-1.5 mr-1 pr-2 border-r border-border">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-60 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-live" />
          </span>
          <span className="text-[10px] uppercase tracking-wider text-live">live</span>
        </div>

        {isLoading ? (
          <Skeleton className="w-36 h-7" />
        ) : (
          <ModeToggle mode={mode ?? "collaborative"} isHost={isHost} roomId={roomId} />
        )}

        {canLeaveRoom && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => activateTrigger("leave-room-confirmation-dialog")}
                >
                  <LogOut size={14} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-[10px]">
                leave room
              </TooltipContent>
            </Tooltip>
            <LeaveRoomConfirmation />
          </>
        )}
      </div>
    </header>
  );
}