import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

import { Message } from "@/model/User";
import { captureRejectionSymbol } from "events";

export async function POST(request : Request){
    await dbConnect()

    const {username , content} = await request.json()

    try{
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json({
                success : false,
                message : "User not found"
            }
        ,   {status : 404})
        }

        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success: false,
                    message: "User not Accepting Messages",
                },
                { status: 403 }
            );
        }

        const newMessage = {content,createdAt : new Date()}

        user.message.push(newMessage as Message)
        await user.save()

        return Response.json(
            {
                success: 200,
                message: "Message sent Successfully",
            },
            { status: 200 }
        );
    }
    catch(error){
        console.log("Error Adding Messages : ",error);
        
        return Response.json(
            {
                success: false,
                message: "Error adding messages",
            },
            { status: 500 }
        );
    }
}