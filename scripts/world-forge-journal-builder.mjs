/**
 * World Forge Journal Builder
 * Converts World Forge entities into Foundry Journal Entry data objects.
 * Supports Campaign Codex integration: characters → NPC, locations → Location,
 * civilizations/factions → Region. Other types become plain journals.
 */

// =========================================================================
// HTML Helpers (same style as journal-builder.mjs)
// =========================================================================

function escapeHtml(text) {
  if (text == null || typeof text !== "string") return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function infoRow(label, value) {
  if (!value) return "";
  return `<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">`
    + `<strong>${escapeHtml(label)}</strong>`
    + `<span>${escapeHtml(String(value))}</span>`
    + `</div>`;
}

function sectionHeader(title) {
  return `<h3 style="margin-top: 1rem; border-bottom: 1px solid #0000003b; padding-bottom: 0.5rem;">${title}</h3>`;
}

function infoBox(title, rows) {
  const content = rows.filter(Boolean).join("\n");
  if (!content) return "";
  return `<div style="background: #0000001a; padding: 1rem; border-radius: 5px; border: 1px solid #0000003b;">`
    + `<h3 style="margin-top: 0; border-bottom: 1px solid #0000003b; padding-bottom: 0.5rem;">${escapeHtml(title)}</h3>`
    + content
    + `</div>`;
}

function fieldP(label, value) {
  if (!value) return "";
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(value))}</p>`;
}

function wikiLayout(mainContent, sidebarContent) {
  return `<div style="display: flex; flex-wrap: wrap; gap: 2rem;">`
    + `<div style="flex: 2; min-width: 250px;">${mainContent}</div>`
    + `<div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 1rem;">${sidebarContent}</div>`
    + `</div>`;
}

// FontAwesome icon map for section headers
const FA_ICONS = {
  Description: 'fa-scroll', Appearance: 'fa-user', Personality: 'fa-masks-theater',
  Motivations: 'fa-bullseye', History: 'fa-book-open', NotableFeatures: 'fa-star',
  Culture: 'fa-landmark', Religion: 'fa-place-of-worship', Economy: 'fa-coins',
  Territory: 'fa-map', Customs: 'fa-masks-theater', Goals: 'fa-bullseye',
  Resources: 'fa-shield', Effects: 'fa-wand-sparkles', Domains: 'fa-sun',
  Clergy: 'fa-church', Dogma: 'fa-scroll', Consequences: 'fa-bolt',
  Objectives: 'fa-list-check', Rewards: 'fa-trophy', Complications: 'fa-triangle-exclamation',
  Events: 'fa-calendar', Loot: 'fa-gem', Content: 'fa-feather',
  NextSession: 'fa-forward', Origin: 'fa-compass',
};

function longField(label, value, iconKey) {
  if (!value) return "";
  const icon = iconKey && FA_ICONS[iconKey] ? `<i class="fas ${FA_ICONS[iconKey]}"></i> ` : "";
  return sectionHeader(icon + escapeHtml(label)) + `<p>${escapeHtml(value)}</p>`;
}

function secretBlock(label, value) {
  if (!value) return "";
  return `<div style="background: rgba(183,28,28,0.05); padding: 1rem; border-radius: 5px; border: 1px solid rgba(183,28,28,0.2);">`
    + `<h3 style="margin-top: 0; color: #B71C1C; border-bottom: 1px solid rgba(183,28,28,0.2); padding-bottom: 0.5rem;">${escapeHtml(label)}</h3>`
    + `<p>${escapeHtml(value)}</p>`
    + `</div>`;
}

// =========================================================================
// Campaign Codex helpers
// =========================================================================

function isCodexActive() {
  return game.modules.get("campaign-codex")?.active
    && game.settings.get("lore-forge", "campaignCodexIntegration");
}

/**
 * Map World Forge entity types to Campaign Codex types and sheet classes.
 * Types without a direct CC match return null (will be plain journals).
 */
const CC_TYPE_MAP = {
  characters:    { ccType: "npc",      sheetClass: "campaign-codex.NPCSheet" },
  locations:     { ccType: "location", sheetClass: "campaign-codex.LocationSheet" },
  civilizations: { ccType: "region",   sheetClass: "campaign-codex.RegionSheet" },
  factions:      { ccType: "region",   sheetClass: "campaign-codex.RegionSheet" },
  events:        { ccType: "shop",     sheetClass: "campaign-codex.ShopSheet" },
};

// =========================================================================
// Relations Section
// =========================================================================

