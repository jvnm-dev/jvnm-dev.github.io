import {DialogEvents} from "../constants/events.js";
import {useUIStore} from "../stores/ui.js";
export const isUIOpen = () => {
  return isDialogOpen();
};
export const isDialogOpen = () => {
  return useUIStore.getState().dialog.isOpen;
};
export const openDialog = (content) => {
  return useUIStore.getState().toggleDialog(content);
};
export const triggerDialogNextStep = () => {
  window.dispatchEvent(new Event(DialogEvents.NEXT_STEP));
};
