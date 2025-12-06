import {Inngest} from "inngest";
import {connectDB} from "./db.js";
import User from "../models/User.js";
import { upsertStreamUser, deleteStreamUser } from "./stream.js";

export const inngest = new Inngest({id: "evalo"});

const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event: "clerk/user.created"},
    async ({event}) => {
        await connectDB()
        // User data is directly in event.data
        const {id, email_addresses, first_name, last_name, image_url} = event.data

        const newUser = {
            clerkId: id,
            email: email_addresses?.[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`.trim(),
            profilePicture: image_url || ""
        }

        await User.create(newUser);
        await upsertStreamUser({
            id: newUser.clerkId.toString(),
            name: newUser.name,
            image: newUser.profilePicture,
        });
    }
    
)

const deleteUserFromDB = inngest.createFunction(
    {id:"delete-user-from-db"},
    {event: "clerk/user.deleted"},
    async ({event}) => {
        await connectDB()
        // User data is directly in event.data
        const {id} = event.data
        await User.deleteOne({clerkId:id});
        await deleteStreamUser(id.toString());
    }
    
);
export const functions = [syncUser, deleteUserFromDB];