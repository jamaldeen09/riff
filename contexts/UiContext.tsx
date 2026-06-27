"use client";
import { createContext, useContext, useReducer, ReactNode } from "react";

export type TriggerType = "create-room-dialog"
export interface UiContextState {
    activeTrigger: TriggerType | null
}

const initialState: UiContextState = {
    activeTrigger: null
};

type UiAction =
    | { type: "ACTIVATE_TRIGGER"; payload: TriggerType }
    | { type: "DEACTIVATE_TRIGGER" }

const uiReducer = (state: UiContextState, action: UiAction): UiContextState => {
    switch (action.type) {
        case "ACTIVATE_TRIGGER":
            if (state.activeTrigger === action.payload) return state;
            return { ...state, activeTrigger: action.payload };

        case "DEACTIVATE_TRIGGER":
            if (state.activeTrigger === null) return state;
            return { ...state, activeTrigger: null };

        default:
            return state;
    }
};

export interface UiContextType {
    ui: UiContextState;
    activateTrigger: (type: TriggerType) => void;
    deactivateTrigger: () => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export const UiProvider = ({ children }: { children: ReactNode }) => {
    const [ui, dispatch] = useReducer(uiReducer, initialState);

    const activateTrigger: UiContextType["activateTrigger"] = (type) => 
        dispatch({ type: "ACTIVATE_TRIGGER", payload: type });

    const deactivateTrigger = () => 
        dispatch({ type: "DEACTIVATE_TRIGGER" })

    return (
        <UiContext.Provider
          value={{ ui, activateTrigger, deactivateTrigger }}
        >
            {children}
        </UiContext.Provider>
    );
};

export const useUi = () => {
    const context = useContext(UiContext);
    if (!context) throw new Error("useUi must be used within a UiProvider");
    return context;
};