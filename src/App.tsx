import { BrowserRouter, NavLink, Route, Routes } from "react-router";
import { ListVideo, SlidersHorizontal, User } from "lucide-react";
import { HomeFeed } from "@/pages/HomeFeed.tsx";
import { ProfilePage } from "@/pages/ProfilePage.tsx";
import { SettingsPage } from "@/pages/SettingsPage.tsx";
import { Toaster } from "./components/ui/toaster";

const App = () => {
    return (
        <BrowserRouter>
            <div className="flex flex-col h-screen">
                {/* Main Content */}
                <div className="grow">
                    <Routes>
                        <Route path="/home" element={<HomeFeed />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </div>

                <div className="z-50 w-full h-16 flex-none bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                    <div className="grid h-full max-w-lg grid-cols-3 mx-auto p-2">
                        <NavLink
                            className={({ isActive }) =>
                                `flex flex-col items-center ${isActive ? "text-primary" : "text-gray-500"}`
                            }
                            to={"settings"}
                        >
                            <button
                                type="button"
                                className="inline-flex flex-col items-center justify-center font-medium px-5 group"
                            >
                                <SlidersHorizontal className={"w-5 h-5 mb-1"} />
                                <span className="text-sm">Einstellungen</span>
                            </button>
                        </NavLink>
                        <NavLink
                            className={({ isActive }) => {
                                return `flex flex-col items-center ${isActive ? "text-primary" : "text-gray-500"}`;
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
                                return `flex flex-col items-center ${isActive ? "text-primary" : "text-gray-500"}`;
                            }}
                            to={"profile"}
                        >
                            <button
                                type="button"
                                className="inline-flex flex-col items-center justify-center font-medium px-5 group"
                            >
                                <User className={"w-5 h-5 mb-1"} />
                                <span className="text-sm max-w-28 truncate">
                                    JuiceCS
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
