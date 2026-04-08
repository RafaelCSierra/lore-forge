/**
 * Character Wizard - A step-by-step narrative character creation assistant.
 * Extends LoreForgeWizard base class.
 */

import { NAME_DATABASE } from "./data/name-database.mjs";
import LoreForgeWizard from "./lore-forge-wizard.mjs";
import { buildCharacterJournal } from "./journal-builder.mjs";

// Culture definitions with icons for the UI grid — all D&D 5e
const CULTURES = [
  {
    key: "human", icon: "\u{1F3F0}", label: "LORE_FORGE.Character.Cultures.Human",
    subCultures: [
      { key: "calishite",  icon: "\u2604\uFE0F",  label: "LORE_FORGE.Character.SubCultures.Calishite" },
      { key: "chondathan", icon: "\u{1F3F0}", label: "LORE_FORGE.Character.SubCultures.Chondathan" },
      { key: "illuskan",   icon: "\u2693",    label: "LORE_FORGE.Character.SubCultures.Illuskan" },
      { key: "mulan",      icon: "\u{1F3DB}\uFE0F", label: "LORE_FORGE.Character.SubCultures.Mulan" },
      { key: "shou",       icon: "\u26E9\uFE0F",  label: "LORE_FORGE.Character.SubCultures.Shou" },
      { key: "turami",     icon: "\u2600\uFE0F",  label: "LORE_FORGE.Character.SubCultures.Turami" }
    ]
  },
  {
    key: "elven", icon: "\u{1F9DD}", label: "LORE_FORGE.Character.Cultures.Elven",
    subCultures: [
      { key: "highElf",  icon: "\u2728", label: "LORE_FORGE.Character.SubCultures.HighElf" },
      { key: "woodElf",  icon: "\u{1F333}", label: "LORE_FORGE.Character.SubCultures.WoodElf" },
      { key: "drow",     icon: "\u{1F311}", label: "LORE_FORGE.Character.SubCultures.Drow" },
      { key: "seaElf",   icon: "\u{1F30A}", label: "LORE_FORGE.Character.SubCultures.SeaElf" },
      { key: "eladrin",  icon: "\u{1F338}", label: "LORE_FORGE.Character.SubCultures.Eladrin" }
    ]
  },
  {
    key: "dwarven", icon: "\u26CF\uFE0F", label: "LORE_FORGE.Character.Cultures.Dwarven",
    subCultures: [
      { key: "hillDwarf",     icon: "\u{1F304}", label: "LORE_FORGE.Character.SubCultures.HillDwarf" },
      { key: "mountainDwarf", icon: "\u26F0\uFE0F",  label: "LORE_FORGE.Character.SubCultures.MountainDwarf" },
      { key: "duergar",       icon: "\u{1F5A4}", label: "LORE_FORGE.Character.SubCultures.Duergar" }
    ]
  },
  {
    key: "halfling", icon: "\u{1F463}", label: "LORE_FORGE.Character.Cultures.Halfling",
    subCultures: [
      { key: "lightfoot", icon: "\u{1F43E}", label: "LORE_FORGE.Character.SubCultures.Lightfoot" },
      { key: "stout",     icon: "\u{1F37A}", label: "LORE_FORGE.Character.SubCultures.Stout" }
    ]
  },
  {
    key: "gnome", icon: "\u{1F9D9}\u200D\u2642\uFE0F", label: "LORE_FORGE.Character.Cultures.Gnome",
    subCultures: [
      { key: "rockGnome",   icon: "\u2699\uFE0F",  label: "LORE_FORGE.Character.SubCultures.RockGnome" },
      { key: "forestGnome", icon: "\u{1F33F}", label: "LORE_FORGE.Character.SubCultures.ForestGnome" },
      { key: "deepGnome",   icon: "\u{1F48E}", label: "LORE_FORGE.Character.SubCultures.DeepGnome" }
    ]
  },
  {
    key: "orcish", icon: "\u{1F479}", label: "LORE_FORGE.Character.Cultures.Orcish",
    subCultures: [
      { key: "orc",     icon: "\u{1F4AA}", label: "LORE_FORGE.Character.SubCultures.Orc" },
      { key: "halfOrc", icon: "\u{1F91D}", label: "LORE_FORGE.Character.SubCultures.HalfOrc" }
    ]
  },
  {
    key: "draconic", icon: "\u{1F432}", label: "LORE_FORGE.Character.Cultures.Draconic",
    subCultures: [
      { key: "chromatic", icon: "\u{1F308}", label: "LORE_FORGE.Character.SubCultures.Chromatic" },
      { key: "metallic",  icon: "\u{1F31F}", label: "LORE_FORGE.Character.SubCultures.Metallic" },
      { key: "gem",       icon: "\u{1F48E}", label: "LORE_FORGE.Character.SubCultures.Gem" }
    ]
  },
  {
    key: "infernal", icon: "\u{1F525}", label: "LORE_FORGE.Character.Cultures.Infernal",
    subCultures: [
      { key: "asmodeus",       icon: "\u{1F451}", label: "LORE_FORGE.Character.SubCultures.Asmodeus" },
      { key: "mephistopheles", icon: "\u2744\uFE0F",  label: "LORE_FORGE.Character.SubCultures.Mephistopheles" },
      { key: "glasya",         icon: "\u{1F3AD}", label: "LORE_FORGE.Character.SubCultures.Glasya" }
    ]
  },
  {
    key: "genasi", icon: "\u{1F300}", label: "LORE_FORGE.Character.Cultures.Genasi",
    subCultures: [
      { key: "air",   icon: "\u{1F4A8}", label: "LORE_FORGE.Character.SubCultures.Air" },
      { key: "earth", icon: "\u{1FAA8}", label: "LORE_FORGE.Character.SubCultures.Earth" },
      { key: "fire",  icon: "\u{1F525}", label: "LORE_FORGE.Character.SubCultures.Fire" },
      { key: "water", icon: "\u{1F4A7}", label: "LORE_FORGE.Character.SubCultures.Water" }
    ]
  },
  {
    key: "goblinoid", icon: "\u{1F47A}", label: "LORE_FORGE.Character.Cultures.Goblinoid",
    subCultures: [
      { key: "goblin",    icon: "\u{1F47F}", label: "LORE_FORGE.Character.SubCultures.Goblin" },
      { key: "hobgoblin", icon: "\u{1F6E1}\uFE0F", label: "LORE_FORGE.Character.SubCultures.Hobgoblin" },
      { key: "bugbear",   icon: "\u{1F43B}", label: "LORE_FORGE.Character.SubCultures.Bugbear" }
    ]
  },
  { key: "goliath", icon: "\u26F0\uFE0F",  label: "LORE_FORGE.Character.Cultures.Goliath" },
  { key: "aasimar", icon: "\u{1F31F}", label: "LORE_FORGE.Character.Cultures.Aasimar" }
];

