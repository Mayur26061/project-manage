-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "customer_id" INTEGER,
ADD COLUMN     "date_end" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
