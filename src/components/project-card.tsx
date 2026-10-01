import Link from "next/link";
import type { Project } from "@/db/schema";

/** Gradient fallback when a project has no uploaded cover image (نیلی family). */
const FALLBACK_GRADIENTS = [
  "linear-gradient(160deg, #4F46E5, #818CF8)",
  "linear-gradient(160deg, #F59E0B, #FBBF24)",
  "linear-gradient(160deg, #3730A3, #4F46E5)",
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
    <Link href={`/works/${project.slug}`} className="group block text-center">
      <div
        className={`arch mx-auto h-64 w-full max-w-[290px] transition-transform duration-200 group-hover:-translate-y-1.5`}
        style={cover}
      >
        <span className="tagf">{project.category}</span>
      </div>
      <h3 className="mt-5 text-lg font-black">{project.title}</h3>
      <span className="mt-1 block text-[13px] font-semibold text-muted">{project.summary}</span>
    </Link>
  );
}
