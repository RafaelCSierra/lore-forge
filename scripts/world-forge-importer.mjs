/**
 * WorldForgeImporter — ApplicationV2 three-step importer.
 * Step 0 (file):    Load and validate a World Forge JSON export.
 * Step 1 (preview): Select which entity types to import and configure options.
 * Step 2 (result):  Run the import and show results.
 */

import { buildWorldForgeJournal, buildNameMap } from "./world-forge-journal-builder.mjs";

const { ApplicationV2 } = foundry.applications.api;

// Plural type key → human-readable label (EN fallback)
const TYPE_LABELS = {
  characters:    "LORE_FORGE.WorldForge.Types.Characters",
  locations:     "LORE_FORGE.WorldForge.Types.Locations",
  civilizations: "LORE_FORGE.WorldForge.Types.Civilizations",
  factions:      "LORE_FORGE.WorldForge.Types.Factions",
  sessions:      "LORE_FORGE.WorldForge.Types.Sessions",
  items:         "LORE_FORGE.WorldForge.Types.Items",
  deities:       "LORE_FORGE.WorldForge.Types.Deities",
  events:        "LORE_FORGE.WorldForge.Types.Events",
  quests:        "LORE_FORGE.WorldForge.Types.Quests",
  stories:       "LORE_FORGE.WorldForge.Types.Stories",
};

// Campaign Codex folder names by CC type
const CC_FOLDER_NAMES = {
  npc:      "Campaign Codex - NPCs",
  location: "Campaign Codex - Locations",
  region:   "Campaign Codex - Regions",
  shop:     "Campaign Codex - Entries",
};

// World Forge type → CC type (mirrors CC_TYPE_MAP in journal-builder)
const CC_TYPE_FOR = {
  characters:    "npc",
  locations:     "location",
  civilizations: "region",
  factions:      "region",
  events:        "shop",
};

// =========================================================================
// Folder helpers
// =========================================================================

async function _findOrCreateFolder(name, parentId = null) {
  const existing = game.folders.find(f =>
    f.type === "JournalEntry" && f.name === name && f.folder?.id === parentId
  );
  if (existing) return existing;
  return Folder.create({ name, type: "JournalEntry", folder: parentId });
}

/**
 * Find the Campaign Codex folder for a given CC type.
 * Returns the folder or null if not found (CC not active / folder not created).
 */
function _findCCFolder(ccType) {
  const folderName = CC_FOLDER_NAMES[ccType];
  if (!folderName) return null;
  return game.folders.find(f =>
    f.type === "JournalEntry" && f.name === folderName
  ) ?? null;
}

// =========================================================================
// WorldForgeImporter
// =========================================================================

export default class WorldForgeImporter extends ApplicationV2 {

  /** @type {Object|null} Parsed World Forge JSON */
  _importData = null;

  /** @type {Set<string>} Type keys selected for import */
  _selectedTypes = new Set();

  /** @type {{ folderName: string, subfolders: boolean, overwrite: boolean }} */
  _options = { folderName: "", subfolders: true, overwrite: false };

  /** @type {number} Current step index (0, 1, 2) */
  _step = 0;

  /** @type {Array<{name: string, ok: boolean, error?: string}>} Import results */
  _results = [];

  /** @type {number} Progress counter */
  _progress = 0;

  /** @type {number} Total to import */
  _total = 0;

  static DEFAULT_OPTIONS = {
    id: "world-forge-importer",
    classes: ["lore-forge-dialog", "world-forge-importer"],
    tag: "div",
    window: {
      title: "LORE_FORGE.WorldForge.Title",
      resizable: false,
    },
    position: {
      width: 500,
      height: "auto",
    },
    actions: {
      "load-file": WorldForgeImporter.#onLoadFile,
      "step-next": WorldForgeImporter.#onStepNext,
      "step-back": WorldForgeImporter.#onStepBack,
      "start-import": WorldForgeImporter.#onStartImport,
    },
  };

