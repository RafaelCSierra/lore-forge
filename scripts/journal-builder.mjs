/**
 * Journal Builder — Assembles formatted Journal Entries from wizard data.
 * Uses Campaign Codex Wiki-style layout: 2-column flex with sidebar info boxes.
 */

// =========================================================================
// Shared Helpers
// =========================================================================

/**
 * Escape HTML special characters to prevent injection.
 */
function escapeHtml(text) {
  if (text == null || typeof text !== "string") return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Check if Campaign Codex integration is active and enabled.
 */
function isCodexActive() {
  return game.modules.get("campaign-codex")?.active
    && game.settings.get("lore-forge", "campaignCodexIntegration");
}

/**
 * Get a localized label from a list of {value, label} entries.
 */
function getLabel(list, value) {
  const entry = list.find(e => e.value === value);
  return entry ? game.i18n.localize(entry.label) : value;
}

// =========================================================================
// CC Wiki-Style Layout Helpers
// =========================================================================

/**
 * Info box key-value row for sidebar.
 */
function infoRow(label, value) {
  if (!value) return "";
  return `<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">`
    + `<strong>${escapeHtml(label)}</strong>`
    + `<span>${escapeHtml(value)}</span>`
    + `</div>`;
}

/**
 * Section header with bottom border for main content.
 */
function sectionHeader(title) {
  return `<h3 style="margin-top: 1rem; border-bottom: 1px solid #0000003b; padding-bottom: 0.5rem;">${title}</h3>`;
}

/**
 * Info box wrapper for sidebar panels.
 */
function infoBox(title, rows) {
  const content = rows.filter(Boolean).join("\n");
  if (!content) return "";
  return `<div style="background: #0000001a; padding: 1rem; border-radius: 5px; border: 1px solid #0000003b;">`
    + `<h3 style="margin-top: 0; border-bottom: 1px solid #0000003b; padding-bottom: 0.5rem;">${escapeHtml(title)}</h3>`
    + content
    + `</div>`;
}

/**
 * Paragraph with bold label for main content.
 */
function fieldP(label, value) {
  if (!value) return "";
  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`;
}

/**
 * Two-column flex layout wrapper.
 */
function wikiLayout(mainContent, sidebarContent) {
  return `<div style="display: flex; flex-wrap: wrap; gap: 2rem;">`
    + `<div style="flex: 2; min-width: 250px;">${mainContent}</div>`
    + `<div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 1rem;">${sidebarContent}</div>`
    + `</div>`;
}

/**
 * Secret/danger block with red CC styling.
 */
function secretBlock(label, value) {
  if (!value) return "";
  return `<div style="background: rgba(183,28,28,0.05); padding: 1rem; border-radius: 5px; border: 1px solid rgba(183,28,28,0.2);">`
    + `<h3 style="margin-top: 0; color: #B71C1C; border-bottom: 1px solid rgba(183,28,28,0.2); padding-bottom: 0.5rem;">${escapeHtml(label)}</h3>`
    + `<p>${escapeHtml(value)}</p>`
    + `</div>`;
}

// =========================================================================
// Kingdom Journal
// =========================================================================

/**
 * Build a JournalEntry creation data object for a kingdom.
 * @param {object} data - The wizard's collected data
 * @param {object} lists - Reference lists for label resolution
 * @returns {object} Data suitable for JournalEntry.create()
 */
export function buildKingdomJournal(data, lists) {
  const i18n = (key) => game.i18n.localize(key);

  // --- Resolve labels ---
  const typeLabel = getLabel(lists.kingdomTypes, data.kingdomType);
  const terrainLabel = getLabel(lists.terrains, data.terrain);
  const climateLabel = getLabel(lists.climates, data.climate);
  const govLabel = getLabel(lists.govTypes, data.govType);
  const wealthLabel = data.wealthLevel ? getLabel(lists.wealthLevels, data.wealthLevel) : "";

  // --- Ruler text ---
  let rulerText = "";
  if (data.rulerName) {
    rulerText = data.rulerName;
    if (data.rulerDesc) rulerText += ` — ${data.rulerDesc}`;
  }

  // ===================
  // SIDEBAR
  // ===================
  const sidebarParts = [];

  sidebarParts.push(infoBox(i18n("LORE_FORGE.Kingdom.Review.KeyFacts") || "Key Facts", [
    infoRow(i18n("LORE_FORGE.Kingdom.Review.Type"), typeLabel),
    infoRow(i18n("LORE_FORGE.Kingdom.Review.Terrain"), terrainLabel),
    infoRow(i18n("LORE_FORGE.Kingdom.Review.Climate"), climateLabel),
    infoRow(i18n("LORE_FORGE.Kingdom.Review.GovType"), govLabel),
    infoRow(i18n("LORE_FORGE.Kingdom.Review.Ruler"), data.rulerName),
    infoRow(i18n("LORE_FORGE.Kingdom.Review.WealthLevel"), wealthLabel)
  ]));

  if (data.landmarks) {
    sidebarParts.push(infoBox(i18n("LORE_FORGE.Kingdom.Review.Landmarks") || "Landmarks", [
      `<p style="margin: 0;">${escapeHtml(data.landmarks)}</p>`
    ]));
  }

  const sidebar = sidebarParts.filter(Boolean).join("\n");

  // ===================
  // MAIN CONTENT
  // ===================
  const main = [];

  main.push(`<h1>${escapeHtml(data.name)}</h1>`);
  if (data.motto) {
    main.push(`<p style="margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid #0000003b; color: #888; font-style: italic;">"${escapeHtml(data.motto)}"</p>`);
  }

  if (rulerText && data.rulerDesc) {
    main.push(fieldP(i18n("LORE_FORGE.Kingdom.Review.Ruler"), rulerText));
  }

  if (data.culture) {
    main.push(sectionHeader(`<i class="fas fa-users"></i> ${i18n("LORE_FORGE.Kingdom.Review.Culture")}`));
    main.push(`<p>${escapeHtml(data.culture)}</p>`);
  }

  const hasHistoryEconomy = data.foundingStory || data.industries;
  if (hasHistoryEconomy) {
    main.push(sectionHeader(`<i class="fas fa-book-open"></i> ${i18n("LORE_FORGE.Kingdom.Review.History")}`));
    main.push(fieldP(i18n("LORE_FORGE.Kingdom.Review.FoundingStory"), data.foundingStory));
    main.push(fieldP(i18n("LORE_FORGE.Kingdom.Review.Industries"), data.industries));
  }

  if (data.religion) {
    main.push(sectionHeader(`<i class="fas fa-hat-wizard"></i> ${i18n("LORE_FORGE.Kingdom.Review.Religion")}`));
    main.push(`<p>${escapeHtml(data.religion)}</p>`);
  }

  if (data.faction1Name) {
    main.push(sectionHeader(`<i class="fas fa-users"></i> ${i18n("LORE_FORGE.Kingdom.Review.MainFaction") || "Main Faction"}`));
    let entry = `<strong>${escapeHtml(data.faction1Name)}</strong>`;
    if (data.faction1Goals) entry += `: ${escapeHtml(data.faction1Goals)}`;
    main.push(`<p>${entry}</p>`);
  }

  const mainContent = main.filter(Boolean).join("\n");

  // ===================
  // FULL-WIDTH (secrets below layout)
  // ===================
  const fullWidth = [];
  const hasSecrets = data.internalConflicts || data.externalThreats;
  if (hasSecrets) {
    const secretRows = [];
    if (data.externalThreats) secretRows.push(`<p><strong>${escapeHtml(i18n("LORE_FORGE.Kingdom.Review.ExternalThreats"))}:</strong> ${escapeHtml(data.externalThreats)}</p>`);
    if (data.internalConflicts) secretRows.push(`<p><strong>${escapeHtml(i18n("LORE_FORGE.Kingdom.Review.InternalConflicts"))}:</strong> ${escapeHtml(data.internalConflicts)}</p>`);

    fullWidth.push(
      `<div style="background: rgba(183,28,28,0.05); padding: 1rem; border-radius: 5px; border: 1px solid rgba(183,28,28,0.2); margin-top: 1rem;">`
      + `<h3 style="margin-top: 0; color: #B71C1C; border-bottom: 1px solid rgba(183,28,28,0.2); padding-bottom: 0.5rem;">`
      + `<i class="fas fa-exclamation-triangle"></i> ${i18n("LORE_FORGE.Kingdom.Review.Conflicts") || "Conflicts"}</h3>`
      + secretRows.join("\n")
      + `</div>`
    );
  }

  const htmlContent = wikiLayout(mainContent, sidebar) + fullWidth.filter(Boolean).join("\n");

  // --- Campaign Codex GM notes ---
  const notesSections = [];
  if (data.externalThreats) notesSections.push(fieldP(
    i18n("LORE_FORGE.Kingdom.Review.ExternalThreats"), data.externalThreats));
  if (data.internalConflicts) notesSections.push(fieldP(
    i18n("LORE_FORGE.Kingdom.Review.InternalConflicts"), data.internalConflicts));
  const notesContent = notesSections.filter(Boolean).join("\n");

  const flags = {
    "lore-forge": {
      type: "kingdom",
      wizardData: { ...data }
    }
  };

  if (isCodexActive()) {
    flags["campaign-codex"] = {
      type: "region",
      data: {
        description: htmlContent,
        notes: notesContent
      }
    };
    flags.core = { sheetClass: "campaign-codex.RegionSheet" };
  }

  return {
    name: data.name,
    pages: [{
      name: data.name,
      type: "text",
      text: { content: htmlContent, format: 1 }
    }],
    flags
  };
}

// =========================================================================
// Location Journal
// =========================================================================

/**
 * Build a JournalEntry creation data object for a location.
 * @param {object} data - The wizard's collected data
 * @param {object} lists - Reference lists for label resolution
 * @returns {object} Data suitable for JournalEntry.create()
 */
export function buildLocationJournal(data, lists) {
  const i18n = (key) => game.i18n.localize(key);

  // --- Resolve labels ---
  const typeLabel = getLabel(lists.locationTypes, data.locationType);

  // --- Owner text ---
  let ownerText = "";
  if (data.ownerName) {
    ownerText = data.ownerName;
    if (data.ownerDesc) ownerText += ` — ${data.ownerDesc}`;
  }

  // ===================
  // SIDEBAR (CC locationColumnsTemplate style: portrait + Key Facts box)
  // ===================
  const sidebarParts = [];

  // Portrait placeholder
  sidebarParts.push(
    `<figure style="margin: 0;">`
    + `<img src="modules/campaign-codex/ui/group.webp" alt="${escapeHtml(data.name)}" style="display: block; width: 100%; object-fit: cover; border-radius: 3px;">`
    + `</figure>`
  );

  // Box: Key Facts
  sidebarParts.push(infoBox(i18n("LORE_FORGE.Location.Review.KeyFacts") || "Key Facts", [
    infoRow(i18n("LORE_FORGE.Location.Review.Type"), typeLabel),
    infoRow(i18n("LORE_FORGE.Location.Review.Owner"), data.ownerName),
    infoRow(i18n("LORE_FORGE.Location.Review.Atmosphere"), data.atmosphere)
  ]));

  // Box: Dangers (red style if present)
  if (data.dangers) {
    sidebarParts.push(
      `<div style="background: rgba(183,28,28,0.05); padding: 1rem; border-radius: 5px; border: 1px solid rgba(183,28,28,0.2);">`
      + `<h3 style="margin-top: 0; color: #B71C1C; border-bottom: 1px solid rgba(183,28,28,0.2); padding-bottom: 0.5rem;">`
      + `${escapeHtml(i18n("LORE_FORGE.Location.Review.Dangers"))}</h3>`
      + `<p>${escapeHtml(data.dangers)}</p>`
      + `</div>`
    );
  }

  const sidebar = sidebarParts.filter(Boolean).join("\n");

  // ===================
  // MAIN CONTENT (CC locationColumnsTemplate style)
  // ===================
  const main = [];

  // Title (CC style: explicit font-size)
  main.push(`<h1 style="font-size: 1.5em; display: block; margin-bottom: 1rem;">${escapeHtml(data.name)}</h1>`);

  // Italic description + HR separator (CC location style)
  if (data.description) {
    main.push(`<p style="font-style: italic;">${escapeHtml(data.description)}</p>`);
  }
  main.push(`<hr style="border-color: #0000003b;">`);

  // Owner detail (if has description)
  if (ownerText && data.ownerDesc) {
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.Owner"), ownerText));
  }

  // Section: Notable Features
  const hasFeatures = data.notableFeatures || data.goodsServices;
  if (hasFeatures) {
    main.push(sectionHeader(i18n("LORE_FORGE.Location.Review.Features") || "Notable Features"));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.Features"), data.notableFeatures));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.GoodsServices"), data.goodsServices));
  }

  // Section: History
  const hasHistory = data.origin || data.pastEvents || data.locationLegends;
  if (hasHistory) {
    main.push(sectionHeader(i18n("LORE_FORGE.Location.Review.History")));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.Origin"), data.origin));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.PastEvents"), data.pastEvents));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.LocationLegends"), data.locationLegends));
  }

  // Section: Layout & Rooms
  const rooms = [
    { name: data.room1Name, desc: data.room1Desc },
    { name: data.room2Name, desc: data.room2Desc },
    { name: data.room3Name, desc: data.room3Desc }
  ].filter(r => r.name);

  const hasLayout = data.spatialDesc || rooms.length > 0;
  if (hasLayout) {
    main.push(sectionHeader(i18n("LORE_FORGE.Location.Review.Layout")));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.SpatialDesc"), data.spatialDesc));
    if (rooms.length > 0) {
      main.push("<ul>");
      for (const r of rooms) {
        let entry = `<strong>${escapeHtml(r.name)}</strong>`;
        if (r.desc) entry += `: ${escapeHtml(r.desc)}`;
        main.push(`<li>${entry}</li>`);
      }
      main.push("</ul>");
    }
  }

  // Section: Encounters
  const hasEncounters = data.encounters || data.recurringEvents || data.randomEncounters;
  if (hasEncounters) {
    main.push(sectionHeader(i18n("LORE_FORGE.Location.Review.Encounters")));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.EncountersList"), data.encounters));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.RecurringEvents"), data.recurringEvents));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.RandomEncounters"), data.randomEncounters));
  }

  // Section: Treasure
  const hasTreasure = data.notableItems || data.hiddenTreasure || data.stock;
  if (hasTreasure) {
    main.push(sectionHeader(i18n("LORE_FORGE.Location.Review.Treasure")));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.NotableItems"), data.notableItems));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.HiddenTreasure"), data.hiddenTreasure));
    main.push(fieldP(i18n("LORE_FORGE.Location.Review.Stock"), data.stock));
  }

  const mainContent = main.filter(Boolean).join("\n");

  // ===================
  // FULL-WIDTH (below layout)
  // ===================
  const fullWidth = [];

  // Section: Rumors & Hooks
  const hasHooks = data.rumors || data.plotHooks;
  if (hasHooks) {
    fullWidth.push(sectionHeader(i18n("LORE_FORGE.Location.Review.Hooks")));
    fullWidth.push(fieldP(i18n("LORE_FORGE.Location.Review.Rumors"), data.rumors));
    fullWidth.push(fieldP(i18n("LORE_FORGE.Location.Review.PlotHooks"), data.plotHooks));
  }

  // Secret (CC style: simple red h3, no wrapper)
  if (data.secrets) {
    fullWidth.push(`<h3 style="color: #B71C1C;">${escapeHtml(i18n("LORE_FORGE.Location.Review.Secrets"))}</h3>`);
    fullWidth.push(`<p>${escapeHtml(data.secrets)}</p>`);
  }

  const htmlContent = wikiLayout(mainContent, sidebar)
    + (fullWidth.length > 0
      ? `<div style="margin-top: 2rem;"><hr>${fullWidth.filter(Boolean).join("\n")}</div>`
      : "");

  // --- Campaign Codex notes ---
  const notesSections = [];
  if (data.secrets) notesSections.push(fieldP(
    i18n("LORE_FORGE.Location.Review.Secrets"), data.secrets));
  if (data.dangers) notesSections.push(fieldP(
    i18n("LORE_FORGE.Location.Review.Dangers"), data.dangers));
  if (data.hiddenTreasure) notesSections.push(fieldP(
    i18n("LORE_FORGE.Location.Review.HiddenTreasure"), data.hiddenTreasure));
  const notesContent = notesSections.filter(Boolean).join("\n");

  const flags = {
    "lore-forge": {
      type: "location",
      wizardData: { ...data }
    }
  };

  if (isCodexActive()) {
    flags["campaign-codex"] = {
      type: "location",
      data: {
        description: htmlContent,
        notes: notesContent
      }
    };
    flags.core = { sheetClass: "campaign-codex.LocationSheet" };
  }

  return {
    name: data.name,
    pages: [{
      name: data.name,
      type: "text",
      text: { content: htmlContent, format: 1 }
    }],
    flags
  };
}

