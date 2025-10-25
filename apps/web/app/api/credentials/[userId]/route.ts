import prisma from "@/app/db";
import { encrypt } from "@/lib/helper";
import { NewCredentialsSchema } from "@repo/types";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  try {
    const { userId } = await params;

    const userExist = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        credentials: true,
      },
    });

    if (!userExist) {
      return NextResponse.json({
        message: "UserId not valid",
        success: false,
      });
    }

    return NextResponse.json({
      message: "Fetched user available credentials",
      credentials: userExist.credentials,
      success: true,
    });
  } catch (error) {
    console.log("Error in getting user credentials: " + error);
    return NextResponse.json({
      message: "Error in getting user credentials",
      success: false,
    });
  }
};

export const POST = async (
  _: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) => {
  try {
    const userId = (await params).userId;

    const body = await _.json();

    const userExist = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        credentials: true,
      },
    });

    if (!userExist) {
      return NextResponse.json({
        message: "UserId not valid",
        success: false,
      });
    }

    const validInputs = NewCredentialsSchema.safeParse(body);

    if (!validInputs.success) {
      return NextResponse.json({
        message: "Invalid inputs",
        success: false,
      });
    }

    const encryptedAPI = encrypt(validInputs.data.api_key);

    const newCreds = await prisma.credentials.create({
      data: {
        userId,
        apiKey: encryptedAPI,
        Provider: validInputs.data.provider,
        name:validInputs.data.name
      },
      select:{
        id:true,
        Provider:true,
        name:true
      }
    });

    if (!newCreds) {
      return NextResponse.json({
        message: "error in adding new creds",
        success: false,
       
      });
    }

    return NextResponse.json({
      message: "Added new creds for user successfully",
      success: true,
       data:{
          ...newCreds,
          api_key:validInputs.data.api_key
        }
    });
  } catch (error) {
    console.log("Error in getting user credentials: " + error);
    return NextResponse.json({
      message: "Error in getting user credentials",
      success: false,
    });
  }
};
