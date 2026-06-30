"use client"
import { useState } from "react";
import { Play, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor } from "@/contexts/EditorContext";
import { Spinner } from "../ui/spinner";

export function PreviewPane() {
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const { getContent, setPreviewContent, previewContent } = useEditor();

  const handleRun = () => {
    if (running) return;
    setRunning(true);
    setIframeKey((k) => k + 1);
    setPreviewContent(getContent());
    setRunning(false);
    setRan(true);
  };
  return (
    <div className="flex flex-col h-full border-l border-border bg-stage">
      {/* panel bar */}
      <div className="h-9 flex items-center justify-between px-3 border-b border-border bg-surface/40 flex-shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Globe size={11} className="text-brand-soft" />
          <span>Web</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            onClick={handleRun}
            disabled={running}
          >
            {running ? (<Spinner />) : (<Play fill="currentColor" />)}
            <span>{running ? "Running" : "Run"}</span>
          </Button>
        </div>
      </div>

      {/* body */}
      <div className="flex-1 overflow-hidden relative bg-stage">
        {ran && previewContent && (
          <iframe
            key={iframeKey}
            srcDoc={previewContent}
            sandbox="allow-scripts"
            className="w-full h-full border-none bg-white"
            title="preview"
          />
        )
        }
      </div>
    </div>
  );
}