// =========================================================================
// Settlement Journal
// =========================================================================

/**
 * Build a JournalEntry creation data object for a settlement.
 * @param {object} data - The wizard's collected data
 * @param {object} lists - Reference lists for label resolution
 * @returns {object} Data suitable for JournalEntry.create()
 */
export function buildSettlementJournal(data, lists) {
  const i18n = (key) => game.i18n.localize(key);

  // --- Resolve labels ---
  const sizeLabel = getLabel(lists.settlementSizes, data.settlementSize);

  // --- Leader text ---
  let leaderText = "";
  if (data.leaderName) {
    leaderText = data.leaderName;
    if (data.leaderDesc) leaderText += ` — ${data.leaderDesc}`;
  }

  // --- NPCs ---
  const npcList = [
    { name: data.npc1Name, role: data.npc1Role, desc: data.npc1Desc },
    { name: data.npc2Name, role: data.npc2Role, desc: data.npc2Desc }
  ].filter(n => n.name);

  // --- Districts ---
  const maxDistricts = lists.maxDistricts ?? 5;
  const districts = [];
  for (let i = 1; i <= maxDistricts; i++) {
    if (data[`district${i}Name`]) {
      districts.push({ name: data[`district${i}Name`], desc: data[`district${i}Desc`] });
    }
  }

  // ===================
  // SIDEBAR
  // ===================
  const sidebarParts = [];

  sidebarParts.push(infoBox(i18n("LORE_FORGE.Settlement.Review.KeyFacts") || "Key Facts", [
    infoRow(i18n("LORE_FORGE.Settlement.Review.Size"), sizeLabel),
    infoRow(i18n("LORE_FORGE.Settlement.Review.Population"), data.population),
    infoRow(i18n("LORE_FORGE.Settlement.Review.Leader"), data.leaderName),
    infoRow(i18n("LORE_FORGE.Settlement.Review.Defenses"), data.defenses)
  ]));

  if (npcList.length > 0) {
    const npcRows = npcList.map(npc => {
      const roleText = npc.role ? ` (${escapeHtml(npc.role)})` : "";
      return `<div style="margin-bottom: 0.5rem;">`
        + `<strong>${escapeHtml(npc.name)}</strong>${roleText}`
        + (npc.desc ? `<br><span style="font-size: 0.9em; opacity: 0.8;">${escapeHtml(npc.desc)}</span>` : "")
        + `</div>`;
    });
    sidebarParts.push(
      `<div style="background: #0000001a; padding: 1rem; border-radius: 5px; border: 1px solid #0000003b;">`
      + `<h3 style="margin-top: 0; border-bottom: 1px solid #0000003b; padding-bottom: 0.5rem;">`
      + `${escapeHtml(i18n("LORE_FORGE.Settlement.Review.NotableNPCs"))}</h3>`
      + npcRows.join("\n")
      + `</div>`
    );
  }

  const sidebar = sidebarParts.filter(Boolean).join("\n");

  // ===================
  // MAIN CONTENT
  // ===================
  const main = [];

  main.push(`<h1>${escapeHtml(data.name)}</h1>`);

  if (leaderText && data.leaderDesc) {
    main.push(fieldP(i18n("LORE_FORGE.Settlement.Review.Leader"), leaderText));
  }

  if (data.founding) {
    main.push(sectionHeader(`<i class="fas fa-book-open"></i> ${i18n("LORE_FORGE.Settlement.Review.Founding")}`));
    main.push(`<p>${escapeHtml(data.founding)}</p>`);
  }

  const hasGeography = districts.length > 0 || data.landmarks;
  if (hasGeography) {
    main.push(sectionHeader(`<i class="fas fa-map"></i> ${i18n("LORE_FORGE.Settlement.Review.Geography")}`));
    if (districts.length > 0) {
      main.push("<ul>");
      for (const d of districts) {
        let entry = `<strong>${escapeHtml(d.name)}</strong>`;
        if (d.desc) entry += `: ${escapeHtml(d.desc)}`;
        main.push(`<li>${entry}</li>`);
      }
      main.push("</ul>");
    }
    main.push(fieldP(i18n("LORE_FORGE.Settlement.Review.Landmarks"), data.landmarks));
  }

  const hasLife = data.economy || data.customs;
  if (hasLife) {
    main.push(sectionHeader(`<i class="fas fa-store"></i> ${i18n("LORE_FORGE.Settlement.Review.Life")}`));
    main.push(fieldP(i18n("LORE_FORGE.Settlement.Review.Economy"), data.economy));
    main.push(fieldP(i18n("LORE_FORGE.Settlement.Review.Customs"), data.customs));
  }

  if (data.organizations) {
    main.push(sectionHeader(`<i class="fas fa-users"></i> ${i18n("LORE_FORGE.Settlement.Review.Organizations")}`));
    main.push(`<p>${escapeHtml(data.organizations)}</p>`);
  }

  const mainContent = main.filter(Boolean).join("\n");

  // ===================
  // FULL-WIDTH (below layout)
  // ===================
  const fullWidth = [];

  const hasHooks = data.rumors || data.plotHooks;
  if (hasHooks) {
    fullWidth.push(sectionHeader(`<i class="fas fa-comment-dots"></i> ${i18n("LORE_FORGE.Settlement.Review.RumorsHooks") || "Rumors & Hooks"}`));
    fullWidth.push(fieldP(i18n("LORE_FORGE.Settlement.Review.Rumors"), data.rumors));
    fullWidth.push(fieldP(i18n("LORE_FORGE.Settlement.Review.PlotHooks"), data.plotHooks));
  }

  const htmlContent = wikiLayout(mainContent, sidebar)
    + (fullWidth.length > 0 ? `<div style="margin-top: 1rem;">${fullWidth.filter(Boolean).join("\n")}</div>` : "");

  // --- Campaign Codex notes ---
  const notesSections = [];
  if (data.rumors) notesSections.push(fieldP(
    i18n("LORE_FORGE.Settlement.Review.Rumors"), data.rumors));
  if (npcList.length > 0) {
    const npcSummary = npcList.map(n => {
      let text = n.name;
      if (n.role) text += ` (${n.role})`;
      return text;
    }).join("; ");
    notesSections.push(fieldP(
      i18n("LORE_FORGE.Settlement.Review.NotableNPCs"), npcSummary));
  }
  const notesContent = notesSections.filter(Boolean).join("\n");

  const flags = {
    "lore-forge": {
      type: "settlement",
      wizardData: { ...data }
    }
  };

  if (isCodexActive()) {
    flags["campaign-codex"] = {
      type: "location",
      data: {
        description: htmlContent,
        notes: notesContent
      }
    };
    flags.core = { sheetClass: "campaign-codex.LocationSheet" };
  }

  return {
    name: data.name,
    pages: [{
      name: data.name,
      type: "text",
      text: { content: htmlContent, format: 1 }
    }],
    flags
  };
}

