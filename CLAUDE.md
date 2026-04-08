# Lore Forge - Foundry VTT Module

Modulo para Foundry VTT v13 (D&D 5e) que oferece wizards guiados para criacao de lore de campanha e importacao de conteudo do World Forge. Gera Journal Entries formatados com integracao opcional ao Campaign Codex.

## Stack

- **Runtime:** Foundry VTT v13 (ES Modules)
- **Sistema:** D&D 5e 4.0+
- **UI Framework:** ApplicationV2 (foundry.applications.api)
- **Templates:** Handlebars (.hbs) para wizards, HTML inline para importer
- **Integracao opcional:** Campaign Codex (sheets: NPC, Location, Region, Entry/Shop)
- **Persistencia de rascunhos:** localStorage (chaves `lf-draft-*`)
- **Localizacao:** EN + PT-BR

## Estrutura do Projeto

```
lore-forge/
├── module.json                         # Manifest do modulo Foundry
├── CLAUDE.md                           # Este arquivo
├── scripts/
│   ├── main.mjs                        # Entry point: hooks, singletons, settings, template loading
│   ├── lore-forge-dialog.mjs           # Dialog de selecao (grid de cards: 4 wizards + World Forge Import)
│   ├── lore-forge-wizard.mjs           # Classe base dos wizards (ApplicationV2, steps, drafts, inspire)
│   ├── kingdom-wizard.mjs              # Wizard: Kingdoms / Regions (9 steps)
│   ├── character-wizard.mjs            # Wizard: Narrative Characters (9 steps)
│   ├── location-wizard.mjs             # Wizard: Locations (8 steps)
│   ├── settlement-wizard.mjs           # Wizard: Settlements (8 steps)
│   ├── journal-builder.mjs             # HTML builders para wizards → JournalEntry (CC flags)
│   ├── journal-query.mjs               # Busca e linking de journals existentes
│   ├── inspiration-engine.mjs          # Geracao de inspiracao aleatoria para campos dos wizards
│   ├── world-forge-importer.mjs        # ApplicationV2: importador World Forge (3 steps)
│   ├── world-forge-journal-builder.mjs # HTML builders World Forge → JournalEntry (CC flags)
│   └── data/                           # Tabelas de dados (listas de opcoes para wizards)
├── templates/
│   ├── kingdom/                        # 9 step templates HBS
│   ├── character/                      # 9 step templates HBS
│   ├── location/                       # 8 step templates HBS
│   └── settlement/                     # 8 step templates HBS
├── styles/
│   └── lore-forge.css                  # Estilos: wizards, dialog (3-col grid), World Forge importer
└── lang/
    ├── en.json                         # Ingles (~750 chaves)
    └── pt-br.json                      # Portugues BR (~750 chaves)
```

## Arquitetura

### Singletons (main.mjs)
Cada wizard e o importer usam pattern singleton com cleanup no close:
```js
let instance = null;
function openWizard() {
  if (!instance) {
    instance = new WizardClass();
    instance.addEventListener("close", () => { instance = null; });
  }
  instance.render(true);
}
```

### ApplicationV2 Pattern
Todos os wizards e o importer herdam de `ApplicationV2`:
- `_renderHTML()` retorna `{ wrapper }` (DOM element)
- `_replaceHTML()` faz `content.replaceChildren(result.wrapper)`
- Actions declaradas em `DEFAULT_OPTIONS.actions` com metodos estaticos `#onAction`
- Posicionamento e redimensionamento via `DEFAULT_OPTIONS.position`

### Wizard Base (lore-forge-wizard.mjs)
- Steps navegaveis (next/prev) com validacao
- Draft persistence em localStorage (auto-save a cada step)
- Botao "Inspire" que preenche campos vazios com conteudo aleatorio
- Reset com confirmacao
- Ao finalizar: chama `journal-builder.mjs` e cria JournalEntry

### Journal Builder (journal-builder.mjs)
Helpers compartilhados para gerar HTML formatado:
- `wikiLayout(main, sidebar)` — layout 2 colunas flex
- `infoBox(title, rows)` — caixa de info no sidebar
- `infoRow(label, value)` — linha key-value
- `fieldP(label, value)` — paragrafo com label bold
- `sectionHeader(title)` — h3 com borda inferior
- `secretBlock(label, value)` — bloco vermelho para segredos/GM notes
- `escapeHtml(text)` — sanitizacao via DOM

Campaign Codex flags por tipo:
```js
flags: {
  "campaign-codex": { type: "npc", data: { description: html, notes: gmNotes } },
  core: { sheetClass: "campaign-codex.NPCSheet" }
}
```

