import { BrowserRouter, Route, Routes } from "react-router";
import { HomeFeed } from "@/pages/HomeFeed.tsx";
import { ProfilePage } from "@/pages/ProfilePage.tsx";
import { SettingsPage } from "@/pages/SettingsPage.tsx";
import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider.tsx";
import { BottomNavigation } from "@/components/BottomNavigation.tsx";

const App = () => {
    const { setTheme } = useTheme();

    useEffect(() => {
        const theme = Math.random() > 0.5 ? "dark" : "light";
        console.info("using theme", theme);
        setTheme(theme);
    }, [setTheme]);

    return (
        <BrowserRouter>
            <div className="flex flex-col h-screen max-w-md mx-auto shadow-2xl shadow-foreground bg-background text-foreground">
                {/* Main Content */}
                <div className="grow">
                    <Routes>
                        <Route
                            path="/home"
                            element={
                                <div
                                    className={
                                        "bg-home-background text-home-color"
                                    }
                                >
                                    <HomeFeed />
                                </div>
                            }
                        />
                        <Route path="/search" element={<SettingsPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                    </Routes>
                </div>

                <BottomNavigation />
            </div>
            <Toaster />
        </BrowserRouter>
    );
};

export default App;
