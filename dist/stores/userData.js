import create from "../../web_modules/zustand.js";
import {persist, devtools} from "../../web_modules/zustand/middleware.js";
export const useUserDataStore = create()(devtools(persist((set) => ({
  update: (updates) => {
    set((state) => ({
      ...state,
      ...updates
    }));
  },
  onBicycle: Boolean(false),
  inventory: [],
  pokemons: [],
  settings: {
    general: {
      enableSound: Boolean(true),
      skipIntroScreen: Boolean(false)
    }
  },
  addPokemon: (id) => {
    const uniqId = Date.now();
    set((state) => ({
      ...state,
      pokemons: [
        ...state.pokemons,
        {
          id,
          uniqId
        }
      ]
    }));
  },
  addObjectToInventory: (objectId) => {
    set((state) => ({
      ...state,
      inventory: [
        ...state.inventory,
        {
          objectId
        }
      ]
    }));
  }
}), {
  name: "userData"
})));
