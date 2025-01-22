import { FC, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast.ts";
import { useNavigate } from "react-router";
import { BASE_URL } from "@/api/pr0grammApi.ts";
import { ToastAction } from "@/components/ui/toast.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useCaptcha } from "./use-captcha.ts";

export const LoginForm: FC = () => {
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
