/*
  Warnings:

  - You are about to alter the column `photoCDN` on the `nft` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "nft" ALTER COLUMN "photoCDN" DROP DEFAULT,
ALTER COLUMN "photoCDN" SET DATA TYPE VARCHAR(255);
