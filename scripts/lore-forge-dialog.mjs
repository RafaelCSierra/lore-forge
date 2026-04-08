/**
 * LoreForgeDialog — A styled 2x2 selection dialog for choosing which wizard to open.
 * Replaces the simple Dialog with an ApplicationV2 grid of cards.
 */

const { ApplicationV2 } = foundry.applications.api;

const WIZARD_DEFS = [
  {
    key: "kingdom",
    icon: "fas fa-crown",
    titleKey: "LORE_FORGE.Dialog.Kingdom",
    descKey: "LORE_FORGE.Dialog.KingdomDesc",
    draftKey: "lf-draft-lore-forge-kingdom-wizard"
  },
  {
    key: "character",
    icon: "fas fa-user-pen",
    titleKey: "LORE_FORGE.Dialog.Character",
    descKey: "LORE_FORGE.Dialog.CharacterDesc",
    draftKey: "lf-draft-lore-forge-character-wizard"
  },
  {
    key: "location",
    icon: "fas fa-map-pin",
    titleKey: "LORE_FORGE.Dialog.Location",
    descKey: "LORE_FORGE.Dialog.LocationDesc",
    draftKey: "lf-draft-lore-forge-location-wizard"
  },
  {
    key: "settlement",
    icon: "fas fa-city",
    titleKey: "LORE_FORGE.Dialog.Settlement",
    descKey: "LORE_FORGE.Dialog.SettlementDesc",
    draftKey: "lf-draft-lore-forge-settlement-wizard"
  },
  {
    key: "worldForge",
    icon: "fas fa-file-import",
    titleKey: "LORE_FORGE.Dialog.WorldForge",
    descKey: "LORE_FORGE.Dialog.WorldForgeDesc",
    draftKey: null
  }
];

export default class LoreForgeDialog extends ApplicationV2 {

  #openers = {};

  constructor(openers, options = {}) {
    super(options);
    this.#openers = openers;
  }

  static DEFAULT_OPTIONS = {
    id: "lore-forge-dialog",
    classes: ["lore-forge-dialog"],
    tag: "div",
    window: {
      title: "LORE_FORGE.Title",
      resizable: false
    },
    position: {
      width: 560,
      height: "auto"
    },
    actions: {
      "open-wizard": LoreForgeDialog.#onOpenWizard
    }
  };

  async _renderHTML(context, options) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("lf-dialog-body");

    const prompt = document.createElement("p");
    prompt.classList.add("lf-dialog-prompt");
    prompt.textContent = game.i18n.localize("LORE_FORGE.Dialog.Prompt");
    wrapper.appendChild(prompt);

    const grid = document.createElement("div");
    grid.classList.add("lf-dialog-grid");

    for (const def of WIZARD_DEFS) {
      const card = document.createElement("button");
      card.type = "button";
      card.classList.add("lf-dialog-card");
      card.dataset.action = "open-wizard";
      card.dataset.wizard = def.key;

      const hasDraft = !!localStorage.getItem(def.draftKey);

      card.innerHTML = `
        <i class="${def.icon} lf-dialog-card-icon"></i>
        <span class="lf-dialog-card-title">${game.i18n.localize(def.titleKey)}</span>
        <span class="lf-dialog-card-desc">${game.i18n.localize(def.descKey)}</span>
        ${hasDraft ? `<span class="lf-dialog-draft-badge" title="${game.i18n.localize("LORE_FORGE.DraftPending")}"><i class="fas fa-pencil"></i></span>` : ""}
      `;

      grid.appendChild(card);
    }

    wrapper.appendChild(grid);
    return { wrapper };
  }

  _replaceHTML(result, content, options) {
    content.replaceChildren(result.wrapper);
  }

  static #onOpenWizard(event, target) {
    const wizard = target.closest("[data-wizard]")?.dataset.wizard;
    if (!wizard) return;
    const opener = this.#openers[wizard];
    if (opener) {
      opener();
      this.close();
    }
  }
}
