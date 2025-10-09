import prisma from "@/app/db";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { NewWorflowSchema } from "@repo/types";
import { getServerSession } from "next-auth";

export const GET = async (_: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    console.log(JSON.stringify(session) + "=======>");

    // console.log(JSON.stringify(session?.user))
    //         console.log(JSON.stringify(session?.user?.id ?? "no output"))

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({
        message: "Unauthorizzed",
        success: false,
      });
    }

    const workflows = await prisma.workflow.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Fetched all user workflows",
      workflows: workflows.length > 0 ? workflows : [],
      success: true,
    });
  } catch (error) {
    console.log("Error in getting workflows" + error);
    return NextResponse.json({
      message: "error in getting workflows",
      success: false,
      status: 500,
    });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();

    

    const validInputs = NewWorflowSchema.safeParse(body);

    if (!validInputs.success) {
      return NextResponse.json({
        message: "Invalid Input",
        sucess: false,
      });
    }

    const newWorkflow= await prisma.workflow.create({
      data: {
        ...validInputs.data,
      },
      select:{
        name:true,
        id:true,
        status:true
      }
    });

    return NextResponse.json({
      message: "created new workflow",
      success: true,
      statue: 200,
      data:newWorkflow
    });
  } catch (error) {
    console.log("Error in creating new workflow" + error);
    return NextResponse.json({
      message: "Error in creating new workflow",
      success: false,
      status: 500,
    });
  }
};
