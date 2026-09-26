import Link from "next/link";
import type { Project } from "@/db/schema";

/** Gradient fallback when a project has no uploaded cover image. */
const FALLBACK_GRADIENTS = [
  "radial-gradient(300px 200px at 20% 0%, rgba(124,108,255,.8), #1B1F33)",
  "radial-gradient(300px 200px at 80% 10%, rgba(45,212,191,.55), #14232B)",
  "radial-gradient(300px 200px at 50% 100%, rgba(167,139,250,.6), #1B1B2E)",
];

export function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  const cover = project.coverImage
    ? { backgroundImage: `url(${project.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { backgroundImage: project.coverGradient || FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length] };

  return (
    <Link
      href={`/works/${project.slug}`}
      className="group block overflow-hidden rounded-[22px] border border-line bg-surface transition hover:border-primary/50 hover:shadow-[0_20px_50px_-20px_rgba(124,108,255,.3)]"
    >
      <div className="relative h-48 sm:h-52" style={cover}>
        <span className="absolute top-3.5 right-3.5 rounded-full bg-bg/80 px-3.5 py-1.5 text-[11.5px] font-bold text-ink backdrop-blur">
          {project.category}
        </span>
      </div>
      <div className="flex items-center justify-between p-5">
        <div>
          <h3 className="font-bold">{project.title}</h3>
          <span className="mt-1.5 block text-xs text-muted">{project.summary}</span>
        </div>
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-accent transition group-hover:border-accent/50"
        >
          ←
        </span>
      </div>
    </Link>
  );
}
