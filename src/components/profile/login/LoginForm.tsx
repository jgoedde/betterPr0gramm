import { useCaptcha } from "@/components/profile/login/use-captcha.ts";
import { FC, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast.ts";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import { ToastAction } from "@/components/ui/toast.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/hooks/use-auth.ts";

export const LoginForm: FC = () => {
    const captcha = useCaptcha();
    const { toast } = useToast();

    const { updateCookies } = useAuth();

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
        });

        const xCookies = response.headers.get("X-Cookies");

        if (!response.ok || xCookies == null) {
            toast({
                title: "Something went wrong!",
                description: `There was an error while logging you in. Please open an issue on GitHub`,
                action: (
                    <ToastAction
                        onClick={() => alert("TODO")}
                        altText="Open GitHub"
                    >
                        Report bug
                    </ToastAction>
                ),
            });
            return;
        }
        const parse = JSON.parse(xCookies) as [string, string];
        const me = JSON.parse(decodeURIComponent(parse[0].replace("me=", "")));
        const pp = parse[1].replace("pp=", "");

        updateCookies({ me, pp });

        toast({
            title: "Successfully logged in!",
            description: `You are now logged in as ${username}. Access your uploads, collections & comments.`,
        });
    }, [captcha, captchaStr, password, toast, updateCookies, username]);

    if (!captcha) {
        return <>Loading...</>;
    }

    return (
        <form
            className="min-h-full px-6 mt-10"
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
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
                    <img src={`${captcha.captcha}`} alt={"Captcha"} />
                </div>

                <div>
                    <Label htmlFor="captcha">Captcha</Label>

                    <div className="mt-2">
                        <Input
                            autoCapitalize={"on"}
                            type="text"
                            value={captchaStr}
                            onChange={(e) =>
                                setCaptchaStr(e.target.value.toUpperCase())
                            }
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
        </form>
    );
};
