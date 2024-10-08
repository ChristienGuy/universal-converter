-- CreateTable
CREATE TABLE "APIUsageLog" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "requestBody" TEXT NOT NULL,
    "requestParams" TEXT NOT NULL,
    "requestQuery" TEXT NOT NULL,
    "responseBody" TEXT NOT NULL,

    CONSTRAINT "APIUsageLog_pkey" PRIMARY KEY ("id")
);
