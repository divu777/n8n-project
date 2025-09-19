-- AlterEnum
ALTER TYPE "public"."nodeType" ADD VALUE 'LLM';

-- AlterTable
ALTER TABLE "public"."Node" ADD COLUMN     "config" TEXT;
