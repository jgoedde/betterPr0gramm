import { cn } from "@/lib/utils.ts";
import { ListVideo, User } from "lucide-react";
import { useNavigation } from "@/hooks/use-navigation.tsx";

export function BottomNavigation() {
    const { view, goTo } = useNavigation();

    return (
        <div
            className={cn(
                "z-50 w-full h-full basis-1/12",
                view === "home"
                    ? "bg-home-background text-home-color"
                    : "bg-background text-foreground"
            )}
        >
            <div className="grid justify-center h-full max-w-lg grid-cols-2 mx-auto p-2 text-foreground">
                <div
                    className={cn(
                        `flex w-3/4 mx-auto justify-center h-full`,
                        view === "home" &&
                            "rounded-2xl bg-foreground bg-opacity-25 text-background"
                    )}
                >
                    <button
                        type="button"
                        onClick={() => goTo("home")}
                        className="inline-flex flex-col items-center justify-center font-medium p-1 group"
                    >
                        <ListVideo className={"w-5 h-5 mb-1"} />
                        <span className="text-sm">Feed</span>
                    </button>
                </div>
                <div
                    className={cn(
                        `flex w-3/4 mx-auto justify-center h-full`,
                        view === "profile" &&
                            "rounded-2xl bg-foreground bg-opacity-25 text-background",
                        view === "home" && "text-white"
                    )}
                >
                    <button
                        type="button"
                        onClick={() => goTo("profile")}
                        className="inline-flex flex-col items-center justify-center font-medium p-1 group"
                    >
                        <User className={"w-5 h-5 mb-1"} />
                        <span className="text-sm max-w-28 truncate">
                            Profil
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
