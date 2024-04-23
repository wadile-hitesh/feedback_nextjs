import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request:Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    
    if(!session || !session.user){
        return Response.json({
            success : false,
            message : "Not Authenticated"
        },
        {status : 401})
    }

    const userId = user._id
    const {acceptMessages} = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage : acceptMessages
        },{new : true})

        if(!updatedUser){
            return Response.json(
                {
                    success: false,
                    message: "Failed to Update user status to accept messages",
                },
                { status: 401 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status changed Successfully",
                updatedUser,
            },
            { status: 500 }
        );

    } catch (error) {
        console.log("Failed to Update user status to accept messages");
        
        return Response.json(
            {
                success: false,
                message: "Failed to Update user status to accept messages",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
            success: false,
            message: "Not Authenticated",
            },
            { status: 401 }
        );
    }

    const userId = user._id;
    const foundUser = await UserModel.findById(userId)

    try {
        if(!foundUser){
            return Response.json(
                {
                    success: false,
                    message: "User not Found",
                },
                { status: 404 }
            );
        }
    
        return Response.json(
            {
                success: true,
                isAcceptinMessages : foundUser.isAcceptingMessage
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Failed to Update user status to accept messages");

        return Response.json(
            {
                success: false,
                message: "Error in getting message accepting Status",
            },
            { status: 500 }
        );
    }
}