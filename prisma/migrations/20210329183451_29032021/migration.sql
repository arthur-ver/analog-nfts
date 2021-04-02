-- CreateTable
CREATE TABLE "nft" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "photoCID" VARCHAR(255) NOT NULL,
    "metadataCID" VARCHAR(255) NOT NULL,
    "creator" VARCHAR(42) NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);
