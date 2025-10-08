/*
  Warnings:

  - The values [TRIGGER] on the enum `nodeType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."nodeType_new" AS ENUM ('MANUAL', 'SCHEDULER', 'LLM');
ALTER TABLE "public"."Node" ALTER COLUMN "type" TYPE "public"."nodeType_new" USING ("type"::text::"public"."nodeType_new");
ALTER TYPE "public"."nodeType" RENAME TO "nodeType_old";
ALTER TYPE "public"."nodeType_new" RENAME TO "nodeType";
DROP TYPE "public"."nodeType_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Node" ALTER COLUMN "nodeId" SET DATA TYPE TEXT;
