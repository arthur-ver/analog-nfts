/*
  Warnings:

  - A unique constraint covering the columns `[photo_cdn_id]` on the table `draft_nfts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `photo_cdn_id` to the `draft_nfts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "draft_nfts" ADD COLUMN     "photo_cdn_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "draft_nfts.photo_cdn_id_unique" ON "draft_nfts"("photo_cdn_id");
