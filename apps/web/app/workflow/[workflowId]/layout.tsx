import prisma from "@/app/db";
import { redirect } from "next/navigation";
import React from "react";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workflowId: string }>;
}) => {
  const uniqueId = (await params).workflowId;
 
  return <div>{children}</div>;
};

export default layout;
