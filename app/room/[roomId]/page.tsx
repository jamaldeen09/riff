import { EditorPane } from "@/components/room/EditorPane";
import { PreviewPane } from "@/components/room/PreviewPane";
import { Topbar } from "@/components/room/TopBar";

export default async function RoomViewPage({ params }: { params: Promise<{ roomId: string }> }) {
  const { roomId } = await params
  return (
    <div className="dark flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <Topbar roomId={roomId} />

      <div className="flex flex-1 overflow-hidden">
        <EditorPane roomId={roomId} />
        <div className="w-[40%] min-w-[320px] shrink-0">
          <PreviewPane />
        </div>
      </div>
    </div>
  );
}