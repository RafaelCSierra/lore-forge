/**
 * Journal Query Utilities — Shared helpers for querying
 * Lore Forge journal entries.
 */

/**
 * Query all regions (kingdoms) from the journal.
 * Reads lore-forge flags with fallback to campaign-codex for migrated worlds.
 * @returns {{id: string, name: string}[]} Sorted by name
 */
export function queryRegions() {
  return (game.journal ?? [])
    .filter(j => j.getFlag("lore-forge", "type") === "kingdom"
      || j.getFlag("campaign-codex", "type") === "region")
    .map(j => ({ id: j.id, name: j.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Query journals that are children of a given region.
 * Reads lore-forge.parentRegion with fallback to campaign-codex for compat.
 * @param {string} regionId - The parent region's journal ID
 * @param {string} loreForgeType - The lore-forge type to filter ("settlement" or "location")
 * @returns {{id: string, name: string}[]} Sorted by name
 */
export function queryChildrenByRegion(regionId, loreForgeType) {
  if (!regionId) return [];
  const region = game.journal?.get(regionId);
  if (!region) return [];

  const regionUuid = region.uuid;
  return (game.journal ?? [])
    .filter(j => {
      const lfType = j.getFlag("lore-forge", "type");
      if (lfType && lfType !== loreForgeType) return false;
      if (!lfType && j.getFlag("campaign-codex", "type") !== "location") return false;

      // Check lore-forge flag first, then CC fallback
      const lfParent = j.getFlag("lore-forge", "parentRegion");
      if (lfParent) return lfParent === regionUuid;
      const ccData = j.getFlag("campaign-codex", "data");
      return ccData?.parentRegion === regionUuid;
    })
    .map(j => ({ id: j.id, name: j.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
