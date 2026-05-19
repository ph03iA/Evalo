import dotenv from "dotenv"
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, "../../.env"), quiet: true });

const isRenderWebService =
    process.env.RENDER === "true" &&
    process.env.RENDER_SERVICE_TYPE === "web" &&
    process.env.IS_PULL_REQUEST !== "true";

export const ENV = {
    PORT: process.env.PORT || 3000,
    DB_URL: process.env.DB_URL,
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    INNGEST_EVENT_KEY: process.env.INNGEST_EVENT_KEY,
    INNGEST_SIGNING_KEY: process.env.INNGEST_SIGNING_KEY,
    STREAM_API_KEY: process.env.STREAM_API_KEY,
    STREAM_API_SECRET: process.env.STREAM_API_SECRET,
    RENDER_EXTERNAL_URL: process.env.RENDER_EXTERNAL_URL,
    KEEP_ALIVE_ENABLED: process.env.KEEP_ALIVE_ENABLED ?? (isRenderWebService ? "true" : "false"),
    KEEP_ALIVE_URL: process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL,
    KEEP_ALIVE_INTERVAL_MS: process.env.KEEP_ALIVE_INTERVAL_MS || "600000"
};
