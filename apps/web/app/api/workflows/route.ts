import { NextRequest, NextResponse } from "next/server"

export const GET=(_:NextRequest)=>{
    try {
        console.log("=======")
        return NextResponse.json({
            data:["workflow 1","workflow 2"]
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
