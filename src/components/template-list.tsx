"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Download, Upload, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTemplateStore } from "@/store/template-store";

export function TemplateList() {
  const [editingTemplate, setEditingTemplate] = useState<{ id: string; name: string } | null>(null);
  const [editName, setEditName] = useState("");
  const [open, setOpen] = useState(false);

  const {
    templates,
    selectedTemplateId,
    addTemplate,
    deleteTemplate,
    selectTemplate,
    updateTemplate
  } = useTemplateStore();

  const handleExport = () => {
    const data = JSON.stringify(templates);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "templates.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Templates exported");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedTemplates = JSON.parse(e.target?.result as string);
          useTemplateStore.setState({ templates: importedTemplates });
          toast.success("Templates imported");
        } catch (error) {
          toast.error("Error importing templates");
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRename = () => {
    if (editingTemplate && editName.trim()) {
      const template = templates.find(t => t.id === editingTemplate.id);
      if (template) {
        updateTemplate({
          ...template,
          name: editName.trim()
        });
        setEditingTemplate(null);
        setOpen(false);
        toast.success("Template renamed");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-900">Templates</h2>
        <Button onClick={addTemplate} size="sm" variant="outline" className="bg-white hover:bg-slate-100 transition">
          <Plus className="w-4 h-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleExport} size="sm" variant="outline" className="flex-1 bg-white hover:bg-slate-100 transition">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1 bg-white hover:bg-slate-100 transition">
          <label>
            <Upload className="w-4 h-4 mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </Button>
      </div>

      <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => selectTemplate(template.id)}
            className={`template-item ${selectedTemplateId === template.id ? 'template-item-selected' : ''}`}
          >
            <button
              className="flex-1 text-left text-slate-700"
            >
              {template.name}
            </button>
            <div className="flex gap-1">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-slate-200 transition"
                    onClick={() => {
                      setEditingTemplate(template);
                      setEditName(template.name);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rename Template</DialogTitle>
                  </DialogHeader>
                  <div className="flex gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleRename();
                        }
                      }}
                      className="flex-1"
                      autoFocus
                    />
                    <Button onClick={handleRename} className="hover:bg-slate-100 transition">Save</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-red-100 transition"
                onClick={() => deleteTemplate(template.id)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 