// Narrative role definitions
const NARRATIVE_ROLES = [
  { key: "villain",    icon: "\u{1F608}", label: "LORE_FORGE.Character.NarrativeRoles.Villain" },
  { key: "ally",       icon: "\u{1F91D}", label: "LORE_FORGE.Character.NarrativeRoles.Ally" },
  { key: "mentor",     icon: "\u{1F9D9}", label: "LORE_FORGE.Character.NarrativeRoles.Mentor" },
  { key: "rival",      icon: "\u2694\uFE0F",  label: "LORE_FORGE.Character.NarrativeRoles.Rival" },
  { key: "trickster",  icon: "\u{1F3AD}", label: "LORE_FORGE.Character.NarrativeRoles.Trickster" },
  { key: "herald",     icon: "\u{1F4E3}", label: "LORE_FORGE.Character.NarrativeRoles.Herald" },
  { key: "guardian",   icon: "\u{1F6E1}\uFE0F", label: "LORE_FORGE.Character.NarrativeRoles.Guardian" },
  { key: "questgiver", icon: "\u2757",    label: "LORE_FORGE.Character.NarrativeRoles.QuestGiver" },
  { key: "informant",  icon: "\u{1F441}\uFE0F", label: "LORE_FORGE.Character.NarrativeRoles.Informant" },
  { key: "wildcard",   icon: "\u{1F0CF}", label: "LORE_FORGE.Character.NarrativeRoles.WildCard" }
];

