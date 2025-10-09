-- DropForeignKey
ALTER TABLE "public"."Edge" DROP CONSTRAINT "Edge_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Edge" DROP CONSTRAINT "Edge_targetId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Edge" ADD CONSTRAINT "Edge_sourceId_workflowId_fkey" FOREIGN KEY ("sourceId", "workflowId") REFERENCES "public"."Node"("nodeId", "workflowId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Edge" ADD CONSTRAINT "Edge_targetId_workflowId_fkey" FOREIGN KEY ("targetId", "workflowId") REFERENCES "public"."Node"("nodeId", "workflowId") ON DELETE RESTRICT ON UPDATE CASCADE;