  // -----------------------------------------------------------------------
  // Rendering
  // -----------------------------------------------------------------------

  async _renderHTML(context, options) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("lf-wf-wrapper");

    if (this._step === 0) {
      wrapper.innerHTML = await this._renderStepFile();
    } else if (this._step === 1) {
      wrapper.innerHTML = await this._renderStepPreview();
    } else {
      wrapper.innerHTML = await this._renderStepResult();
    }

    return { wrapper };
  }

  _replaceHTML(result, content, options) {
    content.replaceChildren(result.wrapper);
  }

  // -----------------------------------------------------------------------
  // Step renderers (inline HTML — no HBS needed for this flow)
  // -----------------------------------------------------------------------

  async _renderStepFile() {
    const preview = this._importData
      ? this._buildPreviewHtml()
      : "";

    return `
      <div class="lf-wf-step" data-step="file">
        <h2 class="lf-wf-step-title">${game.i18n.localize("LORE_FORGE.WorldForge.Step.File")}</h2>
        <div class="lf-wf-form">
          <div class="form-group lf-wf-file-group">
            <label>${game.i18n.localize("LORE_FORGE.WorldForge.SelectFile")}</label>
            <input type="file" name="wf-file" accept=".json" id="lf-wf-file-input">
            <button type="button" class="lf-wf-load-btn" data-action="load-file">
              <i class="fas fa-upload"></i>
              ${game.i18n.localize("LORE_FORGE.WorldForge.LoadFile")}
            </button>
          </div>
          ${preview}
        </div>
        <div class="lf-wf-footer">
          <button type="button" class="lf-wf-btn-secondary" data-action="close">
            ${game.i18n.localize("Close")}
          </button>
          <button type="button" class="lf-wf-btn-primary" data-action="step-next"
            ${this._importData ? "" : "disabled"}>
            ${game.i18n.localize("LORE_FORGE.WorldForge.Next")} →
          </button>
        </div>
      </div>`;
  }

  _buildPreviewHtml() {
    const c = this._importData.campaign;
    const entities = this._importData.entities ?? {};
    const counts = Object.entries(TYPE_LABELS)
      .map(([key, labelKey]) => {
        const count = (entities[key] ?? []).length;
        return count > 0
          ? `<span class="lf-wf-count-badge">${game.i18n.localize(labelKey)}: <strong>${count}</strong></span>`
          : "";
      })
      .filter(Boolean)
      .join("");

    return `
      <div class="lf-wf-preview-box">
        <div class="lf-wf-preview-name"><i class="fas fa-book"></i> ${_esc(c.name)}</div>
        ${c.setting ? `<div class="lf-wf-preview-setting">${_esc(c.setting)}</div>` : ""}
        <div class="lf-wf-counts">${counts || `<em>${game.i18n.localize("LORE_FORGE.WorldForge.NoEntities")}</em>`}</div>
      </div>`;
  }

  async _renderStepPreview() {
    const entities = this._importData.entities ?? {};
    const campaignName = this._importData.campaign?.name ?? "";
    const folderName = this._options.folderName || campaignName;

    const checkboxes = Object.entries(TYPE_LABELS)
      .map(([key, labelKey]) => {
        const list = entities[key] ?? [];
        if (!list.length) return "";
        const checked = this._selectedTypes.has(key) ? "checked" : "";
        const label = game.i18n.localize(labelKey);
        return `
          <label class="lf-wf-type-row">
            <input type="checkbox" name="type-${key}" ${checked}>
            <span class="lf-wf-type-label">${label}</span>
            <span class="lf-wf-type-count">${list.length}</span>
          </label>`;
      })
      .filter(Boolean)
      .join("");

    return `
      <div class="lf-wf-step" data-step="preview">
        <h2 class="lf-wf-step-title">${game.i18n.localize("LORE_FORGE.WorldForge.Step.Preview")}</h2>
        <div class="lf-wf-form">
          <div class="lf-wf-section-label">${game.i18n.localize("LORE_FORGE.WorldForge.SelectTypes")}</div>
          <div class="lf-wf-type-list">
            ${checkboxes}
          </div>
          <div class="form-group lf-wf-option-row">
            <label>${game.i18n.localize("LORE_FORGE.WorldForge.FolderName")}</label>
            <input type="text" name="folder-name" value="${_esc(folderName)}">
          </div>
          <div class="form-group lf-wf-option-row">
            <label>
              <input type="checkbox" name="opt-subfolders" ${this._options.subfolders ? "checked" : ""}>
              ${game.i18n.localize("LORE_FORGE.WorldForge.Subfolders")}
            </label>
          </div>
          <div class="form-group lf-wf-option-row">
            <label>
              <input type="checkbox" name="opt-overwrite" ${this._options.overwrite ? "checked" : ""}>
              ${game.i18n.localize("LORE_FORGE.WorldForge.Overwrite")}
            </label>
          </div>
        </div>
        <div class="lf-wf-footer">
          <button type="button" class="lf-wf-btn-secondary" data-action="step-back">
            ← ${game.i18n.localize("LORE_FORGE.WorldForge.Back")}
          </button>
          <button type="button" class="lf-wf-btn-primary" data-action="start-import">
            <i class="fas fa-file-import"></i>
            ${game.i18n.localize("LORE_FORGE.WorldForge.StartImport")}
          </button>
        </div>
      </div>`;
  }

  async _renderStepResult() {
    const pct = this._total > 0 ? Math.round((this._progress / this._total) * 100) : 100;
    const importing = this._progress < this._total;

    const resultItems = this._results.map(r => {
      const icon = r.ok ? "fa-check" : "fa-xmark";
      const cls = r.ok ? "lf-wf-result-ok" : "lf-wf-result-err";
      return `<li class="${cls}"><i class="fas ${icon}"></i> ${_esc(r.name)}${r.error ? ` — ${_esc(r.error)}` : ""}</li>`;
    }).join("");

    return `
      <div class="lf-wf-step" data-step="result">
        <h2 class="lf-wf-step-title">${importing
          ? game.i18n.localize("LORE_FORGE.WorldForge.Importing")
          : game.i18n.localize("LORE_FORGE.WorldForge.Step.Result")}</h2>
        <div class="lf-wf-progress-bar-wrap">
          <div class="lf-wf-progress-bar" style="width: ${pct}%"></div>
        </div>
        <div class="lf-wf-progress-label">${this._progress} / ${this._total}</div>
        ${!importing ? `
          <div class="lf-wf-done-msg">
            ${game.i18n.format("LORE_FORGE.WorldForge.Done", { count: this._results.filter(r => r.ok).length })}
          </div>
          <ul class="lf-wf-result-list">${resultItems}</ul>
          <div class="lf-wf-footer">
            <button type="button" class="lf-wf-btn-primary" data-action="close">
              ${game.i18n.localize("Close")}
            </button>
          </div>` : ""}
      </div>`;
  }

  // -----------------------------------------------------------------------
  // Actions
  // -----------------------------------------------------------------------

  static async #onLoadFile(event, target) {
    const input = this.element.querySelector("#lf-wf-file-input");
    if (!input?.files?.length) {
      ui.notifications.warn(game.i18n.localize("LORE_FORGE.WorldForge.NoFileSelected"));
      return;
    }

    const file = input.files[0];
    const text = await file.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      ui.notifications.error(game.i18n.localize("LORE_FORGE.WorldForge.InvalidFile"));
      return;
    }

    if (data.version !== "1.0" || !data.campaign?.name) {
      ui.notifications.error(game.i18n.localize("LORE_FORGE.WorldForge.InvalidFile"));
      return;
    }

    this._importData = data;
    // Default: select all types that have entities
    this._selectedTypes = new Set(
      Object.keys(TYPE_LABELS).filter(k => (data.entities?.[k] ?? []).length > 0)
    );
    this._options.folderName = data.campaign.name;

    this.render();
  }

  static #onStepNext(event, target) {
    if (!this._importData) return;
    this._step = 1;
    this.render();
  }

  static #onStepBack(event, target) {
    this._step = 0;
    this.render();
  }

  static async #onStartImport(event, target) {
    // Collect form values from step 1
    const el = this.element;
    this._options.folderName = el.querySelector("[name='folder-name']")?.value?.trim()
      || this._importData.campaign.name;
    this._options.subfolders = el.querySelector("[name='opt-subfolders']")?.checked ?? true;
    this._options.overwrite = el.querySelector("[name='opt-overwrite']")?.checked ?? false;

    // Collect selected types
    this._selectedTypes = new Set();
    for (const key of Object.keys(TYPE_LABELS)) {
      if (el.querySelector(`[name='type-${key}']`)?.checked) {
        this._selectedTypes.add(key);
      }
    }

    if (this._selectedTypes.size === 0) {
      ui.notifications.warn(game.i18n.localize("LORE_FORGE.WorldForge.NoEntities"));
      return;
    }

    this._step = 2;
    this._results = [];
    this._progress = 0;
    this._total = [...this._selectedTypes].reduce((sum, key) => {
      return sum + (this._importData.entities?.[key]?.length ?? 0);
    }, 0);

    this.render();
    // Run after the DOM updates
    setTimeout(() => this._runImport(), 50);
  }

  // -----------------------------------------------------------------------
  // Import logic
  // -----------------------------------------------------------------------

  async _runImport() {
    const { folderName, subfolders, overwrite } = this._options;
    const entities = this._importData.entities ?? {};
    const relations = this._importData.relations ?? [];

    const nameMap = buildNameMap(entities);

    // Only create root/subfolders for types without Campaign Codex mapping
    let rootFolder = null;

    for (const [type, labelKey] of Object.entries(TYPE_LABELS)) {
      if (!this._selectedTypes.has(type)) continue;
      const list = entities[type] ?? [];
      if (!list.length) continue;

      // If type has a CC mapping, try to use the CC folder
      const ccType = CC_TYPE_FOR[type];
      const ccFolder = ccType ? _findCCFolder(ccType) : null;

      let targetFolder;
      if (ccFolder) {
        targetFolder = ccFolder;
      } else {
        // Fallback: create campaign folder structure for non-CC types
        if (!rootFolder) rootFolder = await _findOrCreateFolder(folderName);
        const typeLabel = game.i18n.localize(labelKey);
        targetFolder = subfolders
          ? await _findOrCreateFolder(typeLabel, rootFolder.id)
          : rootFolder;
      }

      for (const entity of list) {
        try {
          // Overwrite: delete existing journal with same flag entityId
          if (overwrite) {
            const existing = game.journal.find(j =>
              j.getFlag("lore-forge", "entityId") === entity.id
            );
            if (existing) await existing.delete();
          }

          const journalData = buildWorldForgeJournal(entity, type, relations, nameMap);
          journalData.folder = targetFolder.id;
          await JournalEntry.create(journalData);

          this._results.push({ name: entity.name || "Unnamed", ok: true });
        } catch (err) {
          this._results.push({ name: entity.name || "Unnamed", ok: false, error: err.message });
        }

        this._progress++;
        this.render();
        // Yield to allow DOM paint
        await new Promise(r => setTimeout(r, 0));
      }
    }

    // Final render with full results
    this.render();

    const created = this._results.filter(r => r.ok).length;
    ui.notifications.info(game.i18n.format("LORE_FORGE.WorldForge.Done", { count: created }));

    if (game.settings.get("lore-forge", "autoOpenJournal")) {
      ui.journal?.render(true);
    }
  }
}

// =========================================================================
// Private helpers
// =========================================================================

function _esc(text) {
  if (text == null) return "";
  const div = document.createElement("div");
  div.textContent = String(text);
  return div.innerHTML;
}
