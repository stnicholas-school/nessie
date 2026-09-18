# Publicar o Nessie internamente na sua escola

Este guia descreve como publicar o Nessie como add-on do Google Workspace para uma escola inteira, com uma única chave da API Gemini mantida pela equipe de TI. Os professores instalam o add-on e usam a ferramenta sem precisar criar chave nenhuma.

Se você só quer experimentar o Nessie, não precisa de nada disto: basta fazer uma cópia do documento modelo e colar sua chave em Configurações.

## Qual formato escolher

| | Cópia do documento | Add-on interno |
|---|---|---|
| Quem fornece a chave | Cada professor, a sua | A escola, uma só |
| Instalação | Fazer uma cópia do documento | Instalado pelo administrador para o domínio |
| Onde funciona | Só nas cópias daquele documento | Em qualquer documento do professor |
| Atualização do código | Cada cópia precisa ser refeita | Uma versão nova atinge todo mundo |
| Quem mantém | O próprio professor | Equipe de TI |
| Requer projeto no Google Cloud | Não | Sim |

O formato de cópia continua sendo o recomendado para divulgação pública. O add-on interno faz sentido quando a escola quer padronizar a ferramenta, evitar que cada professor crie uma chave e controlar as atualizações.

**Nunca publique uma instância com chave compartilhada em modo público no Marketplace.** Qualquer pessoa que a instalasse passaria a consumir, e a esgotar, a cota da sua escola.

## Antes de começar

Você vai precisar de:

- Uma conta com privilégio de administrador do Google Workspace.
- Permissão para criar um projeto no Google Cloud dentro da organização.
- Cerca de uma hora para a primeira publicação.
- De preferência, faturamento ativo no projeto do Cloud. A camada gratuita da API Gemini tem limites por minuto e por dia que valem para a chave inteira, e não por professor.

---

## Passo 1. Criar a chave da escola

1. Acesse https://aistudio.google.com/apikey e crie a chave dentro de um projeto do Google Cloud da organização, e não em um projeto pessoal.
2. No Google Cloud, abra APIs e serviços → Credenciais, localize a chave e restrinja-a: em "Restrições de API", deixe apenas a **Generative Language API**. Restrição por endereço IP ou por referenciador não se aplica ao Apps Script.
3. Anote quem tem acesso a essa chave. Trate-a como uma senha institucional.

Se a escola já usa Google Cloud, vale criar um projeto dedicado, por exemplo `nessie-escola`, para isolar cota e faturamento.

## Passo 2. Preparar o projeto do Apps Script

1. Crie um projeto novo no Apps Script (ou duplique o seu projeto interno) e adicione todos os arquivos do Nessie.
2. Em `config.js`, ligue a chave compartilhada:

   ```javascript
   SHARED_KEY_ENABLED: true,
   ```

   Este é o único arquivo que muda em relação à versão pública. Mantenha `false` em qualquer projeto que você distribua para cópia.

3. Em Configurações do projeto → Propriedades do script, crie a propriedade:

   | Propriedade | Valor |
   |---|---|
   | `NESSIE_SHARED_API_KEY` | a chave criada no passo 1 |

   Não coloque a chave em nenhum arquivo `.js`, para que ela nunca entre no controle de versão.

4. No editor, execute a função `checkSharedApiKey()` uma vez. Ela deve responder `Teste de conexão: OK` e mostrar a chave mascarada. Se responder `(vazia)`, a propriedade foi salva no lugar errado.

A chave pessoal de um professor, quando existe, tem prioridade sobre a da escola. Assim, quem já usava o Nessie com chave própria continua na sua cota, e quem não tem chave passa a usar a da escola sem configurar nada.

## Passo 3. Vincular um projeto do Google Cloud

O Marketplace exige um projeto padrão do Cloud. O projeto criado automaticamente pelo Apps Script não serve.

1. No Google Cloud, escolha o projeto da escola e copie o número do projeto (não o ID).
2. No Apps Script, em Configurações do projeto → Projeto do Google Cloud, clique em Alterar projeto e cole o número.
3. No Cloud, abra APIs e serviços → Biblioteca e ative a **Google Workspace Marketplace SDK**.
4. Em APIs e serviços → Tela de permissão OAuth, configure o app como **Interno**. Preencha nome do app, e-mail de suporte e e-mail do desenvolvedor.

Com a tela de permissão marcada como Interna, só contas do seu domínio conseguem autorizar o add-on.

## Passo 4. Implantar a versão

