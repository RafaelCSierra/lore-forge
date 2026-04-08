/**
 * Settlement Wizard - A step-by-step settlement creation assistant.
 * Extends LoreForgeWizard base class.
 */

import LoreForgeWizard from "./lore-forge-wizard.mjs";
import { buildSettlementJournal } from "./journal-builder.mjs";

const SETTLEMENT_SIZES = [
  { value: "village",    label: "LORE_FORGE.Settlement.Sizes.Village" },
  { value: "town",       label: "LORE_FORGE.Settlement.Sizes.Town" },
  { value: "city",       label: "LORE_FORGE.Settlement.Sizes.City" },
  { value: "metropolis", label: "LORE_FORGE.Settlement.Sizes.Metropolis" }
];

/** Number of district slots shown for each settlement size. */
const DISTRICTS_PER_SIZE = {
  village: 1,
  town: 2,
  city: 3,
  metropolis: 5
};

/** Population options (sorted by size, user picks the one that fits). */
const POPULATION_OPTIONS = [
  { value: "~50 souls, mostly farming families",                                    label: "~50 souls, mostly farming families" },
  { value: "~120 residents, tight-knit and suspicious of outsiders",                label: "~120 residents, tight-knit and suspicious of outsiders" },
  { value: "~200, but it was once home to ten times that before the calamity",      label: "~200, but it was once home to ten times that" },
  { value: "~300 people, a mix of races living in relative harmony",                label: "~300 people, a mix of races living in harmony" },
  { value: "~500 inhabitants, growing rapidly due to recent prosperity",            label: "~500 inhabitants, growing rapidly" },
  { value: "~800 permanent residents plus hundreds of transient merchants",         label: "~800 permanent residents + transient merchants" },
  { value: "~1,000 citizens, large enough for distinct neighborhoods",              label: "~1,000 citizens, distinct neighborhoods" },
  { value: "~2,500 people, a bustling hub of regional trade",                       label: "~2,500 people, bustling trade hub" },
  { value: "~3,000 above ground, but rumored tunnels house many more below",        label: "~3,000 above ground, more below" },
  { value: "~5,000 residents, with a visible class divide between districts",       label: "~5,000 residents, visible class divide" },
  { value: "~10,000 citizens, requiring organized governance and infrastructure",   label: "~10,000 citizens, organized governance" },
  { value: "~25,000 inhabitants, a major regional power with diverse population",   label: "~25,000 inhabitants, major regional power" },
  { value: "~50,000 souls, a thriving metropolis with influence across the realm",  label: "~50,000 souls, thriving metropolis" },
  { value: "~100,000 people, one of the largest cities in the known world",         label: "~100,000 people, one of the largest cities" }
];

const MAX_DISTRICTS = 5;

const STEPS = ["identity", "geography", "history", "trade", "religion", "npcs", "hooks", "review"];

export { SETTLEMENT_SIZES };

export default class SettlementWizard extends LoreForgeWizard {

  constructor(options = {}) {
    super(options);
    this._data = {
      name: "",
      settlementSize: "village",
      regionId: "",
      population: "",
      leaderName: "",
      leaderDesc: "",
      district1Name: "",
      district1Desc: "",
      district2Name: "",
      district2Desc: "",
      district3Name: "",
      district3Desc: "",
      district4Name: "",
      district4Desc: "",
      district5Name: "",
      district5Desc: "",
      landmarks: "",
      defenses: "",
      founding: "",
      customs: "",
      localLaws: "",
      festivals: "",
      market: "",
      settlTradeRoutes: "",
      notableBuildings: "",
      infrastructure: "",
      temples: "",
      guilds: "",
      organizations: "",
      criminalGroups: "",
      npc1Name: "",
      npc1Role: "",
      npc1Desc: "",
      npc2Name: "",
      npc2Role: "",
      npc2Desc: "",
      npc3Name: "",
      npc3Role: "",
      npc3Desc: "",
      economy: "",
      culture: "",
      rumors: "",
      plotHooks: ""
    };
    this._initialData = { ...this._data };
    this._restoreDraft();
  }

  static DEFAULT_OPTIONS = {
    id: "lore-forge-settlement-wizard",
    window: {
      title: "LORE_FORGE.Settlement.Title"
    }
  };

