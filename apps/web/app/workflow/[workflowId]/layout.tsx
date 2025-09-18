import React from "react";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ workflowId: string }>;
}) => {
  const uniqueId = (await params).workflowId;
  console.log(uniqueId);
  return <div>{children}</div>;
};

export default layout;
