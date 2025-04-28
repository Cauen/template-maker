"use client"
import { TemplateList } from "@/components/template-list";
import { TemplateEditor } from "@/components/template-editor";

export default function Home() {
  return (
    <main className="flex h-screen">
      <div className="w-80 border-r">
        <TemplateList />
      </div>
      <div className="flex-1 p-6">
        <TemplateEditor />
      </div>
    </main>
  );
}
