import {useUIStore} from "../stores/ui.js";
export const isUIOpen = () => {
  return isDialogOpen();
};
export const isDialogOpen = () => {
  return useUIStore.getState().dialog.isOpen;
};
export const toggleDialog = (content) => {
  return useUIStore.getState().toggleDialog(content);
};
