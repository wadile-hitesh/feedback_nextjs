import {Resend} from 'resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email : string, username : string, verifyCode : string) : Promise<ApiResponse> {
    try {

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject: "Verification Code for your Account",
            react: VerificationEmail({username, otp: verifyCode}),
        });

        return {
            success : true,
            message : "Verification Email Sent Successfully"
        }
    } catch (emailError) {
        console.log("Error sending Verification Email", emailError);
        return {
            success : false,
            message : "Error sending Verification Email"
        }
    }
}