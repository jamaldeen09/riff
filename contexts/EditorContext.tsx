"use client";
import { createContext, useContext, useRef, useState } from "react";

interface EditorContextValue {
    getContent: () => string;
    registerGetContent: (fn: () => string) => void;
    previewContent: string;
    setPreviewContent: (content: string) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({ children }: { children: React.ReactNode }) {
    const getContentRef = useRef<() => string>(() => "");
    const [previewContent, setPreviewContent] = useState("");

    return (
        <EditorContext.Provider value={{
            getContent: () => getContentRef.current(),
            registerGetContent: (fn) => { getContentRef.current = fn; },
            previewContent,
            setPreviewContent,
        }}>
            {children}
        </EditorContext.Provider>
    );
}

export const useEditor = () => {
    const ctx = useContext(EditorContext);
    if (!ctx) throw new Error("useEditor must be used inside EditorProvider");
    return ctx;
};