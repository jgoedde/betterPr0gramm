import { FC, useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast.ts";
import { ToastAction } from "@/components/ui/toast.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAuth } from "@/hooks/use-auth.ts";

export const LoginForm: FC = () => {
    const { toast } = useToast();

    const [ppCookie, setPpCookie] = useState("");
    const [meCookie, setMeCookie] = useState("");

    const { updateCookies } = useAuth();

    const login = useCallback(async () => {
        try {
            const parsedPpCookie = ppCookie.replace('pp:"', "").split('"')[0];
            const parsedMeCookie = JSON.parse(
                decodeURIComponent(meCookie.replace('me:"', "").split('"')[0])
            );

            updateCookies({ me: parsedMeCookie, pp: parsedPpCookie });

            toast({
                title: "Successfully logged in!",
                description: `You are now logged in as ${parsedMeCookie.n}. Access your uploads, collections & comments.`,
                action: (
                    <ToastAction
                        onClick={() => {
                            location.reload();
                        }}
                        altText="Refresh"
                    >
                        Show my profile!
                    </ToastAction>
                ),
            });
        } catch (e) {
            console.error(e);
            toast({
                title: "That didn't work!",
                variant: "destructive",
                description: `There was en error while reading your cookie. Please try again.`,
                action: (
                    <ToastAction
                        onClick={() => {
                            location.reload();
                        }}
                        altText="Refresh"
                    >
                        Show my profile!
                    </ToastAction>
                ),
            });
        }
    }, [meCookie, ppCookie, toast, updateCookies]);

    return (
        <div className="min-h-full px-6">
            <div className="mt-10">
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="me-cookie">"Me"-Cookie</Label>
                        </div>
                        <div className="mt-2">
                            <Input
                                name="me-cookie"
                                type="text"
                                id="me-cookie"
                                value={meCookie}
                                onChange={(e) => setMeCookie(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="pp-cookie">"PP"-Cookie</Label>
                        <div className="mt-2">
                            <Input
                                type="text"
                                name="pp-cookie"
                                id="pp-cookie"
                                value={ppCookie}
                                onChange={(e) => setPpCookie(e.target.value)}
                                required
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
