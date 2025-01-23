import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import { ListVideo, SlidersHorizontal, User } from "lucide-react";
import { HomeFeed } from "@/pages/HomeFeed.tsx";
import { ProfilePage } from "@/pages/ProfilePage.tsx";
import { SettingsPage } from "@/pages/SettingsPage.tsx";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider.tsx";

const App = () => {
    const { setTheme } = useTheme();

    useEffect(() => {
        const theme = Math.random() > 0.5 ? "dark" : "light";
        console.info("using theme", theme);
        setTheme(theme);
    }, [setTheme]);

    return (
        <BrowserRouter>
            <div className="flex flex-col h-screen max-w-md mx-auto shadow-2xl shadow-foreground">
                {/* Main Content */}
                <div className="grow bg-background">
                    <Routes>
                        <Route path="/home" element={<HomeFeed />} />
                        <Route path="/search" element={<SettingsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </div>

                <div className="z-50 w-full h-16 flex-none bg-background">
                    <div className="grid h-full max-w-lg grid-cols-3 mx-auto p-2">
                        <NavLink
                            className={({ isActive }) =>
                                `flex flex-col items-center ${isActive ? "text-primary-foreground" : "text-foreground"}`
                            }
                            to={"settings"}
                        >
                            <button
                                type="button"
                                className="inline-flex flex-col items-center justify-center font-medium px-5 group"
                            >
                                <SlidersHorizontal className={"w-5 h-5 mb-1"} />
                                <span className="text-sm">Suche</span>
                            </button>
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => {
                                return `flex flex-col items-center ${isActive ? "text-primary-foreground" : "text-foreground"}`;
                            }}
                            to={"home"}
                        >
                            <button
                                type="button"
                                className="inline-flex flex-col items-center justify-center font-medium px-5 group"
                            >
                                <ListVideo className={"w-5 h-5 mb-1"} />
                                <span className="text-sm">Feed</span>
                            </button>
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => {
                                return `flex flex-col items-center ${isActive ? "text-primary-foreground" : "text-foreground"}`;
                            }}
                            to={"profile"}
                        >
                            <button
                                type="button"
                                className="inline-flex flex-col items-center justify-center font-medium px-5 group"
                            >
                                <User className={"w-5 h-5 mb-1"} />
                                <span className="text-sm max-w-28 truncate">
                                    Profil
                                </span>
                            </button>
                        </NavLink>
                    </div>
                </div>
            </div>
            <Toaster />
        </BrowserRouter>
    );
};

export default App;
