import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { faker } from '@faker-js/faker';

interface Variable {
  name: string;
  value: string;
}

interface Template {
  id: string;
  name: string;
  content: string;
  variables?: Variable[];
}

interface TemplateStore {
  templates: Template[];
  selectedTemplateId: string | null;
  addTemplate: () => void;
  updateTemplate: (template: Template) => void;
  deleteTemplate: (id: string) => void;
  selectTemplate: (id: string) => void;
}

export const useTemplateStore = create<TemplateStore>()(
  persist(
    (set) => ({
      templates: [],
      selectedTemplateId: null,
      addTemplate: () => {
        const word = faker.animal.type() || faker.word.noun();
        const newTemplate: Template = {
          id: Date.now().toString(),
          name: `Template ${word.charAt(0).toUpperCase() + word.slice(1)}`,
          content: "",
          variables: []
        };
        set((state) => ({
          templates: [...state.templates, newTemplate],
          selectedTemplateId: newTemplate.id
        }));
      },
      updateTemplate: (template) => {
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === template.id ? template : t
          ),
        }));
      },
      deleteTemplate: (id) => {
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
          selectedTemplateId:
            state.selectedTemplateId === id
              ? state.templates[0]?.id || null
              : state.selectedTemplateId,
        }));
      },
      selectTemplate: (id) => {
        set({ selectedTemplateId: id });
      },
    }),
    {
      name: 'template-storage',
    }
  )
); 