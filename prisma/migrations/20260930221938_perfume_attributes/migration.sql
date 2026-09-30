-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "tagline" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "baseNotes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "concentration" TEXT,
ADD COLUMN     "heartNotes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sizeMl" INTEGER,
ADD COLUMN     "topNotes" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Product_isActive_isFeatured_idx" ON "Product"("isActive", "isFeatured");
