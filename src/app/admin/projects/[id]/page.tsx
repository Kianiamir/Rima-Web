import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { ProjectForm } from "../project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.id, Number(id)))
    .limit(1);
  const project = rows[0];
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-black">ویرایش «{project.title}»</h1>
      <div className="mt-8">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
