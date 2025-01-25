import { useMemo } from "react";
import { ProfileOverview } from "@/components/profile/logged-in/ProfileOverview.tsx";
import { LoginForm } from "@/components/profile/login/LoginForm.tsx";
import { useCookie } from "react-use";

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
    const [meCookieStr] = useCookie("me");

    const meCookie = useMemo(() => {
        console.info("Parsing `me` cookie", meCookieStr, "...");
        if (!meCookieStr) {
            return undefined;
        }
        try {
            return JSON.parse(meCookieStr) as { n: string };
        } catch (e) {
            if (e instanceof Error) {
                console.error("Unable to parse cookie");
                console.error(e);
            }
            return undefined;
        }
    }, [meCookieStr]);

    const isLoggedIn = useMemo(() => {
        return meCookie?.n != null;
    }, [meCookie?.n]);

    if (!isLoggedIn) {
        return <LoginForm />;
    }

    return <ProfileOverview nickname={meCookie!.n} />;
}
