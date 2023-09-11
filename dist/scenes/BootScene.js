import {Scene} from "../../_snowpack/pkg/phaser.js";
import {PLAYER_SIZE} from "../constants/game.js";
import {Audios, Maps, Sprites} from "../constants/assets.js";
import {Tilesets} from "../constants/assets.js";
import {useUserDataStore} from "../stores/userData.js";
export default class BootScene extends Scene {
  constructor() {
    super("Boot");
  }
  preload() {
    const progressBar = this.add.graphics({
      x: this.scale.width / 5.5,
      y: this.scale.height / 5.5
    });
    const progressBox = this.add.graphics({
      x: this.scale.width / 5.5,
      y: this.scale.height / 5.5
    });
    progressBox.fillStyle(2236962, 0.8);
    progressBox.fillRect(240, 270, 320, 50);
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: "Loading...",
      style: {
        font: "20px monospace",
        color: "#ffffff"
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    const percentText = this.make.text({
      x: width / 2,
      y: height / 2 - 5,
      text: "0%",
      style: {
        font: "18px monospace",
        color: "#ffffff"
      }
    });
    percentText.setOrigin(0.5, 0.5);
    this.load.on("progress", function(value) {
      percentText.setText(`${(Number(value) * 100).toFixed(0)}%`);
      progressBar.clear();
      progressBar.fillStyle(16777215, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });
    this.load.on("complete", function() {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      percentText.destroy();
    });
    this.loadImages();
    this.loadSpriteSheets();
    this.loadMaps();
  }
  create() {
    const userSettings = useUserDataStore.getState().settings;
    const startScene = userSettings.general.skipIntroScreen ? "World" : "Title";
    this.scene.start(startScene);
    Object.values(Audios).forEach((audio) => {
      this.sound.add(audio);
    });
    this.sound.pauseOnBlur = false;
    this.sound.mute = !userSettings.general.enableSound;
  }
  loadImages() {
    this.load.image("logo", "assets/images/ui/logo.png");
    this.load.image("button1", "assets/images/ui/blue_button01.png");
    this.load.image("button2", "assets/images/ui/blue_button02.png");
    this.load.image("title_background", "assets/images/ui/title_background.png");
    this.load.image("battle_background", "assets/images/ui/bb_background.png");
    this.load.image("battle_grass", "assets/images/ui/bb_grass.png");
    this.load.image("trainer_back", "assets/images/battle/trainer.png");
    Array.from({length: 151}, (_, i) => {
      this.load.image(`pokemon_${i + 1}_front`, `assets/images/pokemons/front/${i + 1}.png`);
      this.load.image(`pokemon_${i + 1}_front_shiny`, `assets/images/pokemons/front/shiny/${i + 1}.png`);
    });
    Array.from({length: 151}, (_, i) => {
      this.load.image(`pokemon_${i + 1}_back`, `assets/images/pokemons/back/${i + 1}.png`);
      this.load.image(`pokemon_${i + 1}_back_shiny`, `assets/images/pokemons/back/shiny/${i + 1}.png`);
    });
    Object.values(Tilesets).forEach((tileset) => {
      this.load.image(tileset, `assets/images/tilesets/${tileset}.png`);
    });
    Object.values(Audios).forEach((audio) => {
      this.load.audio(audio, `assets/audio/${audio}.ogg`);
    });
    this.load.image("object_pokeball", "assets/images/objects/pokeball.png");
    this.load.image("object_star", "assets/images/objects/star.png");
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
    this.load.spritesheet(Sprites.CHEN, "assets/images/characters/chen.png", {
      frameWidth: PLAYER_SIZE,
      frameHeight: PLAYER_SIZE
    });
  }
}
