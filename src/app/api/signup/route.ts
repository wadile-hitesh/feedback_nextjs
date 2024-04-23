import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User"
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail"

export async function POST(request : Request, ){
    await dbConnect()

    try {
        const {username ,email, password} = await request.json()
        
        const existingUserIsVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified : true
        })

        if(existingUserIsVerifiedByUsername){
            return Response.json({
                success : false,
                message : "Username already exists"
            }, {status : 400})
        }

        const existingUserByEmail =await UserModel.findOne({
            email
        })
        let verifyCode = Math.floor(
          100000 + Math.random() * 900000
        ).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success : false,
                    message : "User with this Email already exists"
                })
            }
            else{
                const hashedPassword = await bcrypt.hash(password, 10)

                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)

                await existingUserByEmail.save()
            }
        }
        else{
            const hashedPassword = await bcrypt.hash(password, 10)
            
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser = await new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                message: []
            })

            await newUser.save()
        }
        // send Verification Email

        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        );

        if(!emailResponse.success){
            return Response.json({
                success : false,
                message : emailResponse.message
            }, {status : 500})
        }
        
        return Response.json(
            {
            success: true,
            message: "User Registered Successfully and Verification Email Sent",
            },
            { status: 201 }
        );
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