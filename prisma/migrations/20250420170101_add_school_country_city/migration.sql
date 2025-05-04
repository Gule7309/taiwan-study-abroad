-- AlterTable
ALTER TABLE "School" ADD COLUMN "admissions" TEXT;
ALTER TABLE "School" ADD COLUMN "city" TEXT;
ALTER TABLE "School" ADD COLUMN "country" TEXT;
ALTER TABLE "School" ADD COLUMN "facilities" TEXT;
ALTER TABLE "School" ADD COLUMN "logo" TEXT;
ALTER TABLE "School" ADD COLUMN "majors" TEXT;
ALTER TABLE "School" ADD COLUMN "tuition" REAL;

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Favorite_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_schoolId_key" ON "Favorite"("userId", "schoolId");