  get stepLabels() {
    return [
      "LORE_FORGE.Settlement.Steps.Identity",
      "LORE_FORGE.Settlement.Steps.Geography",
      "LORE_FORGE.Settlement.Steps.History",
      "LORE_FORGE.Settlement.Steps.Trade",
      "LORE_FORGE.Settlement.Steps.Religion",
      "LORE_FORGE.Settlement.Steps.NPCs",
      "LORE_FORGE.Settlement.Steps.Hooks",
      "LORE_FORGE.Settlement.Steps.Review"
    ];
  }

  get templatePaths() {
    return [
      "modules/lore-forge/templates/settlement/step-identity.hbs",
      "modules/lore-forge/templates/settlement/step-geography.hbs",
      "modules/lore-forge/templates/settlement/step-history.hbs",
      "modules/lore-forge/templates/settlement/step-trade.hbs",
      "modules/lore-forge/templates/settlement/step-religion.hbs",
      "modules/lore-forge/templates/settlement/step-npcs.hbs",
      "modules/lore-forge/templates/settlement/step-hooks.hbs",
      "modules/lore-forge/templates/settlement/step-review.hbs"
    ];
  }

  get steps() { return STEPS; }
  get inspirationCategory() { return "settlement"; }

  _prepareContext(options) {
    const size = this._data.settlementSize;
    const maxDistricts = DISTRICTS_PER_SIZE[size] ?? 1;

    // Collect filled districts (up to maxDistricts) for the review
    const districts = [];
    for (let i = 1; i <= maxDistricts; i++) {
      if (this._data[`district${i}Name`]) {
        districts.push({
          name: this._data[`district${i}Name`],
          desc: this._data[`district${i}Desc`]
        });
      }
    }

    const regions = (game.journal ?? [])
      .filter(j => j.getFlag("lore-forge", "type") === "kingdom"
        || j.getFlag("campaign-codex", "type") === "region")
      .map(j => ({ id: j.id, name: j.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const selectedRegion = regions.find(r => r.id === this._data.regionId);

    return {
      data: this._data,
      settlementSizes: SETTLEMENT_SIZES,
      populationOptions: POPULATION_OPTIONS,
      regions,
      regionName: selectedRegion?.name ?? "",
      maxDistricts,
      showDistrict1: maxDistricts >= 1,
      showDistrict2: maxDistricts >= 2,
      showDistrict3: maxDistricts >= 3,
      showDistrict4: maxDistricts >= 4,
      showDistrict5: maxDistricts >= 5,
      settlementSizeLabel: this._getLabel(SETTLEMENT_SIZES, size),
      districts,
      hasGeography: !!(districts.length > 0 || this._data.landmarks || this._data.defenses),
      hasHistory: !!(this._data.founding || this._data.customs || this._data.localLaws || this._data.festivals),
      hasTrade: !!(this._data.market || this._data.settlTradeRoutes || this._data.notableBuildings || this._data.infrastructure),
      hasReligion: !!(this._data.temples || this._data.guilds || this._data.organizations || this._data.criminalGroups),
      hasNPCs: !!(this._data.npc1Name || this._data.npc2Name || this._data.npc3Name),
      npcs: [
        { name: this._data.npc1Name, role: this._data.npc1Role, desc: this._data.npc1Desc },
        { name: this._data.npc2Name, role: this._data.npc2Role, desc: this._data.npc2Desc },
        { name: this._data.npc3Name, role: this._data.npc3Role, desc: this._data.npc3Desc }
      ].filter(n => n.name),
      hasSociety: !!(this._data.economy || this._data.culture || this._data.rumors || this._data.plotHooks)
    };
  }

  /**
   * Clear district data for slots beyond the current max.
   * Called when leaving identity step to avoid stale data in hidden slots.
   */
  _afterStepLeave() {
    if (this._currentStep === 0) {
      const max = DISTRICTS_PER_SIZE[this._data.settlementSize] ?? 1;
      for (let i = max + 1; i <= MAX_DISTRICTS; i++) {
        this._data[`district${i}Name`] = "";
        this._data[`district${i}Desc`] = "";
      }
    }
  }

  _buildJournalData() {
    return buildSettlementJournal(this._data, {
      settlementSizes: SETTLEMENT_SIZES,
      maxDistricts: DISTRICTS_PER_SIZE[this._data.settlementSize] ?? 1
    });
  }
}
