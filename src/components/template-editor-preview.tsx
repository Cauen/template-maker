import { useTemplateStore } from "@/store/template-store";
import { stringToColor } from "@/utils/color-hash";
import { Textarea } from "@/components/ui/textarea";

function extractVariables(content: string, oldVars: { name: string; value: string }[] = []) {
  const regex = /{{([^}]+)}}/g;
  const matches = content.match(regex) || [];
  const uniqueNames = [...new Set(matches.map(m => m.slice(2, -2)))];
  return uniqueNames.map(name => ({
    name,
    value: oldVars.find(v => v.name === name)?.value || ""
  }));
}

function highlightVariables(text: string, variables: { name: string; value: string }[]) {
  if (!variables || variables.length === 0) return text;
  const regex = /{{([^}]+)}}/g;
  let lastIndex = 0;
  const parts: React.ReactNode[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const varName = match[1];
    const variable = variables.find(v => v.name === varName);
    const color = stringToColor(varName);
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span
        key={varName + match.index}
        style={{
          background: color,
          color: '#fff',
          borderRadius: 4,
          padding: '0 6px',
          margin: '0 2px',
          fontWeight: 600,
          display: 'inline-block',
        }}
        title={varName}
      >
        {variable && variable.value ? variable.value : `{{${varName}}}`}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function TemplateEditorPreview() {
  const { templates, selectedTemplateId, updateTemplate } = useTemplateStore();
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  if (!selectedTemplate) {
    return <div className="flex items-center justify-center h-full text-slate-400">Selecione um template</div>;
  }

  const handleChange = (value: string) => {
    const newVars = extractVariables(value, selectedTemplate.variables || []);
    updateTemplate({ ...selectedTemplate, content: value, variables: newVars });
  };

  return (
    <div className="p-6 h-full flex flex-col gap-4">
      <h2 className="text-xl font-bold mb-2">{selectedTemplate.name}</h2>
      <Textarea
        className="font-mono min-h-[180px] resize-vertical"
        value={selectedTemplate.content}
        onChange={e => handleChange(e.target.value)}
        placeholder="Digite o texto do template, use {{variavel}} para variáveis"
      />
      <div>
        <div className="text-sm text-slate-500 mb-1">Preview:</div>
        <div className="template-preview text-base whitespace-pre-wrap leading-relaxed">
          {highlightVariables(selectedTemplate.content, selectedTemplate.variables || [])}
        </div>
      </div>
    </div>
  );
} 