const STEPS = ["identity", "appearance", "personality", "abilities", "occupation", "background", "goals", "connections", "review"];

export default class CharacterWizard extends LoreForgeWizard {

  #nameSuggestions = [];
  #surnameSuggestions = [];

  constructor(options = {}) {
    super(options);
    this._data = {
      culture: "",
      subCulture: "",
      gender: "any",
      name: "",
      surname: "",

      regionId: "",
      settlementId: "",
      locationId: "",

      narrativeRole: "",
      physicalDesc: "",
      height: "",
      build: "",
      hairAndEyes: "",
      distinguishingMarks: "",
      clothingStyle: "",
      traits: "",
      mannerisms: "",
      voice: "",
      combatStyle: "",
      magicalAbilities: "",
      notableSkills: "",
      weaknesses: "",
      profession: "",
      dailyRoutine: "",
      workplace: "",
      keyPossessions: "",
      backstory: "",
      motivation: "",
      secret: "",
      fears: "",
      shortTermGoals: "",
      longTermGoals: "",
      moralDilemmas: "",
      internalConflicts: "",
      relation1Name: "",
      relation1Type: "",
      relation1Desc: "",
      relation2Name: "",
      relation2Type: "",
      relation2Desc: "",
      relation3Name: "",
      relation3Type: "",
      relation3Desc: "",
      narrativeArc: "",
      plotHooks: ""
    };
    this._initialData = { ...this._data };
    this._restoreDraft();
  }

  static DEFAULT_OPTIONS = {
    id: "lore-forge-character-wizard",
    position: {
      width: 620,
      height: 660
    },
    window: {
      title: "LORE_FORGE.Character.Title"
    },
    actions: {
      "select-culture": CharacterWizard.#onSelectCulture,
      "select-subculture": CharacterWizard.#onSelectSubCulture,
      "select-narrative-role": CharacterWizard.#onSelectNarrativeRole,
      "select-name": CharacterWizard.#onSelectName,
      "select-surname": CharacterWizard.#onSelectSurname,
      "randomize-names": CharacterWizard.#onRandomizeNames,
      "randomize-surnames": CharacterWizard.#onRandomizeSurnames
    }
  };

  get stepLabels() {
    return [
      "LORE_FORGE.Character.Steps.Identity",
      "LORE_FORGE.Character.Steps.Appearance",
      "LORE_FORGE.Character.Steps.Personality",
      "LORE_FORGE.Character.Steps.Abilities",
      "LORE_FORGE.Character.Steps.Occupation",
      "LORE_FORGE.Character.Steps.Background",
      "LORE_FORGE.Character.Steps.Goals",
      "LORE_FORGE.Character.Steps.Connections",
      "LORE_FORGE.Character.Steps.Review"
    ];
  }

  get templatePaths() {
    return [
      "modules/lore-forge/templates/character/step-identity.hbs",
      "modules/lore-forge/templates/character/step-appearance.hbs",
      "modules/lore-forge/templates/character/step-personality.hbs",
      "modules/lore-forge/templates/character/step-abilities.hbs",
      "modules/lore-forge/templates/character/step-occupation.hbs",
      "modules/lore-forge/templates/character/step-background.hbs",
      "modules/lore-forge/templates/character/step-goals.hbs",
      "modules/lore-forge/templates/character/step-connections.hbs",
      "modules/lore-forge/templates/character/step-review.hbs"
    ];
  }

  get steps() { return STEPS; }
  get inspirationCategory() { return "character"; }

