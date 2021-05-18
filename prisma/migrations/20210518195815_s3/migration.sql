/*
  Warnings:

  - You are about to drop the column `s3_key` on the `draft_nfts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[photo_s3]` on the table `draft_nfts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[metadata_s3]` on the table `draft_nfts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `photo_s3` to the `draft_nfts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "draft_nfts.s3_key_unique";

-- AlterTable
ALTER TABLE "draft_nfts" DROP COLUMN "s3_key",
ADD COLUMN     "photo_s3" TEXT NOT NULL,
ADD COLUMN     "metadata_s3" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "draft_nfts.photo_s3_unique" ON "draft_nfts"("photo_s3");

-- CreateIndex
CREATE UNIQUE INDEX "draft_nfts.metadata_s3_unique" ON "draft_nfts"("metadata_s3");
