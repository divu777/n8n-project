import { NextRequest, NextResponse } from "next/server";

export const GET = async(_:NextRequest)=>{
    try {
        
    } catch (error) {
        console.log("Error in getting edges data: "+error);
        return NextResponse.json({
            message:'Error in getting edges for the workflow',
            success:false
        })
    }
}

export const POST = async(req:NextRequest)=>{
    try {
        
    } catch (error) {
        console.log("Error in adding edge: "+error);
        return NextResponse.json({
            message:"Error in adding edge to the workflow",
            success:false
        })
    }
}