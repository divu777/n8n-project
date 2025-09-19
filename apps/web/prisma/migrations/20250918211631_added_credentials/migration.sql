-- CreateEnum
CREATE TYPE "public"."LLMProvider" AS ENUM ('OpenAI', 'Anthropic', 'Gemini');

-- CreateTable
CREATE TABLE "public"."Credentials" (
    "id" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "baseUrl" TEXT NOT NULL,
    "Provider" "public"."LLMProvider" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Credentials_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Credentials" ADD CONSTRAINT "Credentials_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
