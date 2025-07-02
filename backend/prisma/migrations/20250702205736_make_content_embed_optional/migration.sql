-- AlterTable
ALTER TABLE "User" ADD COLUMN     "collab_embed" DOUBLE PRECISION[],
ADD COLUMN     "content_embed" vector(2000);

-- CreateTable
CREATE TABLE "_UserRecommendations" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserRecommendations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserRecommendations_B_index" ON "_UserRecommendations"("B");

-- AddForeignKey
ALTER TABLE "_UserRecommendations" ADD CONSTRAINT "_UserRecommendations_A_fkey" FOREIGN KEY ("A") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserRecommendations" ADD CONSTRAINT "_UserRecommendations_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
