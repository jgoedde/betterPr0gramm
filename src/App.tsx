import { Toaster } from "./components/ui/toaster";
import { useEffect } from "react";
import { useTheme } from "@/components/ThemeProvider.tsx";
import { BottomNavigation } from "@/components/BottomNavigation.tsx";
import { ContentWrapper } from "@/components/ContentWrapper.tsx";

import { NavigationProvider } from "@/contexts/navigation/NavigationProvider.tsx";

const App = () => {
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme("dark");
    }, [setTheme]);

    return (
        <NavigationProvider>
            <div className="flex flex-col h-screen max-w-md mx-auto shadow-2xl shadow-foreground bg-background text-foreground">
                <ContentWrapper />
                <BottomNavigation />
            </div>
            <Toaster />
        </NavigationProvider>
    );
};

export default App;