function buildRelationsSection(entity, allRelations, nameMap) {
  const rels = allRelations.filter(r => r.source_id === entity.id);
  if (!rels.length) return "";

  const cards = rels.map(r => {
    const targetName = escapeHtml(nameMap?.[r.target_id] || r.target_id);
    const relType = escapeHtml(r.relation_type || "\u2014");
    const desc = r.description ? `<p style="margin: 0.3rem 0 0; font-size: 0.85em; opacity: 0.8;">${escapeHtml(r.description)}</p>` : "";
    return `<div style="background: #0000000d; border: 1px solid #0000001a; border-radius: 5px; padding: 0.75rem; flex: 1; min-width: 200px;">`
      + `<strong>${targetName}</strong>`
      + ` <span style="opacity: 0.7; font-size: 0.85em;">(${relType})</span>`
      + desc
      + `</div>`;
  });

  return sectionHeader(`<i class="fas fa-link"></i> ${game.i18n.localize("LORE_FORGE.WorldForge.Relations")}`)
    + `<div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">${cards.join("")}</div>`;
}

// =========================================================================
// Per-type builders
// Each returns { html, notes } where notes = GM-only content for CC
// =========================================================================

function buildCharacter(e, allRelations, nameMap) {
  const i = (k) => game.i18n.localize(k);

  // Portrait placeholder for CC sidebar
  const portrait = `<figure style="margin: 0;">`
    + `<img src="modules/campaign-codex/ui/group.webp" alt="${escapeHtml(e.name)}" style="display: block; width: 100%; object-fit: cover; border-radius: 3px;">`
    + `</figure>`;

  const sidebar = [
    portrait,
    infoBox(i("LORE_FORGE.WorldForge.Info"), [
      infoRow(i("LORE_FORGE.WorldForge.Fields.Race"), e.race),
      infoRow(i("LORE_FORGE.WorldForge.Fields.ClassRole"), e.class_role),
      infoRow(i("LORE_FORGE.WorldForge.Fields.Alignment"), e.alignment),
      infoRow(i("LORE_FORGE.WorldForge.Fields.Background"), e.background),
    ]),
  ].filter(Boolean).join("\n");

  // Badge line: race + class + alignment
  const badges = [e.race, e.class_role, e.alignment].filter(Boolean);
  const badgeLine = badges.length
    ? `<p style="opacity: 0.7; font-style: italic; margin: 0 0 1rem;">${badges.map(escapeHtml).join(' &bull; ')}</p>`
    : "";

  const main = [
    `<h1 style="font-size: 1.5em; margin-bottom: 0.25rem;">${escapeHtml(e.name)}</h1>`,
    badgeLine,
    longField(i("LORE_FORGE.WorldForge.Fields.Description"), e.description, "Description"),
    longField(i("LORE_FORGE.WorldForge.Fields.Appearance"), e.appearance, "Appearance"),
    longField(i("LORE_FORGE.WorldForge.Fields.Personality"), e.personality, "Personality"),
    buildRelationsSection(e, allRelations, nameMap),
  ].filter(Boolean).join("\n");

  const html = wikiLayout(main, sidebar);

  // GM notes: motivations + extra content
  const notesParts = [
    fieldP(i("LORE_FORGE.WorldForge.Fields.Motivations"), e.motivations),
    fieldP(i("LORE_FORGE.WorldForge.Fields.Content"), e.content),
  ].filter(Boolean).join("\n");

  return { html, notes: notesParts };
}

function buildLocation(e, allRelations, nameMap) {
  const i = (k) => game.i18n.localize(k);

  const sidebar = infoBox(i("LORE_FORGE.WorldForge.Info"), [
    infoRow(i("LORE_FORGE.WorldForge.Fields.LocationType"), e.location_type),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Region"), e.region),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Climate"), e.climate),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Population"), e.population),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Government"), e.government),
  ]);

  const badges = [e.location_type, e.region].filter(Boolean);
  const badgeLine = badges.length
    ? `<p style="opacity: 0.7; font-style: italic; margin: 0 0 1rem;">${badges.map(escapeHtml).join(' &bull; ')}</p>`
    : "";

  const main = [
    `<h1 style="font-size: 1.5em; margin-bottom: 0.25rem;">${escapeHtml(e.name)}</h1>`,
    badgeLine,
    longField(i("LORE_FORGE.WorldForge.Fields.Description"), e.description, "Description"),
    longField(i("LORE_FORGE.WorldForge.Fields.NotableFeatures"), e.notable_features, "NotableFeatures"),
    longField(i("LORE_FORGE.WorldForge.Fields.History"), e.history, "History"),
    buildRelationsSection(e, allRelations, nameMap),
  ].filter(Boolean).join("\n");

  const html = wikiLayout(main, sidebar);
  const notesParts = [fieldP(i("LORE_FORGE.WorldForge.Fields.Content"), e.content)].filter(Boolean).join("\n");

  return { html, notes: notesParts };
}

