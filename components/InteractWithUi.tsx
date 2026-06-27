"use client"
import { TriggerType, useUi } from "@/contexts/UiContext";

export default function InteractWithUi({ children, type, trigger, className }: {
    children: React.ReactNode,
    type: "activate" | "deactivate",
    trigger?: TriggerType
    className?: string;
}) {
    const { activateTrigger, deactivateTrigger } = useUi();
    return (
        <button onClick={() => {
            switch (type) {
                case "activate":
                    if (!trigger) return;
                    else return activateTrigger(trigger);
                
                case "deactivate":
                   return deactivateTrigger();
            }
        }} className={className}>
            {children}
        </button>
    )
}
