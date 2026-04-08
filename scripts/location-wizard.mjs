/**
 * Location Wizard - A step-by-step location creation assistant.
 * Extends LoreForgeWizard base class.
 */

import LoreForgeWizard from "./lore-forge-wizard.mjs";
import { buildLocationJournal } from "./journal-builder.mjs";

const LOCATION_TYPES = [
  { value: "tavern",     label: "LORE_FORGE.Location.Types.Tavern" },
  { value: "shop",       label: "LORE_FORGE.Location.Types.Shop" },
  { value: "dungeon",    label: "LORE_FORGE.Location.Types.Dungeon" },
  { value: "temple",     label: "LORE_FORGE.Location.Types.Temple" },
  { value: "guild",      label: "LORE_FORGE.Location.Types.Guild" },
  { value: "library",    label: "LORE_FORGE.Location.Types.Library" },
  { value: "stronghold", label: "LORE_FORGE.Location.Types.Stronghold" },
  { value: "arena",      label: "LORE_FORGE.Location.Types.Arena" },
  { value: "tower",      label: "LORE_FORGE.Location.Types.Tower" },
  { value: "port",       label: "LORE_FORGE.Location.Types.Port" },
  { value: "cemetery",   label: "LORE_FORGE.Location.Types.Cemetery" },
  { value: "other",      label: "LORE_FORGE.Location.Types.Other" }
];

const STEPS = ["identity", "details", "history", "layout", "encounters", "treasure", "hooks", "review"];

export { LOCATION_TYPES };

export default class LocationWizard extends LoreForgeWizard {

  constructor(options = {}) {
    super(options);
    this._data = {
      name: "",
      locationType: "tavern",
      regionId: "",
      settlementId: "",
      ownerName: "",
      ownerDesc: "",
      description: "",
      atmosphere: "",
      notableFeatures: "",
      goodsServices: "",
      dangers: "",
      origin: "",
      pastEvents: "",
      locationLegends: "",
      spatialDesc: "",
      room1Name: "",
      room1Desc: "",
      room2Name: "",
      room2Desc: "",
      room3Name: "",
      room3Desc: "",
      encounters: "",
      recurringEvents: "",
      randomEncounters: "",
      notableItems: "",
      hiddenTreasure: "",
      stock: "",
      rumors: "",
      secrets: "",
      plotHooks: ""
    };
    this._initialData = { ...this._data };
    this._restoreDraft();
  }

  static DEFAULT_OPTIONS = {
    id: "lore-forge-location-wizard",
    window: {
      title: "LORE_FORGE.Location.Title"
    }
  };

  get stepLabels() {
    return [
      "LORE_FORGE.Location.Steps.Identity",
      "LORE_FORGE.Location.Steps.Details",
      "LORE_FORGE.Location.Steps.History",
      "LORE_FORGE.Location.Steps.Layout",
      "LORE_FORGE.Location.Steps.Encounters",
      "LORE_FORGE.Location.Steps.Treasure",
      "LORE_FORGE.Location.Steps.Hooks",
      "LORE_FORGE.Location.Steps.Review"
    ];
  }

  get templatePaths() {
    return [
      "modules/lore-forge/templates/location/step-identity.hbs",
      "modules/lore-forge/templates/location/step-details.hbs",
      "modules/lore-forge/templates/location/step-history.hbs",
      "modules/lore-forge/templates/location/step-layout.hbs",
      "modules/lore-forge/templates/location/step-encounters.hbs",
      "modules/lore-forge/templates/location/step-treasure.hbs",
      "modules/lore-forge/templates/location/step-hooks.hbs",
      "modules/lore-forge/templates/location/step-review.hbs"
    ];
  }

  get steps() { return STEPS; }
  get inspirationCategory() { return "location"; }

  _prepareContext(options) {
    const regions = (game.journal ?? [])
      .filter(j => j.getFlag("lore-forge", "type") === "kingdom"
        || j.getFlag("campaign-codex", "type") === "region")
      .map(j => ({ id: j.id, name: j.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const selectedRegion = regions.find(r => r.id === this._data.regionId);

    // Query settlements filtered by the selected kingdom
    let settlements = [];
    if (this._data.regionId) {
      const region = game.journal?.get(this._data.regionId);
      if (region) {
        const regionUuid = region.uuid;
        settlements = (game.journal ?? [])
          .filter(j => {
            const lfType = j.getFlag("lore-forge", "type");
            if (lfType && lfType !== "settlement") return false;
            if (!lfType && j.getFlag("campaign-codex", "type") !== "location") return false;
            const ccData = j.getFlag("campaign-codex", "data");
            return ccData?.parentRegion === regionUuid;
          })
          .map(j => ({ id: j.id, name: j.name }))
          .sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    const selectedSettlement = settlements.find(s => s.id === this._data.settlementId);

    // Collect filled rooms for the review
    const rooms = [
      { name: this._data.room1Name, desc: this._data.room1Desc },
      { name: this._data.room2Name, desc: this._data.room2Desc },
      { name: this._data.room3Name, desc: this._data.room3Desc }
    ].filter(r => r.name);

    return {
      data: this._data,
      locationTypes: LOCATION_TYPES,
      regions,
      settlements,
      regionName: selectedRegion?.name ?? "",
      settlementName: selectedSettlement?.name ?? "",
      locationTypeLabel: this._getLabel(LOCATION_TYPES, this._data.locationType),
      hasDetails: !!(this._data.description || this._data.atmosphere || this._data.notableFeatures ||
                     this._data.goodsServices || this._data.dangers),
      hasHistory: !!(this._data.origin || this._data.pastEvents || this._data.locationLegends),
      hasLayout: !!(this._data.spatialDesc || rooms.length > 0),
      rooms,
      hasEncounters: !!(this._data.encounters || this._data.recurringEvents || this._data.randomEncounters),
      hasTreasure: !!(this._data.notableItems || this._data.hiddenTreasure || this._data.stock),
      hasHooks: !!(this._data.rumors || this._data.secrets || this._data.plotHooks)
    };
  }

  _buildJournalData() {
    return buildLocationJournal(this._data, {
      locationTypes: LOCATION_TYPES
    });
  }
}
