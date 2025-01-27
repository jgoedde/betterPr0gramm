import { cn } from "@/lib/utils.ts";
import { Home, User } from "lucide-react";
import { useNavigation } from "@/hooks/use-navigation.tsx";

export function BottomNavigation() {
    const { view, goTo } = useNavigation();

    return (
        <div
            className={cn(
                "w-full flex-none h-14 bg-home-background border-t border-white border-opacity-30"
            )}
        >
            <div className="grid justify-center h-full max-w-lg grid-cols-2 mx-auto">
                <div className={"flex w-3/4 mx-auto justify-center h-full"}>
                    <button
                        type="button"
                        onClick={() => goTo("home")}
                        className={cn(
                            "inline-flex flex-col items-center justify-center font-medium p-1 group",
                            view === "home"
                                ? "text-white"
                                : "text-white text-opacity-50"
                        )}
                    >
                        <Home className={"w-7 h-7"} />
                        <span className="text-sm">Feed</span>
                    </button>
                </div>
                <div className={"flex w-3/4 mx-auto justify-center h-full"}>
                    <button
                        type="button"
                        onClick={() => goTo("profile")}
                        className={cn(
                            "inline-flex flex-col items-center justify-center font-medium p-1 group",
                            view === "profile"
                                ? "text-white"
                                : "text-white text-opacity-50"
                        )}
                    >
                        <User className={"w-7 h-7"} />
                        <span className="text-sm">Profil</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
