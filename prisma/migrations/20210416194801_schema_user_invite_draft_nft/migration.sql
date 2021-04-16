-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "address" VARCHAR(42) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(30) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draftNft" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "photoCID" VARCHAR(255) NOT NULL,
    "metadataCID" VARCHAR(255),
    "photoCDN" VARCHAR(255) NOT NULL,
    "creator" VARCHAR(42),
    "title" VARCHAR(60),
    "description" VARCHAR(255),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invite" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user.address_unique" ON "user"("address");

-- CreateIndex
CREATE UNIQUE INDEX "user.email_unique" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user.username_unique" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "draftNft.photoCID_unique" ON "draftNft"("photoCID");

-- CreateIndex
CREATE UNIQUE INDEX "draftNft.metadataCID_unique" ON "draftNft"("metadataCID");

-- CreateIndex
CREATE UNIQUE INDEX "draftNft.photoCDN_unique" ON "draftNft"("photoCDN");

-- CreateIndex
CREATE UNIQUE INDEX "invite.code_unique" ON "invite"("code");

-- AddForeignKey
ALTER TABLE "draftNft" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invite" ADD FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
