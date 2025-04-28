import { useTemplateStore } from "@/store/template-store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { stringToColor } from "@/utils/color-hash";
import { Textarea } from "./ui/textarea";

export function TemplateVariablePanel() {
  const { templates, selectedTemplateId, updateTemplate } = useTemplateStore();
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  if (!selectedTemplate || !selectedTemplate.variables || selectedTemplate.variables.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400">Nenhuma variável</div>;
  }

  const handleChange = (name: string, value: string) => {
    const newVars = selectedTemplate.variables!.map(v => v.name === name ? { ...v, value } : v);
    updateTemplate({ ...selectedTemplate, variables: newVars });
  };

  return (
    <div className="p-6 space-y-4">
      <h3 className="text-lg font-semibold mb-2">Preencha as variáveis</h3>
      {selectedTemplate.variables.map(variable => (
        <div key={variable.name} className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full inline-block"
            style={{ background: stringToColor(variable.name) }}
            title={variable.name}
          />
          <Label htmlFor={variable.name} className="flex-1">{variable.name}</Label>
          <Textarea
            id={variable.name}
            value={variable.value}
            onChange={e => handleChange(variable.name, e.target.value)}
            style={{ borderColor: stringToColor(variable.name) }}
            className="flex-1"
            placeholder={`Valor para ${variable.name}`}
          />
        </div>
      ))}
    </div>
  );
} 