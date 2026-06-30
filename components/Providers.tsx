"use client"
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { UiProvider } from "@/contexts/UiContext";
import { LiveBlocksProvider } from "@/providers/LiveBlocksProvider";
import { TooltipProvider } from "./ui/tooltip";
import { EditorProvider } from "@/contexts/EditorContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <UiProvider>
                <ClerkProvider>
                    <TanstackQueryProvider>
                        <LiveBlocksProvider>
                            <TooltipProvider delayDuration={150}>
                                <EditorProvider>
                                {children}
                                </EditorProvider>
                            </TooltipProvider>
                        </LiveBlocksProvider>
                    </TanstackQueryProvider>
                </ClerkProvider>
            </UiProvider>
        </ThemeProvider>
    )
}