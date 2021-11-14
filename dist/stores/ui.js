import create from "../../web_modules/zustand.js";
export const useUIStore = create((set) => ({
  dialog: {
    isOpen: false,
    content: ""
  },
  toggleDialog: (content) => set((state) => ({
    dialog: {
      isOpen: !state.dialog.isOpen,
      content
    }
  }))
}));