// =========================================================================
// Character Journal
// =========================================================================

/**
 * Resolve the culture / sub-culture labels from the CULTURES array.
 */
function resolveCultureLabels(data, cultures) {
  let cultureLabel = "";
  let subCultureLabel = "";

  if (cultures && data.culture) {
    const cultureDef = cultures.find(c => c.key === data.culture);
    if (cultureDef) {
      cultureLabel = game.i18n.localize(cultureDef.label);
      if (cultureDef.subCultures && data.subCulture) {
        const subDef = cultureDef.subCultures.find(s => s.key === data.subCulture);
        if (subDef) subCultureLabel = game.i18n.localize(subDef.label);
      }
    }
  }
  return { cultureLabel, subCultureLabel };
}

/**
 * Build a JournalEntry creation data object for a narrative character.
 * Follows the CC bundled NPC template format exactly:
 * - Lighter info box colors (#0000000d bg, #0000001a border)
 * - Plain <h2> section headers (no border-bottom)
 * - <hr> separator after italic intro
 * - Simple <h3 color:#B71C1C> for secrets (no wrapper div)
 * - Portrait placeholder in sidebar
 *
 * @param {object} data - The wizard's collected data
 * @param {object} lists - Reference lists for label resolution (narrativeRoles, cultures)
 * @returns {object} Data suitable for JournalEntry.create()
 */
