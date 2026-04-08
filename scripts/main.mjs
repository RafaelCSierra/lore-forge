/**
 * Lore Forge - Main entry point.
 * Registers hooks to add the "Lore Forge" button to the Journal sidebar and scene controls.
 */

import KingdomWizard from "./kingdom-wizard.mjs";
import CharacterWizard from "./character-wizard.mjs";
import LocationWizard from "./location-wizard.mjs";
import SettlementWizard from "./settlement-wizard.mjs";
import LoreForgeDialog from "./lore-forge-dialog.mjs";
import WorldForgeImporter from "./world-forge-importer.mjs";

// Singleton instances
let kingdomWizardInstance = null;
let characterWizardInstance = null;
let locationWizardInstance = null;
let settlementWizardInstance = null;

function openKingdomWizard() {
  if (!kingdomWizardInstance) {
    kingdomWizardInstance = new KingdomWizard();
    kingdomWizardInstance.addEventListener("close", () => {
      kingdomWizardInstance = null;
    });
  }
  kingdomWizardInstance.render(true);
}

function openCharacterWizard() {
  if (!characterWizardInstance) {
    characterWizardInstance = new CharacterWizard();
    characterWizardInstance.addEventListener("close", () => {
      characterWizardInstance = null;
    });
  }
  characterWizardInstance.render(true);
}

function openLocationWizard() {
  if (!locationWizardInstance) {
    locationWizardInstance = new LocationWizard();
    locationWizardInstance.addEventListener("close", () => {
      locationWizardInstance = null;
    });
  }
  locationWizardInstance.render(true);
}

function openSettlementWizard() {
  if (!settlementWizardInstance) {
    settlementWizardInstance = new SettlementWizard();
    settlementWizardInstance.addEventListener("close", () => {
      settlementWizardInstance = null;
    });
  }
  settlementWizardInstance.render(true);
}

// Singleton WorldForge importer instance
let worldForgeImporterInstance = null;

function openWorldForgeImporter() {
  if (!worldForgeImporterInstance) {
    worldForgeImporterInstance = new WorldForgeImporter();
    worldForgeImporterInstance.addEventListener("close", () => {
      worldForgeImporterInstance = null;
    });
  }
  worldForgeImporterInstance.render(true);
}

// Singleton dialog instance
let loreForgeDialogInstance = null;

/**
 * Show the Lore Forge selection dialog.
 */
function openLoreForgeDialog() {
  if (!loreForgeDialogInstance) {
    loreForgeDialogInstance = new LoreForgeDialog({
      kingdom: openKingdomWizard,
      character: openCharacterWizard,
      location: openLocationWizard,
      settlement: openSettlementWizard,
      worldForge: openWorldForgeImporter
    });
    loreForgeDialogInstance.addEventListener("close", () => {
      loreForgeDialogInstance = null;
    });
  }
  loreForgeDialogInstance.render(true);
}

