-- This is an empty migration.
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_priority_check";
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_priority_check" CHECK (priority >= 0 AND priority <= 3);