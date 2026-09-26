"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { projects } from "@/db/schema";
import { requireAdmin } from "@/modules/auth/session";

export type ProjectInput = {
  title: string;
  slug: string;
  category: string;
  summary: string;
  description: string;
  link: string;
  year: string;
  tags: string;
  coverGradient: string;
  featured: boolean;
  published: boolean;
  sortOrder: number;
};

function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9\u0600-\u06FF-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `project-${Date.now()}`
  );
}

const ALLOWED = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);

async function saveCover(file: File): Promise<string> {
  const ext = ALLOWED.get(file.type);
  if (!ext) throw new Error("فرمت تصویر مجاز نیست (JPG، PNG، WebP یا AVIF)");
  if (file.size > 8 * 1024 * 1024) throw new Error("حجم تصویر باید کمتر از ۸ مگابایت باشد");
  const { writeFile, mkdir } = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

function parseInput(formData: FormData): ProjectInput {
  return {
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
    summary: String(formData.get("summary") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    link: String(formData.get("link") ?? "").trim(),
    year: String(formData.get("year") ?? "").trim(),
    tags: String(formData.get("tags") ?? "").trim(),
    coverGradient: String(formData.get("coverGradient") ?? "").trim() || "radial-gradient(300px 200px at 20% 0%, rgba(124,108,255,.8), #1B1F33)",
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
    sortOrder: Number(formData.get("sortOrder") ?? 0) || 0,
  };
}

export type ProjectFormState = { error?: string };

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const input = parseInput(formData);
  if (!input.title || !input.summary) return { error: "عنوان و خلاصه الزامی است" };

  let coverImage = "";
  const file = formData.get("cover");
  if (file instanceof File && file.size > 0) {
    try {
      coverImage = await saveCover(file);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "ذخیره تصویر ناموفق بود" };
    }
  }

  const slug = slugify(input.slug || input.title);
  try {
    await db.insert(projects).values({ ...input, slug, coverImage });
  } catch {
    return { error: "خطا در ذخیره — احتمالاً این نامک تکراری است" };
  }
  revalidatePath("/admin/projects");
  revalidatePath("/works");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function updateProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  await requireAdmin();
  const id = Number(formData.get("id"));
  if (!id) return { error: "شناسه نامعتبر است" };
  const input = parseInput(formData);
  if (!input.title || !input.summary) return { error: "عنوان و خلاصه الزامی است" };

  let coverImage = String(formData.get("existingCover") ?? "");
  const file = formData.get("cover");
  if (file instanceof File && file.size > 0) {
    try {
      coverImage = await saveCover(file);
    } catch (err) {
      return { error: err instanceof Error ? err.message : "ذخیره تصویر ناموفق بود" };
    }
  }

  const slug = slugify(input.slug || input.title);
  try {
    await db.update(projects).set({ ...input, slug, coverImage }).where(eq(projects.id, id));
  } catch {
    return { error: "خطا در ذخیره — احتمالاً این نامک تکراری است" };
  }
  revalidatePath("/admin/projects");
  revalidatePath("/works");
  revalidatePath("/");
  redirect("/admin/projects");
}

export async function deleteProject(id: number): Promise<void> {
  await requireAdmin();
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePath("/admin/projects");
  revalidatePath("/works");
  revalidatePath("/");
}

export async function toggleProjectPublished(id: number, published: boolean): Promise<void> {
  await requireAdmin();
  await db.update(projects).set({ published }).where(eq(projects.id, id));
  revalidatePath("/admin/projects");
  revalidatePath("/works");
  revalidatePath("/");
}
