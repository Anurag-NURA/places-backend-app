/*
  Warnings:

  - You are about to drop the column `image` on the `Place` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Place" DROP COLUMN "image",
ADD COLUMN     "image_public_id" TEXT,
ADD COLUMN     "image_secure_url" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
ADD COLUMN     "image_public_id" TEXT,
ADD COLUMN     "image_secure_url" TEXT;
