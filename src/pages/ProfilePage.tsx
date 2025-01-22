import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { BASE_URL } from "@/components/api.ts";
import Cookies from "js-cookie";
import { ProfileOverview } from "@/components/ProfileOverview.tsx";
import { useToast } from "@/hooks/use-toast.ts";
import { ToastAction } from "@/components/ui/toast";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

type CaptchaResponse = {
    token: string;
    captcha: string;
    ts: number;
    cache: null;
    rt: number;
    qc: number;
};

function useCaptcha() {
    const [captcha, setCaptcha] = useState<CaptchaResponse>();

    const fetchCaptcha = useCallback(async () => {
        const response = await fetch(
            `${BASE_URL}/api/user/captcha?bust=0.5545422719773347`,
            {
                headers: {
                    accept: "application/json, text/javascript, */*; q=0.01",
                },
                credentials: "include",
                method: "GET",
            }
        );

        setCaptcha(await response.json());
    }, []);

    useEffect(() => {
        void fetchCaptcha();
    }, [fetchCaptcha]);

    return captcha;
}

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

function useCookie<T>(name: string) {
    const [cookieStr] = useState(Cookies.get(name));

    const cookieValJson = useMemo<T | undefined>(() => {
        if (cookieStr == null) {
            return undefined;
        }
        try {
            return JSON.parse(cookieStr);
        } catch (e) {
            if (e instanceof Error) {
                console.error("Encountered an error while parsing cookie", e);
            }
            return undefined;
        }
    }, [cookieStr]);

    return { cookieValJson };
}

const LoginForm: FC = () => {
    const captcha = useCaptcha();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captchaStr, setCaptchaStr] = useState("");

    const login = useCallback(async () => {
        if (
            username === "" ||
            password === "" ||
            captchaStr === "" ||
            !captcha
        ) {
            return;
        }

        const response = await fetch(`${BASE_URL}/api/user/login`, {
            headers: {
                "content-type":
                    "application/x-www-form-urlencoded; charset=UTF-8",
            },
            body: `name=${username}&password=${password}&captcha=${captchaStr}&token=${captcha.token}`,
            method: "POST",
            credentials: "include",
        });

        if (response.ok) {
            toast({
                title: "Successfully logged in!",
                description: `You are now logged in as ${username}. Access your uploads, collections & comments.`,
                action: (
                    <ToastAction
                        onClick={() => {
                            navigate(0);
                        }}
                        altText="Refresh"
                    >
                        Show my profile!
                    </ToastAction>
                ),
            });
        }
    }, [captcha, captchaStr, navigate, password, toast, username]);

    if (!captcha) {
        return <>Loading...</>;
    }

    return (
        <div className="min-h-full px-6">
            <div className="mt-10">
                <div className="space-y-6">
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <div className="mt-2">
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <div className="mt-2">
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <img src={`${captcha.captcha}`} />
                    </div>

                    <div>
                        <Label htmlFor="captcha">Captcha</Label>

                        <div className="mt-2">
                            <Input
                                type="text"
                                value={captchaStr}
                                onChange={(e) => setCaptchaStr(e.target.value)}
                                name="captcha"
                                id="captcha"
                                required
                                className="w-1/4"
                            />
                        </div>
                    </div>

                    <div>
                        <Button
                            onClick={login}
                            // type="submit"
                            className="flex w-full justify-center"
                        >
                            Sign in
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export function ProfilePage() {
    const { cookieValJson } = useCookie<{ n: string }>("me");

    const isLoggedIn = useMemo(() => {
        return cookieValJson?.n != null;
    }, [cookieValJson?.n]);

    if (!isLoggedIn) {
        return <LoginForm />;
    }

    return <ProfileOverview nickname={cookieValJson!.n} />;
}