1. No Apps Script, clique em Implantar → Nova implantação.
2. Em tipo, escolha **Complemento do editor** (Editor Add-on).
3. Dê uma descrição, por exemplo `Nessie 2.1.0`, e implante.
4. Copie o ID do script, em Configurações do projeto, e anote o número da versão que acabou de ser criada.

Toda alteração no código exige uma implantação nova e a atualização do número da versão no passo seguinte. Sem isso, os professores continuam com o código antigo.

## Passo 5. Configurar o Marketplace SDK

No Google Cloud, abra APIs e serviços → Google Workspace Marketplace SDK.

**Na aba Configuração do app:**

- Visibilidade do app: **Particular**, restrita ao seu domínio.
- Configuração de instalação: **Instalação pelo administrador**, se você quer disponibilizar para todos, ou **Instalação individual**, se prefere que cada professor decida.
- Em Integrações, marque **Complemento de Documentos** e informe o ID do script e o número da versão do passo 4.
- Em Escopos OAuth, liste exatamente os três escopos do `appsscript.json`:

  ```
  https://www.googleapis.com/auth/documents.currentonly
  https://www.googleapis.com/auth/script.container.ui
  https://www.googleapis.com/auth/script.external_request
  ```

  Qualquer diferença entre esta lista e o manifesto faz a instalação falhar.

**Na aba Listagem da loja**, mesmo sendo particular, preencha nome, descrição curta, descrição completa, categoria, idioma, um ícone de 128 por 128 pixels, pelo menos uma captura de tela e os links de suporte, termos e privacidade. Um documento interno do Google Docs publicado na web serve como link de política de privacidade.

Para o ícone, exporte o logo do Nessie: o SVG está em `Index.html`, no cabeçalho do painel, e pode ser convertido para PNG em qualquer editor de imagem.

Clique em Publicar. Por ser um app interno, não há revisão do Google, e a publicação é imediata.

## Passo 6. Instalar para a escola

Se você escolheu instalação pelo administrador:

1. No Admin Console, vá em Aplicativos → Google Workspace Marketplace → Apps do Marketplace.
2. Clique em Adicionar app → Apps internos e selecione o Nessie.
3. Escolha instalar para toda a organização ou apenas para unidades organizacionais específicas, por exemplo a unidade dos professores.
4. Aceite as permissões em nome do domínio.

Peça aos professores que recarreguem qualquer documento aberto. O menu Nessie aparece na barra de menus e o painel já funciona, sem pedir chave.

---

## Depois da publicação

**Trocar a chave.** Edite a propriedade `NESSIE_SHARED_API_KEY` e rode `checkSharedApiKey()`. Não é preciso implantar nova versão nem reinstalar nada.

**Atualizar o código.** Implante uma versão nova no Apps Script e atualize o número da versão no Marketplace SDK. Os professores recebem a atualização na próxima vez que abrirem um documento.

**Acompanhar o uso.** No Google Cloud, em APIs e serviços → Painel, a Generative Language API mostra o volume de requisições e os erros. É o lugar para conferir se a cota está apertada.

**Revogar o acesso.** Para desligar tudo de uma vez, rode `clearSharedApiKey()` ou apague a chave no Cloud. O add-on continua instalado, e os recursos que não usam IA, como realçar pontuação e leitor de áudio, continuam funcionando.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| A instalação falha com erro de escopos | A lista de escopos no Marketplace SDK não bate com o `appsscript.json`. |
| O menu Nessie não aparece | O documento precisa ser recarregado depois da instalação. |
| O painel pede a chave mesmo com a propriedade criada | `SHARED_KEY_ENABLED` continua `false`, ou a propriedade foi salva em outro projeto. Rode `checkSharedApiKey()` para confirmar. |
| "Limite de uso da API atingido" em horário de aula | A cota gratuita é compartilhada por toda a escola. Ative o faturamento no projeto do Cloud. |
| Professores veem o menu em português mesmo com outra preferência | O menu é montado antes da autorização, e nesse momento o idioma padrão é usado. Ele se ajusta ao recarregar o documento. |
| O código novo não chega aos professores | Faltou atualizar o número da versão no Marketplace SDK depois da implantação. |

## Lista de verificação de segurança

- [ ] A chave está apenas em Propriedades do script, nunca em um arquivo do repositório.
- [ ] A chave está restrita à Generative Language API.
- [ ] A visibilidade do app no Marketplace é particular, restrita ao domínio.
- [ ] A tela de permissão OAuth está marcada como Interna.
- [ ] O acesso de edição ao projeto do Apps Script está limitado à equipe de TI, já que quem edita o projeto consegue ler a chave.
- [ ] O projeto que você distribui publicamente, para cópia, está com `SHARED_KEY_ENABLED: false` e sem a propriedade da chave.