### World Forge Importer (world-forge-importer.mjs)
ApplicationV2 com 3 steps inline (sem HBS):
1. **File** — input file + validacao JSON (version 1.0) + preview com contagem
2. **Preview** — checkboxes por tipo, folder name, subfolders toggle, overwrite toggle
3. **Result** — progress bar, lista de resultados, notificacao

Logica de import:
- Tipos com mapeamento CC → coloca na pasta CC correspondente (ex: "Campaign Codex - NPCs")
- Tipos sem CC → cria subpastas dentro de folder raiz da campanha
- Overwrite: busca journal existente por `flags.lore-forge.entityId`
- `buildNameMap()` resolve IDs → nomes para exibir relacoes com nomes legíveis

### World Forge Journal Builder (world-forge-journal-builder.mjs)
Builders por tipo de entidade (10 tipos). Cada builder retorna `{ html, notes }`:
- `html` — conteudo principal (wiki layout com sidebar), titulo h1 estilizado, badge line para characters/locations
- `notes` — conteudo GM-only para Campaign Codex notes
- Icones FontAwesome nos section headers (fa-scroll, fa-book-open, fa-masks-theater, etc.) via mapa `FA_ICONS`
- Relacoes como mini-cards flexbox (ao inves de lista simples)
- `longField(label, value, iconKey)` aceita icone opcional
- `buildNameMap()` resolve IDs → nomes legíveis nas relacoes

Mapeamento CC (sempre aplicado, sem checar `isCodexActive()`):

| Tipo WF        | CC Type  | CC Sheet      |
|-----------------|----------|---------------|
| characters      | npc      | NPCSheet      |
| locations       | location | LocationSheet |
| civilizations   | region   | RegionSheet   |
| factions        | region   | RegionSheet   |
| events          | shop     | ShopSheet     |

Tipos sem CC (items, deities, sessions, quests, stories): journal padrao com GM notes como secretBlock inline.

## Settings (game.settings)

| Key                        | Type    | Default | Descricao                                      |
|----------------------------|---------|---------|-------------------------------------------------|
| campaignCodexIntegration   | Boolean | true    | Habilitar flags CC nos wizards                  |
| autoOpenJournal            | Boolean | true    | Abrir journal sidebar apos criar/importar       |
| journalFolder              | String  | ""      | Pasta padrao para journals dos wizards           |

## Hooks

- `init` — registra settings, carrega templates HBS
- `renderJournalDirectory` — adiciona botao "Lore Forge" no header do Journal sidebar
- `getSceneControlButtons` — adiciona botao no toolbar de scene controls (Notes)
- `ready` — notifica drafts pendentes

## Dialog Principal (lore-forge-dialog.mjs)

Grid 3 colunas com 5 cards:
1. Kingdom (fas fa-crown)
2. Character (fas fa-user-pen)
3. Location (fas fa-map-pin)
4. Settlement (fas fa-city)
5. World Forge Import (fas fa-file-import)

Badge de draft pendente em cards com rascunho salvo.

## Localizacao

Namespace: `LORE_FORGE.*`
- `LORE_FORGE.Dialog.*` — dialog principal
- `LORE_FORGE.Kingdom.*` / `Character.*` / `Location.*` / `Settlement.*` — wizards
- `LORE_FORGE.WorldForge.*` — importer + journal builder fields
- `LORE_FORGE.Settings.*` — configuracoes
- `LORE_FORGE.Nav.*` / `Notify.*` — navegacao e notificacoes

## Decisoes de Design

- **CC flags sempre setadas**: O importer World Forge sempre injeta flags de Campaign Codex para tipos suportados, sem checar `isCodexActive()`. Isso evita problemas de timing e as flags sao inofensivas se CC nao estiver instalado
- **Pastas CC para tipos mapeados**: Journals com CC type vao direto para as pastas do CC (ex: "Campaign Codex - NPCs"). Pasta da campanha so e criada para tipos sem CC, evitando pastas vazias
- **HTML inline no importer**: Os 3 steps do World Forge importer usam HTML gerado em `_renderHTML()` ao inves de templates HBS, simplificando o fluxo (sem pre-registro de templates)
- **nameMap para relacoes**: `buildNameMap()` cria lookup id→nome a partir de todas as entidades do JSON, permitindo exibir nomes legiveis nas relacoes ao inves de UUIDs
- **Dois builders separados**: `journal-builder.mjs` serve os wizards interativos, `world-forge-journal-builder.mjs` serve o importador. Ambos usam os mesmos helpers HTML mas com logica de dados diferente
- **Dialog expandido**: Grid mudou de 2x2 para 3 colunas (width 560px) para acomodar o 5o card do World Forge Import
