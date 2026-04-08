/**
 * LoreForgeWizard - Base class for all Lore Forge step wizards.
 * Provides shared rendering, navigation, inspiration, and forge logic.
 * Subclasses must implement abstract getters and _buildJournalData().
 */

import { getInspiration } from "./inspiration-engine.mjs";

const { ApplicationV2 } = foundry.applications.api;

export default class LoreForgeWizard extends ApplicationV2 {

  _currentStep = 0;
  _data = {};

  static DEFAULT_OPTIONS = {
    classes: ["lore-forge-wizard"],
    tag: "div",
    window: {
      resizable: true
    },
    position: {
      width: 600,
      height: 640
    },
    actions: {
      "inspire": LoreForgeWizard._onInspire,
      "inspire-all": LoreForgeWizard._onInspireAll,
      "step-next": LoreForgeWizard._onStepNext,
      "step-back": LoreForgeWizard._onStepBack,
      "step-jump": LoreForgeWizard._onStepJump,
      "forge": LoreForgeWizard._onForge,
      "clear": LoreForgeWizard._onClear
    }
  };

  // =========================================================================
  // Abstract — subclasses MUST override
  // =========================================================================

  /** @returns {string[]} i18n keys for each step label */
  get stepLabels() { return []; }

  /** @returns {string[]} Handlebars template paths for each step */
  get templatePaths() { return []; }

  /** @returns {string[]} Step identifiers (e.g. ["identity","geography","review"]) */
  get steps() { return []; }

  /** @returns {string} Inspiration engine category key */
  get inspirationCategory() { return ""; }

  /**
   * Build the JournalEntry creation data from wizard data.
   * @returns {object} Data passed to JournalEntry.create()
   */
  _buildJournalData() {
    throw new Error("Subclass must implement _buildJournalData()");
  }

  // =========================================================================
  // Hooks — subclasses MAY override
  // =========================================================================

  /**
   * Validate before advancing to the next step. Return false to block.
   * Default: require a name on the first step.
   */
  _validateBeforeNext() {
    if (this._currentStep === 0 && !this._data.name) {
      ui.notifications.warn(game.i18n.localize("LORE_FORGE.Notify.NoName"));
      return false;
    }
    return true;
  }

  /** Called after capturing data but before advancing a step. */
  _afterStepLeave() {}

  // =========================================================================
  // Cascading Selects
  // =========================================================================

  /**
   * After render, attach change listeners to any <select data-cascade="...">
   * so that changing a parent resets its child fields and re-renders.
   */
  _onRender(context, options) {
    const html = this.element;
    if (!html) return;

    // Scroll to top on step change
    if (this._shouldScrollTop) {
      const container = html.querySelector(".lore-forge-steps-container");
      if (container) container.scrollTop = 0;
      this._shouldScrollTop = false;
    }

    const cascadeSelects = html.querySelectorAll("select[data-cascade]");
    for (const sel of cascadeSelects) {
      sel.addEventListener("change", () => {
        // Capture current data before resetting children
        this._captureCurrentStepData();

        // Reset all child fields listed in data-cascade
        const children = sel.dataset.cascade.split(",").map(s => s.trim()).filter(Boolean);
        for (const childField of children) {
          this._data[childField] = "";
        }

        this._saveDraft();
        this.render();
      });
    }
  }

  // =========================================================================
  // Rendering
  // =========================================================================

  async _renderHTML(context, options) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("lore-forge-body");

    // Step indicator bar
    const stepBar = document.createElement("div");
    stepBar.classList.add("lore-forge-steps-bar");
    if (this.steps.length > 6) stepBar.classList.add("compact");
    const labels = this.stepLabels;
    const steps = this.steps;
    for (let i = 0; i < steps.length; i++) {
      const indicator = document.createElement("div");
      indicator.classList.add("step-indicator");
      if (i === this._currentStep) indicator.classList.add("active");
      if (i < this._currentStep) {
        indicator.classList.add("completed");
        indicator.dataset.action = "step-jump";
        indicator.dataset.step = i;
      }
      indicator.innerHTML = `<span class="step-number">${i + 1}</span> ${game.i18n.localize(labels[i])}`;
      stepBar.appendChild(indicator);
    }

