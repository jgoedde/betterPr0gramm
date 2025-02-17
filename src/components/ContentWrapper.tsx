import { HomeFeed } from "@/pages/HomeFeed.tsx";
import { ProfilePage } from "@/pages/ProfilePage.tsx";
import { useNavigation } from "@/hooks/use-navigation.ts";
import { FeedProvider } from "@/components/feed/context/FeedProvider.tsx";

export const ContentWrapper = () => {
    const { view } = useNavigation();

    return (
        <div className="grow">
            {view === "home" && (
                <div className={"bg-home-background text-home-color h-full"}>
                    <FeedProvider>
                        <HomeFeed />
                    </FeedProvider>
                </div>
            )}
            {view === "profile" && <ProfilePage />}
        </div>
    );
};