export function buildCharacterJournal(data, lists) {
  const i18n = (key) => game.i18n.localize(key);
  const fullName = data.surname ? `${data.name} ${data.surname}` : data.name;

  // --- Resolve labels ---
  const { cultureLabel, subCultureLabel } = resolveCultureLabels(data, lists.cultures);
  const roleEntry = lists.narrativeRoles?.find(r => r.key === data.narrativeRole);
  const roleLabel = roleEntry ? game.i18n.localize(roleEntry.label) : "";

  // --- Culture display text ---
  let cultureDisplay = cultureLabel;
  if (subCultureLabel) cultureDisplay += ` (${subCultureLabel})`;

  // --- NPC-specific info box (lighter colors matching CC NPC template) ---
  function npcInfoRow(label, value) {
    if (!value) return "";
    return `<div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">`
      + `<strong>${escapeHtml(label)}</strong>`
      + `<span>${escapeHtml(value)}</span>`
      + `</div>`;
  }

  function npcInfoBox(title, rows) {
    const content = rows.filter(Boolean).join("\n");
    if (!content) return "";
    return `<div style="background: #0000000d; padding: 1rem; border-radius: 5px; border: 1px solid #0000001a;">`
      + `<h3 style="margin-top: 0; border-bottom: 1px solid #0000001a; padding-bottom: 0.5rem;">${escapeHtml(title)}</h3>`
      + content
      + `</div>`;
  }

  // ===================
  // SIDEBAR (CC NPC style: portrait + Bio box + Social box)
  // ===================
  const sidebarParts = [];

  // Portrait placeholder
  sidebarParts.push(
    `<figure style="margin: 0;">`
    + `<img src="modules/campaign-codex/ui/group.webp" alt="${escapeHtml(fullName)}" style="display: block; width: 100%; object-fit: cover; border-radius: 3px;">`
    + `</figure>`
  );

  // Box: Bio
  sidebarParts.push(npcInfoBox(i18n("LORE_FORGE.Character.Review.Bio") || "Bio", [
    npcInfoRow(i18n("LORE_FORGE.Character.Review.Culture"), cultureDisplay || ""),
    npcInfoRow(i18n("LORE_FORGE.Character.Review.Role"), roleLabel),
    npcInfoRow(i18n("LORE_FORGE.Character.Review.Profession"), data.profession)
  ]));

  // Box: Social
  sidebarParts.push(npcInfoBox(i18n("LORE_FORGE.Character.Review.Social") || "Social", [
    npcInfoRow(i18n("LORE_FORGE.Character.Review.Traits"), data.traits),
    npcInfoRow(i18n("LORE_FORGE.Character.Review.Voice"), data.voice),
    npcInfoRow(i18n("LORE_FORGE.Character.Review.Mannerisms"), data.mannerisms)
  ]));

  const sidebar = sidebarParts.filter(Boolean).join("\n");

  // ===================
  // MAIN CONTENT (CC NPC style: h1 + italic intro + hr + h2 sections)
  // ===================
  const main = [];

  // Header: Name
  main.push(`<h1>${escapeHtml(fullName)}</h1>`);

  // Badge line (italic summary, like CC NPC template intro)
  const badges = [];
  if (cultureLabel) {
    let badgeText = cultureLabel;
    if (subCultureLabel) badgeText += ` / ${subCultureLabel}`;
    badges.push(badgeText);
  }
  if (roleLabel) badges.push(escapeHtml(roleLabel));

  if (badges.length > 0) {
    main.push(`<p><i>${badges.join(` &bull; `)}</i></p>`);
  }

  // HR separator (CC NPC style)
  main.push(`<hr style="border: 0; border-top: 1px solid #0000001a;">`);

  // Section: Appearance (h2, no border — CC NPC style)
  const hasAppearance = data.physicalDesc || data.height || data.build ||
                        data.hairAndEyes || data.distinguishingMarks || data.clothingStyle;
  if (hasAppearance) {
    main.push(`<h2>${i18n("LORE_FORGE.Character.Review.Appearance")}</h2>`);
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.PhysicalDesc"), data.physicalDesc));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Height"), data.height));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Build"), data.build));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.HairAndEyes"), data.hairAndEyes));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.DistinguishingMarks"), data.distinguishingMarks));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.ClothingStyle"), data.clothingStyle));
  }

  // Section: Roleplaying (personality — maps to CC "Roleplaying" section)
  const hasPersonality = data.traits || data.mannerisms || data.voice;
  if (hasPersonality) {
    main.push(`<h2>${i18n("LORE_FORGE.Character.Review.Personality")}</h2>`);
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Traits"), data.traits));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Mannerisms"), data.mannerisms));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Voice"), data.voice));
  }

  // Section: Abilities & Combat
  const hasAbilities = data.combatStyle || data.magicalAbilities || data.notableSkills || data.weaknesses;
  if (hasAbilities) {
    main.push(`<h2>${i18n("LORE_FORGE.Character.Review.Abilities")}</h2>`);
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.CombatStyle"), data.combatStyle));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.MagicalAbilities"), data.magicalAbilities));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.NotableSkills"), data.notableSkills));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Weaknesses"), data.weaknesses));
  }

  // Section: Occupation
  const hasOccupation = data.profession || data.dailyRoutine || data.workplace || data.keyPossessions;
  if (hasOccupation) {
    main.push(`<h2>${i18n("LORE_FORGE.Character.Review.Occupation")}</h2>`);
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Profession"), data.profession));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.DailyRoutine"), data.dailyRoutine));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Workplace"), data.workplace));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.KeyPossessions"), data.keyPossessions));
  }

  // Section: Background (maps to CC "Background" section)
  const hasBackground = data.backstory || data.motivation || data.fears;
  if (hasBackground) {
    main.push(`<h2>${i18n("LORE_FORGE.Character.Review.Background")}</h2>`);
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Backstory"), data.backstory));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Motivation"), data.motivation));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.Fears"), data.fears));
  }

  // Section: Goals
  const hasGoals = data.shortTermGoals || data.longTermGoals || data.moralDilemmas || data.internalConflicts;
  if (hasGoals) {
    main.push(`<h2>${i18n("LORE_FORGE.Character.Review.Goals")}</h2>`);
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.ShortTermGoals"), data.shortTermGoals));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.LongTermGoals"), data.longTermGoals));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.MoralDilemmas"), data.moralDilemmas));
    main.push(fieldP(i18n("LORE_FORGE.Character.Review.InternalConflicts"), data.internalConflicts));
  }

  // Secret / Key Info (CC NPC style: simple red h3, no wrapper div)
  if (data.secret) {
    main.push(`<h3 style="color: #B71C1C;">${escapeHtml(i18n("LORE_FORGE.Character.Review.Secret"))}</h3>`);
    main.push(`<p>${escapeHtml(data.secret)}</p>`);
  }

  const mainContent = main.filter(Boolean).join("\n");

  // ===================
  // FULL-WIDTH (below layout — connections)
  // ===================
  const fullWidth = [];

  // Section: Connections
  const relations = [
    { name: data.relation1Name, type: data.relation1Type, desc: data.relation1Desc },
    { name: data.relation2Name, type: data.relation2Type, desc: data.relation2Desc },
    { name: data.relation3Name, type: data.relation3Type, desc: data.relation3Desc }
  ].filter(r => r.name);

  const hasConnections = relations.length > 0 || data.narrativeArc || data.plotHooks;
  if (hasConnections) {
    fullWidth.push(`<h2>${i18n("LORE_FORGE.Character.Review.Connections")}</h2>`);

    // Relation mini-cards (CC NPC lighter style)
    if (relations.length > 0) {
      fullWidth.push(`<div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">`);
      for (const r of relations) {
        let card = `<div style="background: #0000000d; border: 1px solid #0000001a; border-radius: 5px; padding: 0.75rem; flex: 1; min-width: 200px;">`;
        card += `<strong>${escapeHtml(r.name)}</strong>`;
        if (r.type) card += ` <span style="opacity: 0.7; font-size: 0.85em;">(${escapeHtml(r.type)})</span>`;
        if (r.desc) card += `<br><span style="font-size: 0.9em;">${escapeHtml(r.desc)}</span>`;
        card += `</div>`;
        fullWidth.push(card);
      }
      fullWidth.push(`</div>`);
    }

    fullWidth.push(fieldP(i18n("LORE_FORGE.Character.Review.NarrativeArc"), data.narrativeArc));
    fullWidth.push(fieldP(i18n("LORE_FORGE.Character.Review.PlotHooks"), data.plotHooks));
  }

  const htmlContent = wikiLayout(mainContent, sidebar)
    + (fullWidth.length > 0
      ? `<div style="margin-top: 2rem;"><hr>${fullWidth.filter(Boolean).join("\n")}</div>`
      : "");

  const flags = {
    "lore-forge": {
      type: "character",
      wizardData: { ...data }
    }
  };

  if (isCodexActive()) {
    flags["campaign-codex"] = {
      type: "npc",
      data: {
        description: htmlContent,
        notes: data.secret || ""
      }
    };
    flags.core = { sheetClass: "campaign-codex.NPCSheet" };
  }

  return {
    name: fullName,
    pages: [{
      name: fullName,
      type: "text",
      text: { content: htmlContent, format: 1 }
    }],
    flags
  };
}
