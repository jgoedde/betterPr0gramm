import { HomeFeed } from "@/pages/HomeFeed.tsx";
import { ProfilePage } from "@/pages/ProfilePage.tsx";
import { useNavigation } from "@/hooks/use-navigation.tsx";
import { PlaybackProvider } from "@/contexts/playback/PlaybackProvider.tsx";

export const ContentWrapper = () => {
    const { view } = useNavigation();

    return (
        <div className="basis-11/12">
            {view === "home" && (
                <div className={"bg-home-background text-home-color h-full"}>
                    <PlaybackProvider>
                        <HomeFeed />
                    </PlaybackProvider>
                </div>
            )}
            {view === "profile" && <ProfilePage />}
        </div>
    );
};
