"use client"
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { UiProvider } from "@/contexts/UiContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <UiProvider>
                <ClerkProvider>
                    <TanstackQueryProvider>
                        {children}
                    </TanstackQueryProvider>
                </ClerkProvider>
            </UiProvider>
        </ThemeProvider>
    )
}