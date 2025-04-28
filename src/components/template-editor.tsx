"use client"
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useTemplateStore } from "@/store/template-store";

export function TemplateEditor() {
  const { templates, selectedTemplateId, updateTemplate } = useTemplateStore();
  const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

  const [templateName, setTemplateName] = useState(selectedTemplate?.name || "");
  const [templateContent, setTemplateContent] = useState(selectedTemplate?.content || "");
  const [variables, setVariables] = useState<{ name: string; value: string }[]>(selectedTemplate?.variables || []);

  useEffect(() => {
    if (selectedTemplate) {
      setTemplateName(selectedTemplate.name);
      setTemplateContent(selectedTemplate.content);
      setVariables(selectedTemplate.variables || []);
    }
  }, [selectedTemplate]);

  const extractVariables = (content: string) => {
    const regex = /{{([^}]+)}}/g;
    const matches = content.match(regex) || [];
    const uniqueVariables = [...new Set(matches.map(match => match.slice(2, -2)))];
    return uniqueVariables.map(name => ({
      name,
      value: variables.find(v => v.name === name)?.value || ""
    }));
  };

  const handleTemplateChange = (content: string) => {
    if (!selectedTemplate) return;
    
    setTemplateContent(content);
    const newVariables = extractVariables(content);
    setVariables(newVariables);
    updateTemplate({
      ...selectedTemplate,
      content,
      variables: newVariables
    });
    toast.success("Template saved");
  };

  const handleNameChange = (name: string) => {
    if (!selectedTemplate) return;
    
    setTemplateName(name);
    updateTemplate({
      ...selectedTemplate,
      name
    });
    toast.success("Template name saved");
  };

  const handleVariableChange = (name: string, value: string) => {
    if (!selectedTemplate) return;
    
    const newVariables = variables.map(v => 
      v.name === name ? { ...v, value } : v
    );
    setVariables(newVariables);
    updateTemplate({
      ...selectedTemplate,
      variables: newVariables
    });
  };

  const renderPreview = () => {
    let preview = templateContent;
    variables.forEach(variable => {
      preview = preview.replace(
        new RegExp(`{{${variable.name}}}`, "g"),
        variable.value || `{{${variable.name}}}`
      );
    });
    return preview;
  };

  if (!selectedTemplate) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">Select a template to edit</p>
      </div>
    );
  }

  return (
    <Card className="template-editor">
      <CardHeader>
        <CardTitle>
          <Input
            value={templateName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="text-2xl font-bold"
            placeholder="Template name"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="builder">
          <TabsList className="mb-4">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="builder">
            <div className="space-y-4">
              <div>
                <Label htmlFor="template">Template Content</Label>
                <Textarea
                  id="template"
                  value={templateContent}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="min-h-[200px]"
                  placeholder="Enter your template content with variables like {{variable}}"
                />
              </div>
              {variables.length > 0 && (
                <div>
                  <Label>Variables</Label>
                  <div className="space-y-2">
                    {variables.map((variable) => (
                      <div key={variable.name} className="template-variable">
                        <Label htmlFor={variable.name}>{variable.name}</Label>
                        <Input
                          id={variable.name}
                          value={variable.value}
                          onChange={(e) => handleVariableChange(variable.name, e.target.value)}
                          placeholder={`Enter value for ${variable.name}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="preview">
            <div className="template-preview">
              <pre>{renderPreview()}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 