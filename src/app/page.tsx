"use client"
import { useRef, useState } from "react";
import { TemplateList } from "@/components/template-list";
import { TemplateEditorPreview } from "@/components/template-editor-preview";
import { TemplateVariablePanel } from "@/components/template-variable-panel";

export default function Home() {
  // Larguras iniciais das colunas
  const [widths, setWidths] = useState([320, 600, 400]);
  const dragging = useRef<number | null>(null);

  const handleMouseDown = (idx: number) => {
    dragging.current = idx;
    document.body.style.cursor = "col-resize";
  };
  const handleMouseUp = () => {
    dragging.current = null;
    document.body.style.cursor = "";
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (dragging.current !== null) {
      const newWidths = [...widths];
      const min = 200;
      if (dragging.current === 0) {
        // entre coluna 0 e 1
        const newW = Math.max(min, e.clientX);
        newWidths[0] = newW;
        newWidths[1] = Math.max(min, widths[1] + (widths[0] - newW));
      } else if (dragging.current === 1) {
        // entre coluna 1 e 2
        const newW = Math.max(min, e.clientX - widths[0]);
        newWidths[1] = newW;
        newWidths[2] = Math.max(min, widths[2] + (widths[1] - newW));
      }
      setWidths(newWidths);
    }
  };
  // Listeners globais
  if (typeof window !== "undefined") {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
  }

  return (
    <main className="flex h-screen select-none">
      <div style={{ width: widths[0] }} className="border-r bg-card h-full overflow-auto">
        <TemplateList />
      </div>
      {/* Drag handle 1 */}
      <div
        className="w-2 cursor-col-resize bg-slate-200 hover:bg-slate-300 transition"
        onMouseDown={() => handleMouseDown(0)}
        style={{ zIndex: 10 }}
      />
      <div style={{ width: widths[1] }} className="border-r h-full overflow-auto">
        <TemplateEditorPreview />
      </div>
      {/* Drag handle 2 */}
      <div
        className="w-2 cursor-col-resize bg-slate-200 hover:bg-slate-300 transition"
        onMouseDown={() => handleMouseDown(1)}
        style={{ zIndex: 10 }}
      />
      <div style={{ width: widths[2] }} className="h-full overflow-auto">
        <TemplateVariablePanel />
      </div>
    </main>
  );
}
