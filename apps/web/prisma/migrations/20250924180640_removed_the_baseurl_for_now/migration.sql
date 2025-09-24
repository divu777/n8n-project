/*
  Warnings:

  - You are about to drop the column `baseUrl` on the `Credentials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Credentials" DROP COLUMN "baseUrl";