// --- Register module settings ---
Hooks.once("init", () => {
  game.settings.register("lore-forge", "campaignCodexIntegration", {
    name: game.i18n.localize("LORE_FORGE.Settings.CodexIntegration"),
    hint: game.i18n.localize("LORE_FORGE.Settings.CodexIntegrationHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("lore-forge", "autoOpenJournal", {
    name: game.i18n.localize("LORE_FORGE.Settings.AutoOpen"),
    hint: game.i18n.localize("LORE_FORGE.Settings.AutoOpenHint"),
    scope: "world",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register("lore-forge", "journalFolder", {
    name: game.i18n.localize("LORE_FORGE.Settings.JournalFolder"),
    hint: game.i18n.localize("LORE_FORGE.Settings.JournalFolderHint"),
    scope: "world",
    config: true,
    type: String,
    default: ""
  });

  loadTemplates([
    "modules/lore-forge/templates/kingdom/step-identity.hbs",
    "modules/lore-forge/templates/kingdom/step-geography.hbs",
    "modules/lore-forge/templates/kingdom/step-government.hbs",
    "modules/lore-forge/templates/kingdom/step-history.hbs",
    "modules/lore-forge/templates/kingdom/step-economy.hbs",
    "modules/lore-forge/templates/kingdom/step-military.hbs",
    "modules/lore-forge/templates/kingdom/step-magic.hbs",
    "modules/lore-forge/templates/kingdom/step-factions.hbs",
    "modules/lore-forge/templates/kingdom/step-review.hbs",
    "modules/lore-forge/templates/character/step-identity.hbs",
    "modules/lore-forge/templates/character/step-appearance.hbs",
    "modules/lore-forge/templates/character/step-personality.hbs",
    "modules/lore-forge/templates/character/step-abilities.hbs",
    "modules/lore-forge/templates/character/step-occupation.hbs",
    "modules/lore-forge/templates/character/step-background.hbs",
    "modules/lore-forge/templates/character/step-goals.hbs",
    "modules/lore-forge/templates/character/step-connections.hbs",
    "modules/lore-forge/templates/character/step-review.hbs",
    "modules/lore-forge/templates/location/step-identity.hbs",
    "modules/lore-forge/templates/location/step-details.hbs",
    "modules/lore-forge/templates/location/step-history.hbs",
    "modules/lore-forge/templates/location/step-layout.hbs",
    "modules/lore-forge/templates/location/step-encounters.hbs",
    "modules/lore-forge/templates/location/step-treasure.hbs",
    "modules/lore-forge/templates/location/step-hooks.hbs",
    "modules/lore-forge/templates/location/step-review.hbs",
    "modules/lore-forge/templates/settlement/step-identity.hbs",
    "modules/lore-forge/templates/settlement/step-geography.hbs",
    "modules/lore-forge/templates/settlement/step-history.hbs",
    "modules/lore-forge/templates/settlement/step-trade.hbs",
    "modules/lore-forge/templates/settlement/step-religion.hbs",
    "modules/lore-forge/templates/settlement/step-npcs.hbs",
    "modules/lore-forge/templates/settlement/step-hooks.hbs",
    "modules/lore-forge/templates/settlement/step-review.hbs"
  ]);
});

// --- Hook: Add button to Journal sidebar directory header ---
Hooks.on("renderJournalDirectory", (app, html, data) => {
  const headerActions = html.querySelector(".header-actions");
  if (!headerActions) return;

  const forgeBtn = document.createElement("button");
  forgeBtn.type = "button";
  forgeBtn.classList.add("lore-forge-sidebar-btn");
  forgeBtn.innerHTML = `<i class="fas fa-feather-pointed"></i> ${game.i18n.localize("LORE_FORGE.Button")}`;
  forgeBtn.dataset.tooltip = game.i18n.localize("LORE_FORGE.ButtonHint");
  forgeBtn.addEventListener("click", (ev) => {
    ev.preventDefault();
    openLoreForgeDialog();
  });

  headerActions.appendChild(forgeBtn);
});

// --- Hook: Add button to scene controls (left toolbar) ---
Hooks.on("getSceneControlButtons", (controls) => {
  const notesControls = controls.find(c => c.name === "notes");
  if (!notesControls) return;

  notesControls.tools.push({
    name: "lore-forge",
    title: "LORE_FORGE.ButtonHint",
    icon: "fas fa-feather-pointed",
    button: true,
    onClick: () => openLoreForgeDialog()
  });
});

// --- Log readiness + draft notification ---
Hooks.once("ready", () => {
  console.log("Lore Forge | Module loaded and ready.");

  // Check for pending drafts and notify once
  const draftKeys = [
    "lf-draft-lore-forge-kingdom-wizard",
    "lf-draft-lore-forge-character-wizard",
    "lf-draft-lore-forge-location-wizard",
    "lf-draft-lore-forge-settlement-wizard"
  ];
  const hasDrafts = draftKeys.some(k => localStorage.getItem(k));
  if (hasDrafts) {
    setTimeout(() => {
      ui.notifications.info(game.i18n.localize("LORE_FORGE.Notify.DraftPending"));
    }, 3000);
  }
});
