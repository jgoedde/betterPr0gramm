import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/api/pr0grammApi.ts";

type CaptchaResponse = {
    token: string;
    captcha: string;
    ts: number;
    cache: null;
    rt: number;
    qc: number;
};

export function useCaptcha() {
    const [captcha, setCaptcha] = useState<CaptchaResponse>();

    const fetchCaptcha = useCallback(async () => {
        const response = await fetch(
            `${BASE_URL}/api/user/captcha?bust=0.5545422719773347`,
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
