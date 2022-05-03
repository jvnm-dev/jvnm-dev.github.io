import create from "../../web_modules/zustand.js";
export const useUIStore = create((set) => ({
  dialog: {
    isOpen: false,
    content: ""
  },
  menu: {
    isOpen: false
  },
  toggleDialog: (content) => set((state) => ({
    dialog: {
      isOpen: !state.dialog.isOpen,
      content
    }
  })),
  toggleMenu: () => set((state) => ({
    menu: {
      isOpen: !state.menu.isOpen
    }
  }))
}));
