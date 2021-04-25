/*
  Warnings:

  - You are about to drop the column `creator` on the `draft_nfts` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "draft_nfts" DROP COLUMN "creator";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "refresh_token";
