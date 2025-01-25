import { HomeFeed } from "@/pages/HomeFeed.tsx";
import { ProfilePage } from "@/pages/ProfilePage.tsx";
import { useNavigation } from "@/hooks/use-navigation.tsx";

export const ContentWrapper = () => {
    const { view } = useNavigation();

    return (
        <div className="grow">
            {view === "home" && (
                <div className={"bg-home-background text-home-color"}>
                    <HomeFeed />
                </div>
            )}
            {view === "profile" && <ProfilePage />}
        </div>
    );
};
