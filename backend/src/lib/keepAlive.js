import { ENV } from "./env.js";

const DEFAULT_INTERVAL_MS = 10 * 60 * 1000;
const MIN_INTERVAL_MS = 60 * 1000;
const REQUEST_TIMEOUT_MS = 10 * 1000;

const truthy = new Set(["1", "true", "yes", "on"]);

const isEnabled = (value) => truthy.has(String(value || "").trim().toLowerCase());

const parseInterval = (value) => {
    const interval = Number(value);

    if (!Number.isFinite(interval)) return DEFAULT_INTERVAL_MS;

    return Math.max(interval, MIN_INTERVAL_MS);
};

const buildHealthUrl = (baseUrl) => {
    try {
        return new URL("/health", baseUrl).toString();
    } catch (error) {
        console.warn("[keep-alive] Invalid KEEP_ALIVE_URL/RENDER_EXTERNAL_URL:", error.message);
        return null;
    }
};

export const startKeepAlive = () => {
    if (!isEnabled(ENV.KEEP_ALIVE_ENABLED)) return;

    if (typeof fetch !== "function") {
        console.warn("[keep-alive] Global fetch is unavailable. Use Node.js 18+ to enable keep-alive pings.");
        return;
    }

    const healthUrl = buildHealthUrl(ENV.KEEP_ALIVE_URL);
    if (!healthUrl) return;

    const intervalMs = parseInterval(ENV.KEEP_ALIVE_INTERVAL_MS);

    const ping = async () => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

        try {
            const response = await fetch(healthUrl, {
                method: "GET",
                cache: "no-store",
                signal: controller.signal,
                headers: {
                    "User-Agent": "evalo-render-keep-alive"
                }
            });

            if (!response.ok) {
                console.warn(`[keep-alive] ${healthUrl} responded with ${response.status}`);
            }
        } catch (error) {
            console.warn(`[keep-alive] Unable to ping ${healthUrl}: ${error.message}`);
        } finally {
            clearTimeout(timeout);
        }
    };

    const interval = setInterval(ping, intervalMs);
    interval.unref?.();

    const firstPing = setTimeout(ping, Math.min(intervalMs, 60 * 1000));
    firstPing.unref?.();

    console.log(`[keep-alive] Pinging ${healthUrl} every ${Math.round(intervalMs / 1000)} seconds`);
};
