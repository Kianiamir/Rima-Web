import { ProjectForm } from "../project-form";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-black">افزودن نمونه‌کار جدید</h1>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </div>
  );
}
