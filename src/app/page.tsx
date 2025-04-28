"use client"
import { useRef, useState } from "react";
import { TemplateList } from "@/components/template-list";
import { TemplateEditorPreview } from "@/components/template-editor-preview";
import { TemplateVariablePanel } from "@/components/template-variable-panel";

export default function Home() {
  // Larguras iniciais das colunas esquerda e direita
  const [widths, setWidths] = useState([320, 400]);
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
      const min = 200;
      const newWidths = [...widths];
      if (dragging.current === 0) {
        // entre coluna 0 e 1
        const newW = Math.max(min, e.clientX);
        newWidths[0] = newW;
      } else if (dragging.current === 1) {
        // entre coluna 1 e 2
        const newW = Math.max(min, window.innerWidth - e.clientX);
        newWidths[1] = newW;
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
      <div className="h-full overflow-auto flex-1 min-w-[200px]">
        <TemplateEditorPreview />
      </div>
      {/* Drag handle 2 */}
      <div
        className="w-2 cursor-col-resize bg-slate-200 hover:bg-slate-300 transition"
        onMouseDown={() => handleMouseDown(1)}
        style={{ zIndex: 10 }}
      />
      <div style={{ width: widths[1] }} className="h-full overflow-auto">
        <TemplateVariablePanel />
      </div>
    </main>
  );
}
