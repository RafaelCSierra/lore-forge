/**
 * Kingdom Wizard - A step-by-step kingdom/region creation assistant.
 * Extends LoreForgeWizard base class.
 */

import LoreForgeWizard from "./lore-forge-wizard.mjs";
import { buildKingdomJournal } from "./journal-builder.mjs";

const KINGDOM_TYPES = [
  { value: "kingdom",     label: "LORE_FORGE.Kingdom.Types.Kingdom" },
  { value: "empire",      label: "LORE_FORGE.Kingdom.Types.Empire" },
  { value: "city-state",  label: "LORE_FORGE.Kingdom.Types.CityState" },
  { value: "tribal-land", label: "LORE_FORGE.Kingdom.Types.TribalLand" },
  { value: "duchy",       label: "LORE_FORGE.Kingdom.Types.Duchy" },
  { value: "theocracy",   label: "LORE_FORGE.Kingdom.Types.Theocracy" },
  { value: "republic",    label: "LORE_FORGE.Kingdom.Types.Republic" },
  { value: "confederacy", label: "LORE_FORGE.Kingdom.Types.Confederacy" }
];

const TERRAINS = [
  { value: "plains",    label: "LORE_FORGE.Kingdom.Terrains.Plains" },
  { value: "mountains", label: "LORE_FORGE.Kingdom.Terrains.Mountains" },
  { value: "forest",    label: "LORE_FORGE.Kingdom.Terrains.Forest" },
  { value: "desert",    label: "LORE_FORGE.Kingdom.Terrains.Desert" },
  { value: "coastal",   label: "LORE_FORGE.Kingdom.Terrains.Coastal" },
  { value: "swamp",     label: "LORE_FORGE.Kingdom.Terrains.Swamp" },
  { value: "tundra",    label: "LORE_FORGE.Kingdom.Terrains.Tundra" },
  { value: "islands",   label: "LORE_FORGE.Kingdom.Terrains.Islands" },
  { value: "jungle",    label: "LORE_FORGE.Kingdom.Terrains.Jungle" },
  { value: "volcanic",  label: "LORE_FORGE.Kingdom.Terrains.Volcanic" }
];

const CLIMATES = [
  { value: "temperate",     label: "LORE_FORGE.Kingdom.Climates.Temperate" },
  { value: "tropical",      label: "LORE_FORGE.Kingdom.Climates.Tropical" },
  { value: "arid",          label: "LORE_FORGE.Kingdom.Climates.Arid" },
  { value: "arctic",        label: "LORE_FORGE.Kingdom.Climates.Arctic" },
  { value: "mediterranean", label: "LORE_FORGE.Kingdom.Climates.Mediterranean" },
  { value: "oceanic",       label: "LORE_FORGE.Kingdom.Climates.Oceanic" },
  { value: "continental",   label: "LORE_FORGE.Kingdom.Climates.Continental" },
  { value: "magical",       label: "LORE_FORGE.Kingdom.Climates.Magical" }
];

const GOV_TYPES = [
  { value: "monarchy",  label: "LORE_FORGE.Kingdom.GovTypes.Monarchy" },
  { value: "oligarchy", label: "LORE_FORGE.Kingdom.GovTypes.Oligarchy" },
  { value: "democracy", label: "LORE_FORGE.Kingdom.GovTypes.Democracy" },
  { value: "theocracy", label: "LORE_FORGE.Kingdom.GovTypes.Theocracy" },
  { value: "magocracy", label: "LORE_FORGE.Kingdom.GovTypes.Magocracy" },
  { value: "military",  label: "LORE_FORGE.Kingdom.GovTypes.Military" },
  { value: "tribal",    label: "LORE_FORGE.Kingdom.GovTypes.Tribal" },
  { value: "anarchy",   label: "LORE_FORGE.Kingdom.GovTypes.Anarchy" }
];

const WEALTH_LEVELS = [
  { value: "destitute",  label: "LORE_FORGE.Kingdom.WealthLevels.Destitute" },
  { value: "poor",       label: "LORE_FORGE.Kingdom.WealthLevels.Poor" },
  { value: "modest",     label: "LORE_FORGE.Kingdom.WealthLevels.Modest" },
  { value: "prosperous", label: "LORE_FORGE.Kingdom.WealthLevels.Prosperous" },
  { value: "wealthy",    label: "LORE_FORGE.Kingdom.WealthLevels.Wealthy" },
  { value: "opulent",    label: "LORE_FORGE.Kingdom.WealthLevels.Opulent" }
];

const STEPS = ["identity", "geography", "government", "history", "economy", "military", "magic", "factions", "review"];

