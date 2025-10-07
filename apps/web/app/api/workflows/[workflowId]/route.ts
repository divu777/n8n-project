import prisma from "@/app/db"
import { NextRequest, NextResponse } from "next/server"

export const GET = async(req:NextRequest,{params}:{params:Promise<{workflowId:string}>})=>{
    const workflowId = (await params).workflowId
    try {

        const workflowData = await prisma.workflow.findUnique({
            where:{
                id:workflowId
            },
            include:{
                nodes:true
            }
        })

        if(!workflowData){
            return NextResponse.json({
                message:"No workflow found",
                success:true
            })
        }
        
        return NextResponse.json({
            message:"Here is the worflow data",
            success:true,
            data:workflowData
        })
        
    } catch (error) {
        console.log('Error in getting workflow data: '+error)
        return NextResponse.json({
            message:"Error in getting workflow data",
            success:false,
        })
    }
}

export const PUT = async(req:NextRequest,{params}:{params:Promise<{workflowId:string}>})=>{
    const workflowId = (await params).workflowId
    try {

       
        
    } catch (error) {
        console.log('Error in updating workflow data: '+error)
        return NextResponse.json({
            message:"Error in updating workflow data",
            success:false,
        })
    }
}


export const DELETE = async(req:NextRequest,{params}:{params:Promise<{workflowId:string}>})=>{
    const workflowId = (await params).workflowId
    try {

       
        
    } catch (error) {
        console.log('Error in deleting workflow: '+error)
        return NextResponse.json({
            message:"Error in deleting workflow",
            success:false,
        })
    }
}

