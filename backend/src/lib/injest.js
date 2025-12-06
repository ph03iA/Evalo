import {Inngest} from "inngest";
import {connectDB} from "./db.js";
import User from "../models/User.js";

export const inngest = new Inngest({id: "evalo"});

const syncUser = inngest.createFunction(
    {id:"sync-user"},
    {event: "cler/user.created"},
    async ({event}) => {
        await connectDB()
        const {id, email_address, first_name, last_name, image_url} = event.data

        const newUser = {
            clerId: id,
            email: email_address[0]?.email_address,
            name: `${first_name || ""} ${last_name || ""}`,
            profilePicture: image_url
        }

        await User.create(newUser);

        //to do sometging else
    }
    
)

const deleteUserFromDB = inngest.createFunction(
    {id:"delete-user-from-db"},
    {event: "cler/user.deleted"},
    async ({event}) => {
        await connectDB()
        const {id} = event.data
        await User.deleteOne({clerId:id})

        //todo something else

    }
    
);
export const functions = [syncUser, deleteUserFromDB];


