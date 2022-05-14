import create from "../../web_modules/zustand.js";
import {devtools} from "../../web_modules/zustand/middleware.js";
export const useUIStore = create()(devtools((set) => ({
  dialog: {
    isOpen: false,
    content: ""
  },
  menu: {
    isOpen: false
  },
  battle: {
    isOpen: false
  },
  toggleDialog: (content) => set((state) => ({
    dialog: {
      isOpen: !state.dialog.isOpen,
      content
    }
  })),
  closeDialog: () => set(() => ({dialog: {isOpen: false, content: void 0}})),
  toggleMenu: () => set((state) => ({
    menu: {
      isOpen: !state.menu.isOpen
    }
  })),
  toggleBattle: () => set((state) => ({
    battle: {
      isOpen: !state.battle.isOpen
    }
  }))
})));
