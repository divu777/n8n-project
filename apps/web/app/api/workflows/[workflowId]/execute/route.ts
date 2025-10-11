import { success } from 'zod/v4';
import { NextRequest, NextResponse } from "next/server";
import prisma from '@/app/db';
import { runExecution, runExecutionstreamable } from '@/lib/helper';

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

        const stream = new ReadableStream({
            async start(controller){
                const encoder= new TextEncoder()
                const send = (data:any)=>{
                    controller.enqueue(encoder.encode(`${JSON.stringify(data)}\n`))
                }

                await runExecutionstreamable(workflowExist.nodes,workflowExist.edges,send)
                send({event:"done",message:"Worflow Complete",success:true})
                controller.close()
            }   
        })

        const result = await runExecution(workflowExist.nodes,workflowExist.edges)

        return new NextResponse(stream,{
            headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Transfer-Encoding": "chunked",
    },
        })
        
    } catch (error) {
        console.log("Error in executing the workflow: "+error);
        return NextResponse.json({
            message:"Error in executing workflow",
            success:false
        })
    }
}