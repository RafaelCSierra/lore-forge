/**
 * Inspiration Engine — provides random inspiration from data banks.
 */

import { KINGDOM_INSPIRATION } from "./data/kingdom-inspiration.mjs";
import { CHARACTER_INSPIRATION } from "./data/character-inspiration.mjs";
import { LOCATION_INSPIRATION } from "./data/location-inspiration.mjs";
import { SETTLEMENT_INSPIRATION } from "./data/settlement-inspiration.mjs";

const BANKS = {
  kingdom: KINGDOM_INSPIRATION,
  character: CHARACTER_INSPIRATION,
  location: LOCATION_INSPIRATION,
  settlement: SETTLEMENT_INSPIRATION
};

/** Tracks last pick per "category:field" to avoid immediate repeats. */
const _lastPick = new Map();

/**
 * Pick a random element from an array, trying to avoid the last pick.
 */
function pickRandom(arr, key) {
  if (!arr || arr.length === 0) return "";
  if (arr.length === 1) return arr[0];

  const last = _lastPick.get(key);
  for (let attempt = 0; attempt < 3; attempt++) {
    const pick = arr[Math.floor(Math.random() * arr.length)];
    if (pick !== last || attempt === 2) {
      _lastPick.set(key, pick);
      return pick;
    }
  }
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Get a random inspiration string for a given category and field.
 * @param {"kingdom"|"character"|"location"|"settlement"} category
 * @param {string} field - Key in the inspiration data object
 * @returns {string}
 */
export function getInspiration(category, field) {
  const bank = BANKS[category];
  if (!bank || !bank[field]) return "";
  return pickRandom(bank[field], `${category}:${field}`);
}
