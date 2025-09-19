import prisma from '@/app/db';
import { NewWorflowSchema } from './../../../../../packages/types/index';
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/utils';

export const GET=async(_:NextRequest)=>{
    try {
        const session = await getServerSession(authOptions)

        if(!session || !session.user || !session.user.name ){
            return NextResponse.json({
                message:"Unauthorizzed",
                success:false
            })
        }
        
        const workflows = await prisma.workflow.findMany({
            where:{
                userId:session.user.name
            }
        })

        return NextResponse.json({
            "message":"Fetched all user workflows",
            workflows: workflows.length>0 ? workflows : [],
            success:true
        })


        
    } catch (error) {
        console.log("Error in getting workflows");
        NextResponse.json({
            message:"error in getting workflows",
            success:false,
            status:500
        })
    }
}

export const POST=async(req:NextRequest)=>{

    try {
        const body =  await req.json()
        const validInputs = NewWorflowSchema.safeParse(body)

        if(!validInputs.success){
            return NextResponse.json({
                message:"Invalid Input",
                sucess:false
            })
        }

        await prisma.workflow.create({
            data:{
                ...validInputs.data
            }
        })

        return NextResponse.json({
            message:"created new workflow",
            success:true,
            statue:200
        })
        
    } catch (error) {
        console.log("Error in creating new workflow"+error)
        return NextResponse.json({
            "message":"Error in creating new workflow",
            success: false,
            status:500
        })
    }
}
