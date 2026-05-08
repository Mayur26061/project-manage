-- DropForeignKey
ALTER TABLE "project_stages" DROP CONSTRAINT "project_stages_project_id_fkey";

-- AddForeignKey
ALTER TABLE "project_stages" ADD CONSTRAINT "project_stages_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
