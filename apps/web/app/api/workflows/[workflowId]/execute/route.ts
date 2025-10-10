import { success } from 'zod/v4';
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/db';
import { runExecution } from '@/lib/helper';

export const GET = async(_:NextRequest,{params}:{params:Promise<{workflowId:string}>})=>{
    try {
        const {workflowId} = await params

        const workflowExist = await prisma.workflow.findUnique({
            where:{
                id:workflowId
            },
            select:{
                edges:true,
                nodes:true
            }
        })

        if(!workflowExist || workflowExist.edges.length==0 || workflowExist.nodes.length==0){
            return NextResponse.json({
                message:"Workflow Error",
                success:false
            })
        }

        const result = await runExecution(workflowExist.nodes,workflowExist.edges)

        return NextResponse.json({
            message:"Workflow executed",
            success:true,
            result
        })
        
    } catch (error) {
        console.log("Error in executing the workflow: "+error);
        return NextResponse.json({
            message:"Error in executing workflow",
            success:false
        })
    }
}