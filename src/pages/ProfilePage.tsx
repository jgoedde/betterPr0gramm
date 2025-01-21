import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { BASE_URL } from "@/components/api.ts";
import Cookies from "js-cookie";
import { ProfileOverview } from "@/pages/ProfileOverview.tsx";

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
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captchaStr, setCaptchaStr] = useState("");

    if (!captcha) {
        return <>Loading...</>;
    }

    return (
        <div className="min-h-full px-6">
            <div className="mt-10">
                <div className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm/6 font-medium text-gray-900"
                        >
                            Username
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm/6 font-medium text-gray-900"
                            >
                                Password
                            </label>
                        </div>
                        <div className="mt-2">
                            <input
                                type="password"
                                name="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <img src={`${captcha.captcha}`} />
                    </div>

                    <div>
                        <label
                            htmlFor="captcha"
                            className="block text-sm/6 font-medium text-gray-900"
                        >
                            Captcha
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                value={captchaStr}
                                onChange={(e) => setCaptchaStr(e.target.value)}
                                name="captcha"
                                id="captcha"
                                required
                                className="block w-1/4 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            onClick={async () => {
                                await fetch(`${BASE_URL}/api/user/login`, {
                                    headers: {
                                        "content-type":
                                            "application/x-www-form-urlencoded; charset=UTF-8",
                                    },
                                    body: `name=${username}&password=${password}&captcha=${captchaStr}&token=${captcha.token}`,
                                    method: "POST",
                                    credentials: "include",
                                });
                            }}
                            // type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
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
