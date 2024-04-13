import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/lib/resend"

export async function POST(request : Request, ){
    await dbConnect()

    try {
        const {username ,email, password} = await request.json()

    
    } catch (error) {
        console.error('Error while Registering User', error)
        return Response.json({
            success : false,
            message : "Error while Registering User"
        },
        {
            status : 500
        }
    )
    }
}