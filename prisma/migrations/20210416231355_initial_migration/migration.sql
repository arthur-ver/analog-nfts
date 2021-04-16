-- CreateTable
CREATE TABLE "nfts" (
    "id" SERIAL NOT NULL,
    "token_id" INTEGER NOT NULL,
    "photo_cid" VARCHAR(255) NOT NULL,
    "metadata_cid" VARCHAR(255) NOT NULL,
    "photo_cdn" VARCHAR(255) NOT NULL,
    "creator" VARCHAR(42) NOT NULL,
    "title" VARCHAR(60) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "address" VARCHAR(42) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "refresh_token" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "draft_nfts" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "photo_cid" VARCHAR(255) NOT NULL,
    "metadata_cid" VARCHAR(255),
    "photo_cdn" VARCHAR(255) NOT NULL,
    "creator" VARCHAR(42),
    "title" VARCHAR(60),
    "description" VARCHAR(255),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invites" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nfts.token_id_unique" ON "nfts"("token_id");

-- CreateIndex
CREATE UNIQUE INDEX "nfts.photo_cid_unique" ON "nfts"("photo_cid");

-- CreateIndex
CREATE UNIQUE INDEX "nfts.metadata_cid_unique" ON "nfts"("metadata_cid");

-- CreateIndex
CREATE UNIQUE INDEX "nfts.photo_cdn_unique" ON "nfts"("photo_cdn");

-- CreateIndex
CREATE UNIQUE INDEX "users.address_unique" ON "users"("address");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users.username_unique" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "draft_nfts.photo_cid_unique" ON "draft_nfts"("photo_cid");

-- CreateIndex
CREATE UNIQUE INDEX "draft_nfts.metadata_cid_unique" ON "draft_nfts"("metadata_cid");

-- CreateIndex
CREATE UNIQUE INDEX "draft_nfts.photo_cdn_unique" ON "draft_nfts"("photo_cdn");

-- CreateIndex
CREATE UNIQUE INDEX "invites.code_unique" ON "invites"("code");

-- AddForeignKey
ALTER TABLE "draft_nfts" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
