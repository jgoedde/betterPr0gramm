import { useCallback, useEffect, useState } from "react";

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
            "https://pr0gramm.com/api/user/captcha?bust=0.5545422719773347",
            {
                headers: {
                    accept: "application/json, text/javascript, */*; q=0.01",
                },
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

export function ProfilePage() {
    const captcha = useCaptcha();
    const [json, setJson] = useState<string>("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [captchaStr, setCaptchaStr] = useState("");

    if (!captcha) {
        return null;
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
                                await fetch(
                                    "https://pr0gramm.com/api/user/login",
                                    {
                                        headers: {
                                            accept: "application/json, text/javascript, */*; q=0.01",
                                            "accept-language": "de-DE,de;q=0.9",
                                            "content-type":
                                                "application/x-www-form-urlencoded; charset=UTF-8",
                                        },
                                        body: `name=${username}&password=${password}&captcha=${captchaStr}&token=${captcha.token}`,
                                        method: "POST",
                                    }
                                );
                            }}
                            // type="submit"
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            Sign in
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={async () => {
                                const response = await fetch(
                                    "https://pr0gramm.com/api/items/get?flags=9&user=JuiceCS&collection=favoriten&self=true",
                                    {
                                        method: "GET",
                                    }
                                );

                                const newVar = await response.json();
                                setJson(JSON.stringify(newVar));
                            }}
                            className="flex w-full justify-center rounded-md bg-gray-500 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                        >
                            Try fetch posts
                        </button>
                    </div>
                </div>

                <pre>{json}</pre>
            </div>
        </div>
    );
}
