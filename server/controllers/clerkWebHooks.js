import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        //Create a Svix webhook instance with the secret from environment variables
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        //Getting headers
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        };

        //Verifying Headers
        await whook.verify(JSON.stringify(req.body), headers);

        //Getting Data from request body
        const { data, type } = req.body;
        
        const userData = {
            _id: data.id,
            email: data.email_addresses[0]?.email_address || '',
            username: data.first_name + ' ' + data.last_name,
            image: data.profile_image_url || '',
        }

        //Handling different webhook events
        switch (type) {
            case "user.created":
                //Create a new user in the database
                await User.create(userData);
                break;
            case "user.updated":
                //Update existing user in the database
                await User.findByIdAndUpdate(data.id, userData);
                break;
            case "user.deleted":
                //Delete user from the database
                await User.findByIdAndDelete(data.id);
                break;
            default:
                break;
        }
        res.json( { success: true, message: "Webhook processed successfully" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

export default clerkWebhooks;