function buildCivilization(e, allRelations, nameMap) {
  const i = (k) => game.i18n.localize(k);

  const sidebar = infoBox(i("LORE_FORGE.WorldForge.Info"), [
    infoRow(i("LORE_FORGE.WorldForge.Fields.Government"), e.government),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Territory"), e.territory),
  ]);

  const main = [
    `<h1 style="font-size: 1.5em; margin-bottom: 0.5rem;">${escapeHtml(e.name)}</h1>`,
    longField(i("LORE_FORGE.WorldForge.Fields.Description"), e.description, "Description"),
    longField(i("LORE_FORGE.WorldForge.Fields.Culture"), e.culture, "Culture"),
    longField(i("LORE_FORGE.WorldForge.Fields.Religion"), e.religion, "Religion"),
    longField(i("LORE_FORGE.WorldForge.Fields.Economy"), e.economy, "Economy"),
    longField(i("LORE_FORGE.WorldForge.Fields.History"), e.history, "History"),
    longField(i("LORE_FORGE.WorldForge.Fields.Customs"), e.customs, "Customs"),
    buildRelationsSection(e, allRelations, nameMap),
  ].filter(Boolean).join("\n");

  const html = wikiLayout(main, sidebar);
  const notesParts = [fieldP(i("LORE_FORGE.WorldForge.Fields.Content"), e.content)].filter(Boolean).join("\n");

  return { html, notes: notesParts };
}

function buildFaction(e, allRelations, nameMap) {
  const i = (k) => game.i18n.localize(k);

  const sidebar = infoBox(i("LORE_FORGE.WorldForge.Info"), [
    infoRow(i("LORE_FORGE.WorldForge.Fields.FactionType"), e.faction_type),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Leader"), e.leader),
  ]);

  const main = [
    `<h1 style="font-size: 1.5em; margin-bottom: 0.5rem;">${escapeHtml(e.name)}</h1>`,
    longField(i("LORE_FORGE.WorldForge.Fields.Description"), e.description, "Description"),
    longField(i("LORE_FORGE.WorldForge.Fields.Goals"), e.goals, "Goals"),
    longField(i("LORE_FORGE.WorldForge.Fields.Resources"), e.resources, "Resources"),
    buildRelationsSection(e, allRelations, nameMap),
  ].filter(Boolean).join("\n");

  const html = wikiLayout(main, sidebar);
  const notesParts = [fieldP(i("LORE_FORGE.WorldForge.Fields.Content"), e.content)].filter(Boolean).join("\n");

  return { html, notes: notesParts };
}

function buildItem(e, allRelations, nameMap) {
  const i = (k) => game.i18n.localize(k);

  const sidebar = infoBox(i("LORE_FORGE.WorldForge.Info"), [
    infoRow(i("LORE_FORGE.WorldForge.Fields.ItemType"), e.item_type),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Rarity"), e.rarity),
  ]);

  const main = [
    `<h1 style="font-size: 1.5em; margin-bottom: 0.5rem;">${escapeHtml(e.name)}</h1>`,
    longField(i("LORE_FORGE.WorldForge.Fields.Description"), e.description, "Description"),
    longField(i("LORE_FORGE.WorldForge.Fields.Effects"), e.effects, "Effects"),
    longField(i("LORE_FORGE.WorldForge.Fields.Origin"), e.origin, "Origin"),
    longField(i("LORE_FORGE.WorldForge.Fields.History"), e.history, "History"),
    longField(i("LORE_FORGE.WorldForge.Fields.Content"), e.content, "Content"),
    buildRelationsSection(e, allRelations, nameMap),
  ].filter(Boolean).join("\n");

  return { html: wikiLayout(main, sidebar), notes: "" };
}

