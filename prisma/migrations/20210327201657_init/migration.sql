/*
  Warnings:

  - You are about to drop the `NFT` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "NFT";

-- CreateTable
CREATE TABLE "nft" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "photoCID" TEXT NOT NULL,
    "metadataCID" TEXT NOT NULL,
    "creator" VARCHAR(42) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);
