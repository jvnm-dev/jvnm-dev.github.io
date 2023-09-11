import create from "../../_snowpack/pkg/zustand.js";
import {devtools} from "../../_snowpack/pkg/zustand/middleware.js";
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
