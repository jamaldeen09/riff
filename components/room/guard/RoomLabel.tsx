export default function RoomLabel({ roomId }: { roomId: string }) {
    return (
      <p className="text-[9px] sm:text-[10px] text-muted-foreground tracking-widest uppercase">
        room / <span className="text-foreground">{roomId}</span>
      </p>
    )
  }