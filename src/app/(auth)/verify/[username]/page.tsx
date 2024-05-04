'use client'
import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username : string}>()
    const {toast} = useToast()

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
    });

    const onSubmit = async (data : z.infer<typeof verifySchema>)=>{
        try {
            const response = await axios.post<ApiResponse>(`/api/verify-code`, {
                username : params.username,
                code : data.verifyCode
            })

            toast({
                title : "Success",
                description : response.data.message
            })

            router.replace(`sign-in`)
        } catch (error) {
            console.error("Error in Sign Up of User");
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: "SignUp Failed",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }

    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Verify Your Account
            </h1>
            <p className="mb-4">
                Enter the verification code sent to your email
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="verifyCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <FormControl>
                      <Input placeholder="code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Verify Code</Button>
            </form>
          </Form>
        </div>
      </div>
    );
}

export default VerifyAccount