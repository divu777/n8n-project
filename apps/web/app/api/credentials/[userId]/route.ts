import prisma from "@/app/db";
import { NewCredentialsSchema } from "@repo/types";
import { NextRequest, NextResponse } from "next/server";

export const GET=async(_:NextRequest,{parmas}:{parmas:Promise<{userId:string}>})=>{
    try {
        const {userId} = await parmas

        const userExist = await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                credentials:true
            }
        })

        if(!userExist){
            return NextResponse.json({
                message:"UserId not valid",
                success:false
            })
        }

        return NextResponse.json({
            message:"Fetched user available credentials",
            credentials:userExist.credentials,
            success:false
        })
        
    } catch (error) {
        console.log("Error in getting user credentials: "+error);
        return NextResponse.json({
            "message":"Error in getting user credentials",
            "success":false
        })
    }
}

export const POST=async(_:NextRequest,{parmas}:{parmas:Promise<{userId:string}>})=>{
    try {
        const {userId} = await parmas

        const body = await _.json()

        const userExist = await prisma.user.findUnique({
            where:{
                id:userId
            },
            select:{
                credentials:true
            }
        })

        if(!userExist){
            return NextResponse.json({
                message:"UserId not valid",
                success:false
            })
        }

        const validInputs = NewCredentialsSchema.safeParse(body)

        if(!validInputs.success){
            return NextResponse.json({
                message:"Invalid inputs",
                success:false
            })
        }

        const newCreds = await prisma.credentials.create({
            data:{
                userId,
                apiKey:validInputs.data.api_key,
                Provider:validInputs.data.provider
            }
        })
        
    } catch (error) {
        console.log("Error in getting user credentials: "+error);
        return NextResponse.json({
            "message":"Error in getting user credentials",
            "success":false
        })
    }
}