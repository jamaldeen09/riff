import CatchPageRefreshesInRoom from "@/providers/CatchPageRefreshesInRoom";
import { GlobalToastListener } from "@/providers/GlobalToastListener";
import { RoomGuard } from "@/providers/RoomGuard";

export default async function RoomViewLayout({ children, params }: {
    children: React.ReactNode,
    params: Promise<{ roomId: string }>
}) {
    const { roomId } = await params;
    return (
        <RoomGuard roomId={roomId}>
            <CatchPageRefreshesInRoom />
            <GlobalToastListener />
            {children}
        </RoomGuard>
    )
}
