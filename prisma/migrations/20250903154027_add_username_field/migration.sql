/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable - First add username column with a default value
ALTER TABLE "users" ADD COLUMN "username" TEXT;

-- Update existing users to have username based on their email (before @ symbol)
UPDATE "users" SET "username" = SPLIT_PART("email", '@', 1) WHERE "username" IS NULL;

-- Now make username required and unique
ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;

-- Make email optional
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
