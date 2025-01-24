import { NavLink, useLocation } from "react-router";
import { cn } from "@/lib/utils.ts";
import { ListVideo, SlidersHorizontal, User } from "lucide-react";

export function BottomNavigation() {
    const { pathname } = useLocation();

    const isHomeLocation = pathname === "/home";

    return (
        <div
            className={cn(
                "z-50 w-full h-16 flex-none",
                pathname === "/home"
                    ? "bg-home-background text-home-color"
                    : "bg-background text-foreground"
            )}
        >
            <div className="grid justify-center h-full max-w-lg grid-cols-3 mx-auto p-2 text-foreground">
                <NavLink
                    className={({ isActive }) => {
                        return cn(
                            `flex w-3/4 mx-auto flex-col items-center`,
                            isActive &&
                                "rounded-2xl bg-foreground bg-opacity-25 text-background",
                            isHomeLocation && !isActive && "text-white"
                        );
                    }}
                    to={"settings"}
                >
                    <button
                        type="button"
                        className="inline-flex flex-col items-center justify-center font-medium p-1 group"
                    >
                        <SlidersHorizontal className={"w-5 h-5 mb-1"} />
                        <span className="text-sm">Suche</span>
                    </button>
                </NavLink>
                <NavLink
                    className={({ isActive }) => {
                        return cn(
                            `flex w-3/4 mx-auto flex-col items-center`,
                            isActive &&
                                "rounded-2xl bg-foreground bg-opacity-25 text-background"
                        );
                    }}
                    to={"home"}
                >
                    <button
                        type="button"
                        className="inline-flex flex-col items-center justify-center font-medium p-1 group"
                    >
                        <ListVideo className={"w-5 h-5 mb-1"} />
                        <span className="text-sm">Feed</span>
                    </button>
                </NavLink>
                <NavLink
                    className={({ isActive }) => {
                        return cn(
                            `flex w-3/4 mx-auto flex-col items-center`,
                            isActive &&
                                "rounded-2xl bg-foreground bg-opacity-25 text-background",
                            isHomeLocation && !isActive && "text-white"
                        );
                    }}
                    to={"profile"}
                >
                    <button
                        type="button"
                        className="inline-flex flex-col items-center justify-center font-medium p-1 group"
                    >
                        <User className={"w-5 h-5 mb-1"} />
                        <span className="text-sm max-w-28 truncate">
                            Profil
                        </span>
                    </button>
                </NavLink>
            </div>
        </div>
    );
}
