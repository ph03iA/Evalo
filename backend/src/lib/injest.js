import {Inngest} from "inngest";
import {connectDB} from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({id: "evalo"});

const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event: "clerk/user.created"},
    async ({event}) => {
        await connectDB()
        // Clerk webhook payload has user data nested in event.data.data
        const userData = event.data.data
        const {id, email_addresses, first_name, last_name, image_url} = userData

        const newUser = {
            clerkId: id,
            email: email_addresses?.[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            profilePicture: image_url || ""
        }

        await User.create(newUser);
    }
    
)

const deleteUserFromDB = inngest.createFunction(
    {id:"delete-user-from-db"},
    {event: "clerk/user.deleted"},
    async ({event}) => {
        await connectDB()
        // Clerk webhook payload has user data nested in event.data.data
        const {id} = event.data.data
        await User.deleteOne({clerkId:id})
    }
    
);
export const functions = [syncUser, deleteUserFromDB];