  _prepareContext(options) {
    // Determine if current culture needs a sub-culture selection
    const cultureDef = CULTURES.find(c => c.key === this._data.culture);
    const needsSubCulture = !!(cultureDef?.subCultures);
    const canGenerateNames = this._data.culture && (!needsSubCulture || this._data.subCulture);

    // Generate name suggestions if we can
    if (canGenerateNames && this.#nameSuggestions.length === 0) {
      this.#generateNameSuggestions();
    }
    if (canGenerateNames && this.#surnameSuggestions.length === 0) {
      this.#generateSurnameSuggestions();
    }

    const fullName = this._data.surname
      ? `${this._data.name} ${this._data.surname}`
      : (this._data.name || "???");

    // Resolve culture label
    const cultureLabel = cultureDef ? game.i18n.localize(cultureDef.label) : "";

    // Resolve sub-culture label
    let subCultureLabel = "";
    if (cultureDef?.subCultures && this._data.subCulture) {
      const subDef = cultureDef.subCultures.find(s => s.key === this._data.subCulture);
      if (subDef) subCultureLabel = game.i18n.localize(subDef.label);
    }

    // --- Placement: regions, settlements, locations ---
    const regions = (game.journal ?? [])
      .filter(j => j.getFlag("lore-forge", "type") === "kingdom"
        || j.getFlag("campaign-codex", "type") === "region")
      .map(j => ({ id: j.id, name: j.name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const selectedRegion = regions.find(r => r.id === this._data.regionId);

    // Settlements filtered by selected kingdom
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

    // Locations filtered by selected kingdom (lore-forge type "location")
    let locations = [];
    if (this._data.regionId) {
      const region = game.journal?.get(this._data.regionId);
      if (region) {
        const regionUuid = region.uuid;
        locations = (game.journal ?? [])
          .filter(j => {
            const lfType = j.getFlag("lore-forge", "type");
            if (lfType && lfType !== "location") return false;
            if (!lfType && j.getFlag("campaign-codex", "type") !== "location") return false;
            const ccData = j.getFlag("campaign-codex", "data");
            return ccData?.parentRegion === regionUuid;
          })
          .map(j => ({ id: j.id, name: j.name }))
          .sort((a, b) => a.name.localeCompare(b.name));
      }
    }

    const selectedLocation = locations.find(l => l.id === this._data.locationId);

    return {
      data: this._data,
      cultures: CULTURES,
      selectedCulture: this._data.culture,
      selectedSubCulture: this._data.subCulture,
      needsSubCulture,
      subCultures: cultureDef?.subCultures || [],
      selectedGender: this._data.gender,
      selectedName: this._data.name,
      selectedSurname: this._data.surname,
      nameSuggestions: this.#nameSuggestions,
      surnameSuggestions: this.#surnameSuggestions,
      narrativeRoles: NARRATIVE_ROLES,
      selectedNarrativeRole: this._data.narrativeRole,
      fullName,
      cultureLabel,
      subCultureLabel,
      narrativeRoleLabel: this.#getNarrativeRoleLabel(),
      regions,
      settlements,
      locations,
      regionName: selectedRegion?.name ?? "",
      settlementName: selectedSettlement?.name ?? "",
      locationName: selectedLocation?.name ?? "",
      hasAppearance: !!(this._data.physicalDesc || this._data.height || this._data.build ||
                        this._data.hairAndEyes || this._data.distinguishingMarks || this._data.clothingStyle),
      hasPersonality: !!(this._data.traits || this._data.mannerisms || this._data.voice),
      hasAbilities: !!(this._data.combatStyle || this._data.magicalAbilities || this._data.notableSkills || this._data.weaknesses),
      hasOccupation: !!(this._data.profession || this._data.dailyRoutine || this._data.workplace || this._data.keyPossessions),
      hasBackground: !!(this._data.backstory || this._data.motivation || this._data.secret || this._data.fears),
      hasGoals: !!(this._data.shortTermGoals || this._data.longTermGoals || this._data.moralDilemmas || this._data.internalConflicts),
      hasConnections: !!(this._data.relation1Name || this._data.relation2Name || this._data.relation3Name ||
                         this._data.narrativeArc || this._data.plotHooks ||
                         this._data.regionId)
    };
  }

  #getNarrativeRoleLabel() {
    const r = NARRATIVE_ROLES.find(r => r.key === this._data.narrativeRole);
    return r ? game.i18n.localize(r.label) : "";
  }

  // --- Name Pool Resolution ---
  #getNamePool() {
    const culture = this._data.culture;
    if (!culture || !NAME_DATABASE[culture]) return null;

    const entry = NAME_DATABASE[culture];

    // Flat culture — has male/female directly
    if (entry.male) return entry;

    // Sub-culture culture — resolve nested
    const sub = this._data.subCulture;
    if (entry.subCultures && sub && entry.subCultures[sub]) {
      return entry.subCultures[sub];
    }

    return null;
  }

  // --- Name Generation ---
  #generateNameSuggestions() {
    const pool = this.#getNamePool();
    if (!pool) {
      this.#nameSuggestions = [];
      return;
    }
    const gender = this._data.gender;
    let names;
    if (gender === "male") names = pool.male;
    else if (gender === "female") names = pool.female;
    else names = [...pool.male, ...pool.female];

    const shuffled = [...names].sort(() => Math.random() - 0.5);
    this.#nameSuggestions = shuffled.slice(0, 6);
  }

