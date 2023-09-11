import {Scene} from "../../_snowpack/pkg/phaser.js";
import {Audios} from "../constants/assets.js";
import {getAudioConfig, playClick} from "../utils/audio.js";
import UIButton from "../prefabs/UIButton.js";
export default class TitleScene extends Scene {
  constructor() {
    super("Title");
  }
  create() {
    const background = this.add.image(this.scale.width / 2, this.scale.height / 2, "title_background");
    const logo = this.add.image(this.scale.width / 2, this.scale.height / 2.5, "logo");
    logo.setScale(0.8);
    this.add.existing(background);
    this.add.existing(logo);
    this.startGameButton = new UIButton(this, this.scale.width / 2, this.scale.height / 1.5, "button1", "button2", "Play", () => {
      this.sound.stopAll();
      playClick(this);
      this.sound.play(Audios.MUSIC, getAudioConfig());
      this.scene.start("World");
    });
    this.sound.play(Audios.OPENING, getAudioConfig(0.3));
  }
}
