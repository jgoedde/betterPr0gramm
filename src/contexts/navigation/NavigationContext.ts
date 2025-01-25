import { createContext } from "react";

export type View = "profile" | "home";
export type NavigationContext = {
    view: View;
    setView: (newVideo: View) => void;
};
export const NavigationContext = createContext<NavigationContext | undefined>(
    undefined
);