  #generateSurnameSuggestions() {
    const pool = this.#getNamePool();
    if (!pool?.surnames) {
      this.#surnameSuggestions = [];
      return;
    }
    const shuffled = [...pool.surnames].sort(() => Math.random() - 0.5);
    this.#surnameSuggestions = shuffled.slice(0, 6);
  }

  // --- Data Capture (override for special identity fields) ---
  _captureCurrentStepData() {
    super._captureCurrentStepData();
    const html = this.element;
    if (!html) return;

    // Identity step has non-standard input names
    const genderInput = html.querySelector('input[name="gender"]:checked');
    if (genderInput) this._data.gender = genderInput.value;
    const nameInput = html.querySelector('input[name="charName"]');
    if (nameInput) this._data.name = nameInput.value;
    const surnameInput = html.querySelector('input[name="charSurname"]');
    if (surnameInput) this._data.surname = surnameInput.value;
  }

  // --- Validation (override for culture + name checks) ---
  _validateBeforeNext() {
    if (this._currentStep === 0) {
      if (!this._data.culture) {
        ui.notifications.warn(game.i18n.localize("LORE_FORGE.Notify.NoCulture"));
        return false;
      }
      const nameInput = this.element?.querySelector('input[name="charName"]');
      if (nameInput) this._data.name = nameInput.value;
      if (!this._data.name) {
        ui.notifications.warn(game.i18n.localize("LORE_FORGE.Notify.NoName"));
        return false;
      }
    }
    return true;
  }

  _buildJournalData() {
    return buildCharacterJournal(this._data, {
      narrativeRoles: NARRATIVE_ROLES,
      cultures: CULTURES
    });
  }

  // =========================================================================
  // Character-specific Actions
  // =========================================================================

  static #onSelectCulture(event, target) {
    const culture = target.dataset.culture;
    this._data.culture = culture;
    this._data.subCulture = "";
    this.#nameSuggestions = [];
    this.#surnameSuggestions = [];

    // Only auto-generate names if culture has no sub-cultures
    const cultureDef = CULTURES.find(c => c.key === culture);
    if (!cultureDef?.subCultures) {
      this.#generateNameSuggestions();
      this.#generateSurnameSuggestions();
    }

    this.render();
  }

  static #onSelectSubCulture(event, target) {
    this._data.subCulture = target.dataset.subculture;
    this.#nameSuggestions = [];
    this.#surnameSuggestions = [];
    this.#generateNameSuggestions();
    this.#generateSurnameSuggestions();
    this.render();
  }

  static #onSelectNarrativeRole(event, target) {
    const role = target.dataset.role;
    this._data.narrativeRole = role;
    this.render();
  }

  static #onSelectName(event, target) {
    this._data.name = target.dataset.name;
    this.render();
  }

  static #onSelectSurname(event, target) {
    this._data.surname = target.dataset.surname;
    this.render();
  }

  static #onRandomizeNames(event, target) {
    this._captureCurrentStepData();
    this.#generateNameSuggestions();
    this._data.name = "";
    this.render();
  }

  static #onRandomizeSurnames(event, target) {
    this._captureCurrentStepData();
    this.#generateSurnameSuggestions();
    this._data.surname = "";
    this.render();
  }
}
