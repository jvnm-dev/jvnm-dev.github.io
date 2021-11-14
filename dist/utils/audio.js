import {Audios} from "../constants/assets.js";
export const getAudioConfig = (volume = 0.1, loop = true) => ({
  mute: false,
  volume,
  rate: 1,
  detune: 0,
  loop
});
export const playClick = (scene) => {
  scene.sound.play(Audios.CLICK, getAudioConfig(0.2, false));
};
