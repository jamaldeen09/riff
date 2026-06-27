"use client"
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <ClerkProvider>
                {children}
            </ClerkProvider>
        </ThemeProvider>
    )
}