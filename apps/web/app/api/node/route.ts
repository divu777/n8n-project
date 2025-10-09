import prisma from "@/app/db";
import { authOptions } from "@/lib/auth";
import { NodeDataSchema } from "@repo/types";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST=async(_:NextRequest)=>{
    try {
        const session = await getServerSession(authOptions)
        console.log(JSON.stringify(session)+"=====")
        const body = await _.json()

       console.log(JSON.stringify(body))
        if(!session || !session.user || !session.user.id){
            return NextResponse.json({
                message:"Unauthorized",
                success:false
            })
        }

        const userExist = await prisma.user.findUnique({
            where:{
                id:session.user.id
            }
        })

        if(!userExist){

            return NextResponse.json({
                message:"User does not exist",
                success:false
            })
        }

        const validInputs = NodeDataSchema.safeParse(body)

        if(!validInputs.success){
            return NextResponse.json({
                message:"Invalid inputs",
                success:false,
                error:validInputs.error
            })
        }

        const workflowExist = await prisma.workflow.findUnique({
            where:{
                id:validInputs.data.workflowId
            },
            select:{
                nodes:true
            }
        })

        if(!workflowExist){
            return NextResponse.json({
                message:"Workflow does not exist",
                success:false
            })
        }

        await prisma.node.create({
            data:{
                workflowId:validInputs.data.workflowId,
                config:validInputs.data.config!??  null,
                type:validInputs.data.type,
                nodeId: validInputs.data.nodeId,
                xCoordinate:validInputs.data.xCoordinate,
                yCoordinate:validInputs.data.yCoordinate,
                data:validInputs.data.data!
            }
        })

        return NextResponse.json({
            message:"Node created successfully",
            success:true
        })


        
    } catch (error) {
        console.log("Error in Saving Node Configuration: "+error);
        return NextResponse.json({
            message:"Error in saving node configuration",
            success:false
        })
    }
}


export const PUT = async(req:NextRequest)=>{
    try {
        const body = await req.json()

        const nodeExist = await prisma.node.findUnique({
            where:{
                workflowId_nodeId:{
                    workflowId:body.workflowId,
                    nodeId:body.nodeId
                }
            }
        })

        if(!nodeExist){
            return NextResponse.json({
                message:"Node does not exist",
                success:false
            })
        }



        const nodeData = await prisma.node.update({
            where:{
                workflowId_nodeId:{
                    workflowId:body.workflowId,
                    nodeId:body.nodeId
                }
            },
            data:{
                config:body.config
            }
        })
    } catch (error) {
        console.log("Error in updating the nodes: "+error);
        return NextResponse.json({
            message:"Error in updating nodes",
            success:false
        })
    }
}

import z from 'zod/v4'
export const deleteNodeSchema = z.object({
    workflowId:z.string(),
    nodes:z.array(z.object({
    id:z.string()
}))})

export const DELETE=async(req:NextRequest)=>{
    try {
        console.log(JSON.stringify(req))

        const body = await req.json()
                console.log(JSON.stringify(body)+"----body")

        const validInputs= deleteNodeSchema.safeParse(body)

        if(!validInputs.success){
            return NextResponse.json({
                message:"Invalid Inputs",
                success:false
            })
        }

        validInputs.data.nodes.map(async(node)=>{
            await prisma.node.delete({
                where:{
                    workflowId_nodeId:{

                        nodeId:node.id,
                        workflowId:validInputs.data.workflowId
                    }
                }
            })
        })

        return NextResponse.json({
            message:"Deleted all the nodes",
            success:true
        })
        
    }   
     catch (error) {
        console.log("Error in deleting nodes: "+error);
        return NextResponse.json({
            message:"Error in deleting nodes",
            success:false
        })
    }
}

/**
 right now the issue will arise with you submitting the same config 2 times leads to creating nodes 2 , even tho you have one on the UI
 So what i think your past self is that you fetch node and edge data from the backend for this workflow to be shown in the UI and
 if you do the same mistake as above nodeId should be passed for the old node so we know its put request and make post when new node
 */