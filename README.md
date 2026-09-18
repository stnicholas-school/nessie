# Nessie — Acessibilidade para Google Docs

Painel lateral para Google Docs que adapta textos para diferentes níveis de leitura e necessidades de apoio (TEA, TDAH, dislexia), com IA (Gemini) e ferramentas locais.

## Começar a usar

1. Faça uma cópia do documento modelo (**Arquivo → Fazer uma cópia**).
2. Abra a cópia e use o menu **Nessie → Configurações**. Autorize o script na primeira vez.
3. Cole sua chave gratuita da API Gemini, obtida em https://aistudio.google.com/apikey, e clique em **Salvar**.
4. Abra **Nessie → Abrir painel**, selecione um trecho do texto e escolha uma adaptação.

Os apoios tipográficos (pontuação, termos de comando, layout TDAH, estilo dislexia) e o leitor de áudio funcionam sem chave.

## Privacidade

- A chave é salva nas *UserProperties* da sua conta Google. Ela não é copiada junto com o documento e não fica visível para outros editores.
- O texto selecionado é enviado à API Gemini apenas quando você usa uma adaptação com IA.
- Permissões pedidas: editar **somente o documento atual**, exibir o painel e acessar serviços externos (API Gemini).

## Personalização

| Arquivo | O que controla |
|---|---|
| `config.js` | Nome, cores, logo, créditos, modelo Gemini e limites |
| `prompts.js` | Instruções enviadas à IA e presets tipográficos |
| `commands.js` | Termos de comando e definições (pt, en, es) |
| `i18n.js` | Textos da interface (pt, en, es) |

O idioma padrão é português (`LOCALES.DEFAULT` em `config.js`). A resposta da IA sempre sai no idioma do texto selecionado.

## Estrutura

```
appsscript.json  Manifesto (escopos mínimos)
Code.js          Menu, painel e despachante das ações
settings.js      Configurações por usuário (chave, idioma)
gemini.js        Chamada à API, descoberta de modelos, detecção de idioma
engine.js        Formatação local e inserção do resultado no documento
config.js        Constantes do app
prompts.js       Prompts da IA
commands.js      Dicionário de termos de comando
i18n.js          Traduções
logging.js       Log padronizado
Index.html       Painel lateral
Settings.html    Diálogo de configurações
```

## Desenvolvimento com clasp

Crie seu próprio `.clasp.json` apontando para o seu `scriptId` (não versione esse arquivo) e rode `clasp push`.
