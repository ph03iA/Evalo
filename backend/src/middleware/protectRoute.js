import { requireAuth, clerkClient } from '@clerk/express'
import User from '../models/User.js'
import { upsertStreamUser } from '../lib/stream.js'


export const protectRoute = [
    requireAuth(),
    async (req, res, next) => {
        try {
            const clerkId = req.auth().userId;
            if (!clerkId) return res.status(401).json({ message: "Unauthorized - invalid token" });

            // Find user in db by clerk id
            let user = await User.findOne({ clerkId });
            
            // If user doesn't exist in MongoDB, auto-create from Clerk data
            if (!user) {
                try {
                    // Fetch user details from Clerk
                    const clerkUser = await clerkClient.users.getUser(clerkId);
                    
                    const newUser = {
                        clerkId: clerkUser.id,
                        email: clerkUser.emailAddresses?.[0]?.emailAddress,
                        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || "User",
                        profilePicture: clerkUser.imageUrl || ""
                    };
                    
                    user = await User.create(newUser);
                    
                    // Also sync to Stream
                    await upsertStreamUser({
                        id: user.clerkId.toString(),
                        name: user.name,
                        image: user.profilePicture,
                    });
                    
                    console.log("Auto-created user in MongoDB:", user.email);
                } catch (createError) {
                    console.error("Error auto-creating user:", createError);
                    return res.status(500).json({ message: "Failed to create user profile" });
                }
            }

            // Attach user to req
            req.user = user;
            next();
        }
        catch (error) {
            console.error("Error in protectRoute middleware", error);
            res.status(500).json({ message: "Internal Server Error." })
        }
    }
];
