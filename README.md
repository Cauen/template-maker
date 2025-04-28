Prompt:

Quero que crie um software simples usando Shadcn ui para criar templates

O problema:

De vez em quando preciso criar templates para prompts do Chat GPT
Os prompts sempre tem uma parte variável e partes que são fixas:

Exemplo de template:

ChatGTP, quero que você crie uma história em quadrinho da temática: {{tematica}}
Ele deve se passar no ano de {{ano}}

---

Quero que a aplicação possa criar vários "Templates" do lado esquerdo.
Quando um template é criado, é possível dar um nome para ele no topo do lado direito.
Do lado direito devem ter duas abas "Builder" e "Preview".
No builder, deve ser possível adicionar o template, que deve ser um texto com várias variáveis no formato de {{}}
No "Preview" cada variável deve exibir um textarea... Na parte inferior todas as textareas deve mostrar o "Rendered text" com o texto gerado.

Use shadcnui