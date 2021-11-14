import {PLAYER_SIZE} from "../constants/game.js";
import {Audios, Maps, Sprites} from "../constants/assets.js";
import {Tilesets} from "../constants/assets.js";
export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }
  preload() {
    this.loadImages();
    this.loadSpriteSheets();
    this.loadMaps();
  }
  create() {
    this.scene.start("Title");
    Object.values(Audios).forEach((audio) => {
      this.sound.add(audio);
    });
    this.sound.pauseOnBlur = false;
  }
  loadImages() {
    this.load.image("logo", "assets/images/ui/logo.png");
    this.load.image("title_background", "assets/images/ui/title_background.png");
    this.load.image("button1", "assets/images/ui/blue_button01.png");
    this.load.image("button2", "assets/images/ui/blue_button02.png");
    Object.values(Tilesets).forEach((tileset) => {
      this.load.image(tileset, `assets/images/tilesets/${tileset}.png`);
    });
    Object.values(Audios).forEach((audio) => {
      this.load.audio(audio, `assets/audio/${audio}.ogg`);
    });
  }
  loadMaps() {
    const maps = Object.values(Maps);
    for (const map of maps) {
      this.load.tilemapTiledJSON(map, `assets/maps/${map}.json`);
    }
  }
  loadSpriteSheets() {
    this.load.spritesheet(Sprites.PLAYER, "assets/images/characters/player.png", {
      frameWidth: PLAYER_SIZE,
      frameHeight: PLAYER_SIZE
    });
    this.load.spritesheet(Sprites.BICYCLE, "assets/images/characters/bicycle.png", {
      frameWidth: PLAYER_SIZE,
      frameHeight: PLAYER_SIZE
    });
  }
}