function buildDeity(e, allRelations, nameMap) {
  const i = (k) => game.i18n.localize(k);

  const sidebar = infoBox(i("LORE_FORGE.WorldForge.Info"), [
    infoRow(i("LORE_FORGE.WorldForge.Fields.Symbol"), e.symbol),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Alignment"), e.alignment),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Worshippers"), e.worshippers),
  ]);

  const main = [
    `<h1 style="font-size: 1.5em; margin-bottom: 0.5rem;">${escapeHtml(e.name)}</h1>`,
    longField(i("LORE_FORGE.WorldForge.Fields.Description"), e.description, "Description"),
    longField(i("LORE_FORGE.WorldForge.Fields.Domains"), e.domains, "Domains"),
    longField(i("LORE_FORGE.WorldForge.Fields.Clergy"), e.clergy, "Clergy"),
    longField(i("LORE_FORGE.WorldForge.Fields.Dogma"), e.dogma, "Dogma"),
    longField(i("LORE_FORGE.WorldForge.Fields.History"), e.history, "History"),
    longField(i("LORE_FORGE.WorldForge.Fields.Content"), e.content, "Content"),
    buildRelationsSection(e, allRelations, nameMap),
  ].filter(Boolean).join("\n");

  return { html: wikiLayout(main, sidebar), notes: "" };
}

function buildEvent(e, allRelations, nameMap) {
  const i = (k) => game.i18n.localize(k);

  const sidebar = infoBox(i("LORE_FORGE.WorldForge.Info"), [
    infoRow(i("LORE_FORGE.WorldForge.Fields.EventType"), e.event_type),
    infoRow(i("LORE_FORGE.WorldForge.Fields.DateEra"), e.date_era),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Order"), e.order != null ? String(e.order) : null),
  ]);

  const main = [
    `<h1 style="font-size: 1.5em; margin-bottom: 0.5rem;">${escapeHtml(e.name)}</h1>`,
    longField(i("LORE_FORGE.WorldForge.Fields.Description"), e.description, "Description"),
    longField(i("LORE_FORGE.WorldForge.Fields.Consequences"), e.consequences, "Consequences"),
    longField(i("LORE_FORGE.WorldForge.Fields.History"), e.history, "History"),
    buildRelationsSection(e, allRelations, nameMap),
  ].filter(Boolean).join("\n");

  const html = wikiLayout(main, sidebar);
  const notesParts = [fieldP(i("LORE_FORGE.WorldForge.Fields.Content"), e.content)].filter(Boolean).join("\n");

  return { html, notes: notesParts };
}

function buildQuest(e, allRelations, nameMap) {
  const i = (k) => game.i18n.localize(k);

  const sidebar = infoBox(i("LORE_FORGE.WorldForge.Info"), [
    infoRow(i("LORE_FORGE.WorldForge.Fields.QuestStatus"), e.quest_status),
    infoRow(i("LORE_FORGE.WorldForge.Fields.QuestGiver"), e.quest_giver),
  ]);

  const main = [
    `<h1 style="font-size: 1.5em; margin-bottom: 0.5rem;">${escapeHtml(e.name)}</h1>`,
    longField(i("LORE_FORGE.WorldForge.Fields.Description"), e.description, "Description"),
    longField(i("LORE_FORGE.WorldForge.Fields.Objectives"), e.objectives, "Objectives"),
    longField(i("LORE_FORGE.WorldForge.Fields.Rewards"), e.rewards, "Rewards"),
    buildRelationsSection(e, allRelations, nameMap),
  ].filter(Boolean).join("\n");

  const notesParts = [
    fieldP(i("LORE_FORGE.WorldForge.Fields.Complications"), e.complications),
    fieldP(i("LORE_FORGE.WorldForge.Fields.Content"), e.content),
  ].filter(Boolean).join("\n");

  return { html: wikiLayout(main, sidebar), notes: notesParts };
}

function buildSession(e, allRelations, nameMap) {
  const i = (k) => game.i18n.localize(k);

  const sidebar = infoBox(i("LORE_FORGE.WorldForge.Info"), [
    infoRow(i("LORE_FORGE.WorldForge.Fields.SessionNumber"), e.session_number != null ? String(e.session_number) : null),
    infoRow(i("LORE_FORGE.WorldForge.Fields.SessionDate"), e.session_date),
  ]);

  const main = [
    `<h1 style="font-size: 1.5em; margin-bottom: 0.5rem;">${escapeHtml(e.name)}</h1>`,
    longField(i("LORE_FORGE.WorldForge.Fields.Description"), e.description, "Description"),
    longField(i("LORE_FORGE.WorldForge.Fields.Events"), e.events, "Events"),
    longField(i("LORE_FORGE.WorldForge.Fields.Loot"), e.loot, "Loot"),
    longField(i("LORE_FORGE.WorldForge.Fields.NextSession"), e.next_session, "NextSession"),
    longField(i("LORE_FORGE.WorldForge.Fields.Content"), e.content, "Content"),
    buildRelationsSection(e, allRelations, nameMap),
  ].filter(Boolean).join("\n");

  return { html: wikiLayout(main, sidebar), notes: "" };
}

