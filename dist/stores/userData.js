import create from "../../web_modules/zustand.js";
import {persist, devtools} from "../../web_modules/zustand/middleware.js";
export const useUserDataStore = create(devtools(persist((set) => ({
  inventory: [],
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
  name: "inventory"
})));
