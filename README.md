# Lore Forge

A **Foundry VTT v13** module for **D&D 5e** that provides guided step-by-step wizards to help Game Masters craft rich campaign lore — kingdoms, characters, locations, and settlements — and import content from [World Forge](https://www.worldforge.io/). All output is saved as beautifully formatted Journal Entries with optional [Campaign Codex](https://foundryvtt.com/packages/campaign-codex) integration.

## Features

### Lore Creation Wizards

Four dedicated wizards walk you through building detailed lore, one step at a time:

| Wizard | Steps | What You Create |
|--------|-------|-----------------|
| **Kingdom** | 9 steps | Kingdoms, empires, duchies, theocracies, and other realms — covering identity, geography, government, history, economy, military, magic, and factions |
| **Character** | 9 steps | Narrative NPCs with culture-aware name generation (D&D 5e races), appearance, personality, abilities, occupation, background, goals, and connections |
| **Location** | 8 steps | Taverns, dungeons, temples, shops, strongholds and more — with layout details, encounters, treasure, and adventure hooks |
| **Settlement** | 8 steps | Villages to metropolises with scalable districts, geography, history, trade, religion, notable NPCs, and plot hooks |

Each wizard includes:

- **Inspire Button** — fills empty fields with random, thematic content from built-in inspiration tables
- **Draft Auto-Save** — progress is saved to localStorage automatically, so you never lose work if you close the window
- **Draft Notifications** — on world load, you're reminded if any wizard has a pending draft
- **Step Navigation** — freely jump between steps, go back and forth, or review everything before forging
- **One-Click Forge** — creates a formatted Journal Entry with structured HTML (two-column wiki layout, info boxes, secret GM blocks)

### World Forge Importer

Import your [World Forge](https://www.worldforge.io/) JSON exports directly into Foundry VTT:

- **10 entity types supported**: Characters, Locations, Civilizations, Factions, Sessions, Items, Deities, Events, Quests, and Stories
- **3-step flow**: Load JSON file, preview and select what to import, see results with progress bar
- **Smart folder organization**: entities with Campaign Codex mappings go into CC folders; others get organized subfolders under your campaign folder
- **Overwrite detection**: re-importing updates existing journals instead of creating duplicates (matched by entity ID)
- **Relationship resolution**: entity cross-references display readable names instead of raw IDs

### Campaign Codex Integration

When [Campaign Codex](https://foundryvtt.com/packages/campaign-codex) is installed, journals are automatically tagged with the correct CC flags and sheet types:

| Source | CC Type | CC Sheet |
|--------|---------|----------|
| Characters / Character Wizard | NPC | NPCSheet |
| Locations / Location Wizard | Location | LocationSheet |
| Civilizations, Factions / Kingdom Wizard | Region | RegionSheet |
| Events | Entry/Shop | ShopSheet |
| Settlements | Location | LocationSheet |

CC flags are always set regardless of whether Campaign Codex is installed — they're harmless without it and ready when you add it.

## Installation

### Manual Installation

1. In Foundry VTT, go to **Add-on Modules** > **Install Module**
2. Paste the following manifest URL:
   ```
   https://github.com/RafaelCSierra/lore-forge/releases/latest/download/module.json
   ```
3. Click **Install**

### Alternative: Direct Download

1. Download or clone this repository into your Foundry VTT `Data/modules/` directory:
   ```
   git clone https://github.com/RafaelCSierra/lore-forge.git
   ```
2. Restart Foundry VTT
3. Enable **Lore Forge** in your world's module settings

## Usage

Open Lore Forge from either:

- The **Journal sidebar** — click the **Lore Forge** button in the header
- The **Scene controls** toolbar — click the feather icon under Notes

This opens a selection dialog with five cards:

1. **Kingdom** — create a kingdom or region
2. **Character** — create a narrative NPC
3. **Location** — create a point of interest
4. **Settlement** — create a village, town, city, or metropolis
5. **World Forge Import** — import a World Forge JSON export

Cards with pending drafts show a pencil badge so you can pick up where you left off.

## Module Settings

| Setting | Default | Description |
|---------|---------|-------------|
| Campaign Codex Integration | On | Add Campaign Codex flags and sheet assignments to created journals |
| Auto-Open Journal | On | Automatically open the Journal sidebar after creating or importing entries |
| Journal Folder | _(empty)_ | Default folder name for wizard-created journals |

## Localization

Lore Forge ships with full localization for:

- **English** (en)
- **Portuguese - Brazil** (pt-BR)

## Compatibility

- **Foundry VTT**: v13+
- **D&D 5e System**: 4.0+
- **Campaign Codex**: Optional — works with or without it

## License

This project is provided as-is for use with Foundry VTT.