function buildStory(e, allRelations, nameMap) {
  const i = (k) => game.i18n.localize(k);

  const sidebar = infoBox(i("LORE_FORGE.WorldForge.Info"), [
    infoRow(i("LORE_FORGE.WorldForge.Fields.StoryType"), e.story_type),
    infoRow(i("LORE_FORGE.WorldForge.Fields.Status"), e.status),
  ]);

  const main = [
    `<h1 style="font-size: 1.5em; margin-bottom: 0.5rem;">${escapeHtml(e.name)}</h1>`,
    longField(i("LORE_FORGE.WorldForge.Fields.Description"), e.description, "Description"),
    longField(i("LORE_FORGE.WorldForge.Fields.Content"), e.content, "Content"),
    buildRelationsSection(e, allRelations, nameMap),
  ].filter(Boolean).join("\n");

  return { html: wikiLayout(main, sidebar), notes: "" };
}

// =========================================================================
// Dispatch table
// =========================================================================

const TYPE_BUILDERS = {
  characters: buildCharacter,
  locations: buildLocation,
  civilizations: buildCivilization,
  factions: buildFaction,
  items: buildItem,
  deities: buildDeity,
  events: buildEvent,
  quests: buildQuest,
  sessions: buildSession,
  stories: buildStory,
};

// =========================================================================
// Name map builder (resolve target_id → name for relations display)
// =========================================================================

/**
 * Build a flat id→name lookup from the entire World Forge entities payload.
 * @param {Object} entitiesPayload — the "entities" object from the export JSON
 * @returns {Object} map of entity id → entity name
 */
export function buildNameMap(entitiesPayload) {
  const map = {};
  for (const list of Object.values(entitiesPayload)) {
    for (const e of list) {
      if (e.id && e.name) map[e.id] = e.name;
    }
  }
  return map;
}

// =========================================================================
// Main export
// =========================================================================

/**
 * Build a Foundry JournalEntry data object from a World Forge entity.
 * When Campaign Codex is active and the type is supported, the entry will use
 * CC flags + sheet class for rich display (NPC / Location / Region sheets).
 *
 * @param {Object} entity       — entity object from the World Forge JSON
 * @param {string} type         — plural type key (e.g. "characters")
 * @param {Array}  allRelations — full relations array from the World Forge JSON
 * @param {Object} nameMap      — id→name lookup (from buildNameMap)
 * @returns {Object} data suitable for JournalEntry.create()
 */
export function buildWorldForgeJournal(entity, type, allRelations, nameMap) {
  const builder = TYPE_BUILDERS[type] ?? buildStory;
  const { html, notes } = builder(entity, allRelations, nameMap);

  // Base flags
  const flags = {
    "lore-forge": {
      type: "world-forge-import",
      entityType: type,
      entityId: entity.id,
    },
  };

  // Campaign Codex integration — always set CC flags when type is supported.
  // If CC is not active the flags are harmless; if it is, the journal opens
  // with the correct CC sheet (NPC / Location / Region).
  let finalHtml = html;
  const ccMapping = CC_TYPE_MAP[type];
  if (ccMapping) {
    flags["campaign-codex"] = {
      type: ccMapping.ccType,
      data: {
        description: html,
        notes: notes || "",
      },
    };
    flags.core = { sheetClass: ccMapping.sheetClass };
  } else if (notes) {
    // No CC sheet for this type — append GM notes as a secret-style block
    finalHtml = html + `<div style="background: rgba(183,28,28,0.05); padding: 1rem; border-radius: 5px; border: 1px solid rgba(183,28,28,0.2); margin-top: 1rem;">`
      + `<h3 style="margin-top: 0; color: #B71C1C; border-bottom: 1px solid rgba(183,28,28,0.2); padding-bottom: 0.5rem;">`
      + `<i class="fas fa-eye-slash"></i> ${game.i18n.localize("LORE_FORGE.WorldForge.GMNotes")}</h3>`
      + notes
      + `</div>`;
  }

  return {
    name: entity.name || "Unnamed",
    pages: [{
      name: entity.name || "Unnamed",
      type: "text",
      text: { content: finalHtml, format: 1 },
    }],
    flags,
  };
}
