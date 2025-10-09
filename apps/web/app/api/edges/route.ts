import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(_:NextRequest)=>{
    try {
        const edges = await prisma.edge.findMany()

        return NextResponse.json({
            message:"Fetched all the edges",
            success:true,
            edges:edges
        })
        
    } catch (error) {
        console.log("Error in getting edges data: "+error);
        return NextResponse.json({
            message:'Error in getting edges for the workflow',
            success:false
        })
    }
}
import z, { success } from "zod/v4"

const newEdgeSchema = z.object({
    sourceId:z.string(),
    targetId:z.string(),
    workflowId:z.string()
})
export const POST = async(req:NextRequest)=>{
    try {

        const body = await req.json()

        const validInputs= newEdgeSchema.safeParse(body);

        if(!validInputs.success){
            return NextResponse.json({
                message:"Invalid inputs",
                success:false
            })
        }

        const newEdge = await prisma.edge.create({
            data:{
                ...validInputs.data
            }
        })

        return NextResponse.json({
            message:"Edge added successfully",
            success:true
        })
        
    } catch (error) {
        console.log("Error in adding edge: "+error);
        return NextResponse.json({
            message:"Error in adding edge to the workflow",
            success:false
        })
    }
}

export const updateEdgeSchema = z.object({
    id:z.string(),
    sourceId:z.string().optional(),
    targetId:z.string().optional()
})

export const PUT = async(req:NextRequest)=>{
    try {

        const body = await req.json()

        const validInputs= updateEdgeSchema.safeParse(body)

        if(!validInputs.success){
             return NextResponse.json({
                message:"Invalid inputs",
                success:false
            })
        }

        const updateEdge = await prisma.edge.update({
            where:{
                id:validInputs.data.id
            },
            data:{
                sourceId:validInputs.data.sourceId,
                targetId:validInputs.data.targetId
            }
        })
        
    } catch (error) {
        console.log("Error in updating edges: "+error);
        return NextResponse.json({
            message:"Error in updating edges",
            success:false
        })    }
}

export const deleteEdgeSchema = z.array(z.object({
    id:z.string()
}))

export const DELETE = async(req:NextRequest)=>{
    try {
        console.log(JSON.stringify(req))

        const body = await req.json()
                console.log(JSON.stringify(body)+"----body")

        const validInputs= deleteEdgeSchema.safeParse(body.edges)

        if(!validInputs.success){
            return NextResponse.json({
                message:"Invalid Inputs",
                success:false
            })
        }

        validInputs.data.map(async(edge)=>{
            await prisma.edge.delete({
                where:{
                    id:edge.id
                }
            })
        })

        return NextResponse.json({
            message:"Deleted all the edges",
            success:true
        })
        
    } catch (error) {
        console.log("Error in deleting edges: "+error);
        return NextResponse.json({
            message:"Error in deleting edges",
            success:false
        })    }
}