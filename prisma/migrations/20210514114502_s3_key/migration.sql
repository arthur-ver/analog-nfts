/*
  Warnings:

  - A unique constraint covering the columns `[s3_key]` on the table `draft_nfts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `s3_key` to the `draft_nfts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "draft_nfts" ADD COLUMN     "s3_key" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "draft_nfts.s3_key_unique" ON "draft_nfts"("s3_key");
