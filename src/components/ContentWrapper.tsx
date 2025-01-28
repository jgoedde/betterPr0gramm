import { HomeFeed } from "@/pages/HomeFeed.tsx";
import { ProfilePage } from "@/pages/ProfilePage.tsx";
import { useNavigation } from "@/hooks/use-navigation.ts";
import { PlaybackProvider } from "@/components/feed/player/video/playback-context/PlaybackProvider.tsx";

export const ContentWrapper = () => {
    const { view } = useNavigation();

    return (
        <div className="grow">
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