    // Draft saved indicator
    const draftIndicator = document.createElement("div");
    draftIndicator.classList.add("lf-draft-indicator");
    draftIndicator.textContent = game.i18n.localize("LORE_FORGE.DraftSaved");
    stepBar.appendChild(draftIndicator);

    wrapper.appendChild(stepBar);

    // Steps container
    const stepsContainer = document.createElement("div");
    stepsContainer.classList.add("lore-forge-steps-container");
    const paths = this.templatePaths;
    for (let i = 0; i < paths.length; i++) {
      const html = await renderTemplate(paths[i], context);
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const section = tempDiv.firstElementChild;
      if (i === this._currentStep) section.classList.add("active");

      // Inject "Inspire Empty" button if step has inspiration buttons
      if (i === this._currentStep) {
        const inspireButtons = section.querySelectorAll('[data-action="inspire"]');
        if (inspireButtons.length > 0) {
          const h2 = section.querySelector("h2");
          if (h2) {
            const inspireAllBtn = document.createElement("button");
            inspireAllBtn.type = "button";
            inspireAllBtn.classList.add("lf-inspire-all-btn");
            inspireAllBtn.dataset.action = "inspire-all";
            inspireAllBtn.innerHTML = `<i class="fas fa-dice-d20"></i> ${game.i18n.localize("LORE_FORGE.InspireAll")}`;
            h2.style.display = "flex";
            h2.style.justifyContent = "space-between";
            h2.style.alignItems = "center";
            h2.appendChild(inspireAllBtn);
          }
        }
      }

      stepsContainer.appendChild(section);
    }
    wrapper.appendChild(stepsContainer);

    // Navigation bar
    const nav = document.createElement("div");
    nav.classList.add("lore-forge-nav");

    if (this._currentStep > 0) {
      nav.innerHTML += `<button type="button" data-action="step-back">${game.i18n.localize("LORE_FORGE.Nav.Back")}</button>`;
    } else {
      nav.innerHTML += `<button type="button" class="lf-reset-btn" data-action="clear"><i class="fas fa-undo"></i> ${game.i18n.localize("LORE_FORGE.Nav.Reset")}</button>`;
    }

    if (this._currentStep < steps.length - 1) {
      nav.innerHTML += `<button type="button" data-action="step-next">${game.i18n.localize("LORE_FORGE.Nav.Next")}</button>`;
    } else {
      nav.innerHTML += `<button type="button" data-action="forge"><i class="fas fa-feather-pointed"></i> ${game.i18n.localize("LORE_FORGE.Nav.Forge")}</button>`;
    }

