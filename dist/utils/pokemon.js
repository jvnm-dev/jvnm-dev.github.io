import zones from "../constants/zones.json.proxy.js";
import pokemons from "../constants/pokemons.json.proxy.js";
import {getRandomNumber} from "./number.js";
export const getRandomPokemonFromZone = (zoneId) => {
  const zone = zones.find(({id}) => id === zoneId);
  if (!zone) {
    throw new Error(`Zone ${zoneId} not found`);
  }
  const zonePokemons = zone.pokemons;
  const highestProbability = 100 - zonePokemons.reduce((acc, {chance}) => acc + chance, 0);
  const probability = zonePokemons.map(({chance}, pokemonIndex2) => Array(chance === 0 ? highestProbability : chance).fill(pokemonIndex2)).reduce((c, v) => c.concat(v), []);
  const pokemonIndex = getRandomNumber(0, probability.length - 1);
  const pokemonId = zonePokemons[probability[pokemonIndex]]?.id;
  if (highestProbability < 0) {
    throw new Error(`Zone ${zoneId} pokemons rarity sum is higher than 100 !`);
  }
  return pokemons.find(({id}) => id === pokemonId);
};
