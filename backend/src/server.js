import express from "express"
import path from "path"
import { ENV } from "./lib/env.js"
import { startKeepAlive } from "./lib/keepAlive.js"
import { connectDB } from "./lib/db.js"
import cors from "cors"
import { serve } from "inngest/express"
import { inngest, functions } from "./lib/injest.js"
import { clerkMiddleware } from '@clerk/express'
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js"


const app = express();
const __dirname = path.resolve();



//middleware
app.use(express.json());
//credentials:true means?? => server allows browser to include cookies on req
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        uptime: process.uptime()
    })
});

app.use(clerkMiddleware({
    publishableKey: ENV.CLERK_PUBLISHABLE_KEY,
    secretKey: ENV.CLERK_SECRET_KEY,
})); // this will add auth field to rewquest object: req.auth()
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);


//when you pass an array of middleware to express, it automatically falttens and executes them sequentially one by one 
//make ready for deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);

    console.error("Unhandled request error", error);

    const statusCode = error.statusCode || error.status || 500;
    const isProduction = ENV.NODE_ENV === "production";

    res.status(statusCode).json({
        message: isProduction ? "Internal Server Error" : error.message || "Internal Server Error"
    });
});


const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log("server is running on port " + ENV.PORT);
            startKeepAlive();
        });
    }
    catch (error) {
        console.error("Error strating the server", error);
    }
};

startServer();
