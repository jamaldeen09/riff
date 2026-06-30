import { cn } from "@/lib/utils";
import Wordmark from "./WordMark";
import RoomLabel from "./RoomLabel";

export function GateHeader({
  title,
  description,
  reactElement,
  className,
}: {
  reactElement?: React.ReactElement;
  title?: string;
  description?: string;
  className?: string;
}) {
  if (reactElement)
    return reactElement

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <p className="text-sm text-foreground font-medium">
        {title}
      </p>
      <p className="text-[11px] text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

export default function Gate({
  children,
  addWordMark = false,
  addLabel = false,
  roomId,
}: {
  children: React.ReactNode;
  addWordMark?: boolean;
  addLabel?: boolean;
  roomId?: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-4 text-center w-fit ">
        {addWordMark && (<Wordmark />)}
        {children}
        {(addLabel && roomId) && (<RoomLabel roomId={roomId} />)}
      </div>
    </div>
  )
}