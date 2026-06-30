"use client";
import { useRoom } from "@/liveblocks.config";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useEffect, useRef } from "react";
import { MonacoBinding } from "y-monaco";
import type * as Monaco from "monaco-editor";
import { useEditor } from "@/contexts/EditorContext";
import useSharedRoomData from "@/hooks/use-shared-room-data";

const htmlStarter = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Riff</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; paddig: 0; }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0f;
      font-family: system-ui, sans-serif;
      color: #fff;
    }

    .card {
      text-align: center;
      padding: 2.5rem 3rem;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      background: rgba(255,255,255,0.03);
    }

    h1 { font-size: 2rem; font-weight: 700; letter-spacing: -0.03em; }
    h1 span { color: #a78bfa; }
    p { margin-top: 0.75rem; font-size: 0.9rem; color: rgba(255,255,255,0.4); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, <span>Riff</span> 🎸</h1>
    <p>Start editing to see your changes live.</p>
  </div>
</body>
</html>`;


export function EditorPane({ roomId }: { roomId: string; }) {
    const room = useRoom();
    const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
    const providerRef = useRef<LiveblocksYjsProvider | null>(null);
    const docRef = useRef<Y.Doc | null>(null);
    const { registerGetContent } = useEditor();
    const { mode } = useSharedRoomData(roomId);
    const isPresentation = mode === "presentation";

    useEffect(() => {
        const doc = new Y.Doc();
        const provider = new LiveblocksYjsProvider(room, doc);
        docRef.current = doc;
        providerRef.current = provider;

        return () => {
            doc.destroy();
            provider.destroy();
        };
    }, [room]);

    function handleEditorMount(editor: Monaco.editor.IStandaloneCodeEditor) {
        editorRef.current = editor;
        registerGetContent(() => editor.getValue());
        const doc = docRef.current!;
        const yText = doc.getText("monaco");
        const model = editor.getModel()!;

        new MonacoBinding(
            yText,
            model,
            new Set([editor]),
            providerRef.current!.awareness as any
        );
    }

    return (
        <Editor
            height="100vh"
            language="html"
            defaultLanguage="html"
            defaultValue={htmlStarter}
            theme="vs-dark"
            onMount={handleEditorMount}
            options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 16 },
                readOnly: isPresentation,
                renderValidationDecorations: isPresentation ? "off" : "on",
            }}
        />
    );
}