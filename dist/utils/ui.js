import {UIEvents} from "../constants/events.js";
import {useUIStore} from "../stores/ui.js";
export const isUIOpen = () => {
  return isDialogOpen() || isMenuOpen();
};
export const isDialogOpen = () => {
  return useUIStore.getState().dialog.isOpen;
};
export const isMenuOpen = () => {
  return useUIStore.getState().menu.isOpen;
};
export const openDialog = (content) => {
  return useUIStore.getState().toggleDialog(content);
};
export const openMenu = () => {
  return useUIStore.getState().toggleMenu();
};
export const triggerUINextStep = () => {
  window.dispatchEvent(new Event(UIEvents.NEXT_STEP));
};
export const triggerUIDown = () => {
  window.dispatchEvent(new Event(UIEvents.DOWN));
};
export const triggerUIUp = () => {
  window.dispatchEvent(new Event(UIEvents.UP));
};
