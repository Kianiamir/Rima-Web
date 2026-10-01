import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

async function getProject(slug: string) {
  const rows = await db
    .select()
    .from(projects)
    .where(and(eq(projects.slug, slug), eq(projects.published, true)))
    .limit(1);
  return rows[0] ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "پروژه پیدا نشد" };
  return { title: project.title, description: project.summary };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const tags = project.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const cover = project.coverImage
    ? { backgroundImage: `url(${project.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundImage: project.coverGradient };

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-14">
        <Link href="/works" className="text-sm font-bold text-accent-ink transition hover:opacity-80">
          → بازگشت به نمونه‌کارها
        </Link>

        <div className="arch mt-6 h-64 max-w-[420px] sm:h-80" style={cover} />

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border-2 border-ink bg-primary/10 px-4 py-1.5 text-xs font-extrabold text-primary-soft">
            {project.category}
          </span>
          {project.year && (
            <span className="rounded-full border-2 border-line px-4 py-1.5 text-xs font-bold text-muted">
              {project.year}
            </span>
          )}
        </div>

        <h1 className="mt-5 text-4xl font-black">{project.title}</h1>
        <p className="mt-4 text-lg leading-8 font-medium text-muted">{project.summary}</p>

        {project.description && (
          <div className="mt-8 whitespace-pre-line text-[15.5px] leading-9 text-ink/90">
            {project.description}
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span key={t} className="rounded-full border-2 border-line px-4 py-1.5 text-xs font-bold text-muted">
                {t}
              </span>
            ))}
          </div>
        )}

        {project.link && (
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn-hard btn-hard-primary mt-10">
            مشاهده وب‌سایت ↗
          </a>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
