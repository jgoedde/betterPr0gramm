import { ProfileOverview } from "@/components/profile/logged-in/ProfileOverview.tsx";
import { LoginForm } from "@/components/profile/login/LoginForm.tsx";
import { useAuth } from "@/hooks/use-auth.ts";

/*
async function logout() {
    await fetch("https://pr0gramm.com/api/user/logout", {
        credentials: "include",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        referrer: "https://pr0gramm.com/settings/site",
        body: "id=a22db07456fbbcf65717193f70d546c7&_nonce=a22db07456fbbcf6", // TODO: _nonce?
        method: "POST",
    });
}
 */

export function ProfilePage() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <LoginForm />;
    }

    return <ProfileOverview />;
}
