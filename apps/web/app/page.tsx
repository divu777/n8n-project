import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import React from "react";

const page = async() => {
  const session = await getServerSession(authOptions)
 // console.log(JSON.stringify(session))
  return <div>landing page</div>;
};

export default page;
