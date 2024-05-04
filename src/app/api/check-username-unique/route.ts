import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username : usernameValidation
})

export async function GET(request:Request) {

    // try it in all methods
    if(request.method !== 'GET'){
        return Response.json({
            success : false,
            message : "Method Not Allowed"
        },
        {status : 405})
    }

    await dbConnect()

    try{
        const {searchParams} = new URL(request.url)

        console.log(searchParams);
        

        const queryParam = {
            username : searchParams.get('username')
        }

        // validate with zod

        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)

        if(!result.success){
            const usernameErrors  = result.error.format().username?._errors || []

            return Response.json({
                success : false,
                message : usernameErrors?.length > 0
                        ? usernameErrors.join(', ')
                        : 'Invalid query parameters'
            },
            {status : 400})
        }

        const {username} = result.data

        const existingVerifiedUser =await UserModel.findOne({username, isVerified : true})

        if(existingVerifiedUser){
            return Response.json({
                success : true,
                message : 'Username is Already Exist'
            }, {status :500})
        }

        return Response.json(
            {
                success: true,
                message: "Username is Unique",
            },
            { status: 200 }
        );
    }
    catch(error){
        console.error("Error Checking Username",error)
        return Response.json({
            success : false,
            message : "Error Checking Username"
        },
        {
            status : 500
        })
    }
}