export default class KingdomWizard extends LoreForgeWizard {

  constructor(options = {}) {
    super(options);
    this._data = {
      name: "",
      kingdomType: "kingdom",
      motto: "",
      terrain: "plains",
      climate: "temperate",
      landmarks: "",
      resources: "",
      govType: "monarchy",
      rulerName: "",
      rulerDesc: "",
      culture: "",
      socialStructure: "",
      // History
      foundingStory: "",
      historicalEvents: "",
      legends: "",
      historicalFigures: "",
      // Economy
      currency: "",
      industries: "",
      tradeRoutes: "",
      wealthLevel: "modest",
      // Military
      militaryForces: "",
      fortifications: "",
      militaryTraditions: "",
      externalThreats: "",
      // Magic & Faith
      religion: "",
      pantheon: "",
      religiousOrders: "",
      magicalInstitutions: "",
      arcaneLaws: "",
      // Factions
      faction1Name: "",
      faction1Goals: "",
      faction2Name: "",
      faction2Goals: "",
      faction3Name: "",
      faction3Goals: "",
      internalConflicts: "",
      externalConflicts: "",
      alliances: ""
    };
    this._initialData = { ...this._data };
    this._restoreDraft();
  }

  static DEFAULT_OPTIONS = {
    id: "lore-forge-kingdom-wizard",
    window: {
      title: "LORE_FORGE.Kingdom.Title"
    }
  };

  get stepLabels() {
    return [
      "LORE_FORGE.Kingdom.Steps.Identity",
      "LORE_FORGE.Kingdom.Steps.Geography",
      "LORE_FORGE.Kingdom.Steps.Government",
      "LORE_FORGE.Kingdom.Steps.History",
      "LORE_FORGE.Kingdom.Steps.Economy",
      "LORE_FORGE.Kingdom.Steps.Military",
      "LORE_FORGE.Kingdom.Steps.Magic",
      "LORE_FORGE.Kingdom.Steps.Factions",
      "LORE_FORGE.Kingdom.Steps.Review"
    ];
  }

  get templatePaths() {
    return [
      "modules/lore-forge/templates/kingdom/step-identity.hbs",
      "modules/lore-forge/templates/kingdom/step-geography.hbs",
      "modules/lore-forge/templates/kingdom/step-government.hbs",
      "modules/lore-forge/templates/kingdom/step-history.hbs",
      "modules/lore-forge/templates/kingdom/step-economy.hbs",
      "modules/lore-forge/templates/kingdom/step-military.hbs",
      "modules/lore-forge/templates/kingdom/step-magic.hbs",
      "modules/lore-forge/templates/kingdom/step-factions.hbs",
      "modules/lore-forge/templates/kingdom/step-review.hbs"
    ];
  }

  get steps() { return STEPS; }
  get inspirationCategory() { return "kingdom"; }

  _prepareContext(options) {
    return {
      data: this._data,
      kingdomTypes: KINGDOM_TYPES,
      terrains: TERRAINS,
      climates: CLIMATES,
      govTypes: GOV_TYPES,
      wealthLevels: WEALTH_LEVELS,
      kingdomTypeLabel: this._getLabel(KINGDOM_TYPES, this._data.kingdomType),
      terrainLabel: this._getLabel(TERRAINS, this._data.terrain),
      climateLabel: this._getLabel(CLIMATES, this._data.climate),
      govTypeLabel: this._getLabel(GOV_TYPES, this._data.govType),
      wealthLevelLabel: this._getLabel(WEALTH_LEVELS, this._data.wealthLevel),
      hasHistory: !!(this._data.foundingStory || this._data.historicalEvents || this._data.legends || this._data.historicalFigures),
      hasEconomy: !!(this._data.currency || this._data.industries || this._data.tradeRoutes),
      hasMilitary: !!(this._data.militaryForces || this._data.fortifications || this._data.militaryTraditions || this._data.externalThreats),
      hasMagic: !!(this._data.religion || this._data.pantheon || this._data.religiousOrders || this._data.magicalInstitutions || this._data.arcaneLaws),
      hasFactions: !!(this._data.faction1Name || this._data.faction2Name || this._data.faction3Name ||
                      this._data.internalConflicts || this._data.externalConflicts || this._data.alliances)
    };
  }

  _buildJournalData() {
    return buildKingdomJournal(this._data, {
      kingdomTypes: KINGDOM_TYPES,
      terrains: TERRAINS,
      climates: CLIMATES,
      govTypes: GOV_TYPES,
      wealthLevels: WEALTH_LEVELS
    });
  }
}
