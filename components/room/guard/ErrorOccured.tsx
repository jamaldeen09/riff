import { AlertCircle } from "lucide-react";
import Gate, { GateHeader } from "./Gate";

export default function ErrorOccured({ errMsg, roomId }: { errMsg: string; roomId: string; }) {
  return (
    <Gate addLabel roomId={roomId}>
      <GateHeader reactElement={(
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 border border-destructive/20">
          <AlertCircle size={18} className="text-destructive" />
        </div>
      )}
      />
      <div className="flex flex-col gap-1">
        <p className="text-sm text-foreground font-medium">
          Something went wrong
        </p>
        <p className="text-[11px] text-muted-foreground">
          {errMsg}
        </p>
      </div>
    </Gate>
  )
}