    wrapper.appendChild(nav);
    return { wrapper };
  }

  _replaceHTML(result, content, options) {
    content.replaceChildren(result.wrapper);
  }

  // =========================================================================
  // Data Capture
  // =========================================================================

  /**
   * Read all form values from the DOM into _data.
   * Override for non-standard form inputs (e.g. radio buttons, renamed fields).
   */
  _captureCurrentStepData() {
    const html = this.element;
    if (!html) return;
    for (const field of Object.keys(this._data)) {
      const el = html.querySelector(`[name="${field}"]`);
      if (el) this._data[field] = el.value;
    }
  }

  // =========================================================================
  // Draft Persistence
  // =========================================================================

  /** localStorage key, derived from the app id. */
  get _storageKey() {
    return `lf-draft-${this.options.id}`;
  }

  /** Save current wizard state to localStorage. */
  _saveDraft() {
    try {
      localStorage.setItem(this._storageKey, JSON.stringify({
        data: this._data,
        step: this._currentStep
      }));
    } catch { /* ignore quota errors */ }

    // Show draft indicator
    const indicator = this.element?.querySelector(".lf-draft-indicator");
    if (indicator) {
      indicator.classList.add("visible");
      clearTimeout(this._draftFadeTimeout);
      this._draftFadeTimeout = setTimeout(() => {
        indicator.classList.remove("visible");
      }, 2000);
    }
  }

  /**
   * Restore wizard state from localStorage.
   * Call at the end of each subclass constructor, after setting _data.
   */
  _restoreDraft() {
    try {
      const raw = localStorage.getItem(this._storageKey);
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (draft.data) {
        for (const key of Object.keys(this._data)) {
          if (key in draft.data) this._data[key] = draft.data[key];
        }
      }
      if (typeof draft.step === "number") this._currentStep = draft.step;
    } catch { /* ignore parse errors */ }
  }

  /** Clear the saved draft (called after successful forge). */
  _clearDraft() {
    localStorage.removeItem(this._storageKey);
  }

  /** Reset the wizard to initial state. */
  _resetWizard() {
    if (this._initialData) {
      this._data = { ...this._initialData };
    } else {
      for (const key of Object.keys(this._data)) {
        this._data[key] = "";
      }
    }
    this._currentStep = 0;
    this._clearDraft();
    this.render();
  }

  // =========================================================================
  // Utilities
  // =========================================================================

  _getLabel(list, value) {
    const entry = list.find(e => e.value === value);
    return entry ? game.i18n.localize(entry.label) : value;
  }

  // =========================================================================
  // Actions
  // =========================================================================

  static _onInspire(event, target) {
    const field = target.dataset.field;
    if (!field) return;

    const inspiration = getInspiration(this.inspirationCategory, field);
    if (!inspiration) return;

    const row = target.closest(".inspiration-row");
    if (row) {
      const input = row.querySelector("input, textarea");
      if (input) {
        input.value = inspiration;
        input.focus();
      }
    }
  }

  static _onInspireAll(event, target) {
    const activeStep = this.element?.querySelector(".lore-forge-step.active");
    if (!activeStep) return;

    const inspireButtons = activeStep.querySelectorAll('[data-action="inspire"]');
    for (const btn of inspireButtons) {
      const field = btn.dataset.field;
      if (!field) continue;

      const row = btn.closest(".inspiration-row");
      if (!row) continue;
      const input = row.querySelector("input, textarea");
      if (!input || input.value.trim()) continue; // skip non-empty

      const inspiration = getInspiration(this.inspirationCategory, field);
      if (inspiration) input.value = inspiration;
    }
  }

  static _onClear(event, target) {
    const confirmed = Dialog.confirm({
      title: game.i18n.localize("LORE_FORGE.ResetConfirmTitle"),
      content: `<p>${game.i18n.localize("LORE_FORGE.ResetConfirmContent")}</p>`,
      yes: () => {
        this._resetWizard();
      }
    });
  }

  static _onStepJump(event, target) {
    const step = Number(target.closest("[data-step]")?.dataset.step);
    if (Number.isNaN(step) || step >= this._currentStep) return;
    this._captureCurrentStepData();
    this._currentStep = step;
    this._shouldScrollTop = true;
    this._saveDraft();
    this.render();
  }

  static _onStepNext(event, target) {
    this._captureCurrentStepData();
    if (!this._validateBeforeNext()) return;
    this._afterStepLeave();
    if (this._currentStep < this.steps.length - 1) {
      this._currentStep++;
      this._shouldScrollTop = true;
      this._saveDraft();
      this.render();
    }
  }

  static _onStepBack(event, target) {
    this._captureCurrentStepData();
    if (this._currentStep > 0) {
      this._currentStep--;
      this._shouldScrollTop = true;
      this._saveDraft();
      this.render();
    }
  }

  static async _onForge(event, target) {
    this._captureCurrentStepData();

    if (!this._data.name) {
      ui.notifications.warn(game.i18n.localize("LORE_FORGE.Notify.NoName"));
      return;
    }

    const forgeBtn = this.element?.querySelector('[data-action="forge"]');
    if (forgeBtn) {
      forgeBtn.disabled = true;
      forgeBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${game.i18n.localize("LORE_FORGE.Nav.Forging")}`;
    }

    const codexActive = game.modules.get("campaign-codex")?.active
      && game.settings.get("lore-forge", "campaignCodexIntegration");
    const autoOpen = game.settings.get("lore-forge", "autoOpenJournal");

    try {
      const journalData = this._buildJournalData();
      const loreType = journalData.flags?.["lore-forge"]?.type;

      // --- Resolve folder ---
      const folderName = game.settings.get("lore-forge", "journalFolder")?.trim();
      if (folderName) {
        let folder = game.folders.find(f => f.type === "JournalEntry" && f.name === folderName);
        if (!folder) {
          folder = await Folder.create({ name: folderName, type: "JournalEntry" });
        }
        journalData.folder = folder.id;
      }

      // --- NPC linking: link to most specific target ---
      if (loreType === "character") {
        const targetId = this._data.locationId || this._data.settlementId || this._data.regionId;
        const target = targetId ? game.journal?.get(targetId) : null;

        const journal = await JournalEntry.create(journalData);

        if (target && codexActive) {
          const targetCcData = target.getFlag("campaign-codex", "data") || {};
          const linkedNPCs = [...(targetCcData.linkedNPCs || [])];
          linkedNPCs.push(journal.uuid);
          await target.setFlag("campaign-codex", "data.linkedNPCs", linkedNPCs);

          const npcCcData = journal.getFlag("campaign-codex", "data") || {};
          const linkedLocations = [...(npcCcData.linkedLocations || [])];
          linkedLocations.push(target.uuid);
          await journal.setFlag("campaign-codex", "data.linkedLocations", linkedLocations);

          ui.notifications.info(
            game.i18n.format("LORE_FORGE.Notify.AddedToRegion", {
              name: journal.name,
              region: target.name
            })
          );

          this._clearDraft();
          if (autoOpen) target.sheet.render(true);
          this.close();
        } else {
          ui.notifications.info(
            game.i18n.format("LORE_FORGE.Notify.Created", { name: journal.name })
          );
          this._clearDraft();
          if (autoOpen) journal.sheet.render(true);
          this.close();
        }

      // --- Location/Settlement linking: parentRegion + Region.linkedLocations ---
      } else if (this._data.regionId && codexActive) {
        const region = game.journal?.get(this._data.regionId);

        if (region) {
          if (journalData.flags?.["campaign-codex"]?.data) {
            journalData.flags["campaign-codex"].data.parentRegion = region.uuid;
          }

          const journal = await JournalEntry.create(journalData);

          const regionCcData = region.getFlag("campaign-codex", "data") || {};
          const linkedLocations = [...(regionCcData.linkedLocations || [])];
          linkedLocations.push(journal.uuid);
          await region.setFlag("campaign-codex", "data.linkedLocations", linkedLocations);

          ui.notifications.info(
            game.i18n.format("LORE_FORGE.Notify.AddedToRegion", {
              name: journal.name,
              region: region.name
            })
          );

          this._clearDraft();
          if (autoOpen) region.sheet.render(true);
          this.close();
        } else {
          // Region was deleted — fallback to standalone
          const journal = await JournalEntry.create(journalData);
          ui.notifications.info(
            game.i18n.format("LORE_FORGE.Notify.Created", { name: journal.name })
          );
          this._clearDraft();
          if (autoOpen) journal.sheet.render(true);
          this.close();
        }

      // --- Standalone ---
      } else {
        const journal = await JournalEntry.create(journalData);

        ui.notifications.info(
          game.i18n.format("LORE_FORGE.Notify.Created", { name: journal.name })
        );

        this._clearDraft();
        if (autoOpen) journal.sheet.render(true);
        this.close();
      }
    } catch (err) {
      console.error("Lore Forge | Failed to create journal:", err);
      ui.notifications.error(game.i18n.localize("LORE_FORGE.Notify.CreateError"));
      if (forgeBtn) {
        forgeBtn.disabled = false;
        forgeBtn.innerHTML = `<i class="fas fa-feather-pointed"></i> ${game.i18n.localize("LORE_FORGE.Nav.Forge")}`;
      }
    }
  }
}
