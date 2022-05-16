import {playClick} from "../utils/audio.js";
import {useUIStore} from "../stores/ui.js";
import {
  triggerUINextStep,
  triggerUIExit,
  triggerUIDown,
  triggerUIUp,
  triggerUILeft,
  triggerUIRight
} from "../utils/ui.js";
import {useUserDataStore} from "../stores/userData.js";
import {getRandomNumber} from "../utils/number.js";
export default class BattleScene extends Phaser.Scene {
  constructor() {
    super("Battle");
    this.ennemyPokemon = {};
    this.isShiny = false;
  }
  init(data) {
    this.ennemyPokemon.data = data.pokemon;
    this.isShiny = getRandomNumber(0, 1024) === 0;
  }
  create() {
    const background = this.add.image(this.scale.width / 2, this.scale.height / 2, "battle_background");
    background.displayHeight = Number(this.game.config.height);
    background.scaleX = this.game.scale.canvas.width;
    background.y = Number(this.game.config.height) / 2;
    background.x = Number(this.game.config.width) / 2;
    const grass = this.add.image(this.scale.width / 2, this.scale.height / 2, "battle_grass");
    grass.displayHeight = Number(this.game.config.height);
    grass.scaleX = grass.scaleY;
    grass.y = Number(this.game.config.height) / 2;
    grass.x = Number(this.game.config.width) / 2;
    this.trainerBack = this.add.image(this.scale.width / 2, this.scale.height / 2, "trainer_back");
    this.trainerBack.displayHeight = Number(this.game.config.height) / 4;
    this.trainerBack.scaleX = this.trainerBack.scaleY;
    this.trainerBack.y = Number(this.game.config.height) / 1.9;
    this.trainerBack.x = 0;
    this.ennemyPokemon.image = this.add.image(this.scale.width / 2, this.scale.height / 2, `pokemon_${this.ennemyPokemon.data.id}_front${this.isShiny ? "_shiny" : ""}`);
    this.ennemyPokemon.image.displayHeight = Number(this.game.config.height) / 4;
    this.ennemyPokemon.image.scaleX = this.ennemyPokemon.image.scaleY;
    this.ennemyPokemon.image.y = Number(this.game.config.height) / 3.5;
    this.ennemyPokemon.image.x = Number(this.game.config.width);
    this.ennemyPokemon.image.tint = 4473924;
    const positionTransitionDelay = 1e3;
    this.tweens.add({
      targets: this.trainerBack,
      x: Number(this.game.config.width) / 2.8,
      duration: 1e3
    });
    this.tweens.add({
      targets: this.ennemyPokemon.image,
      x: Number(this.game.config.width) / 1.52,
      duration: 1e3
    });
    this.add.existing(background);
    this.add.existing(grass);
    this.add.existing(this.trainerBack);
    this.add.existing(this.ennemyPokemon.image);
    useUIStore.getState().toggleBattle();
    this.time.delayedCall(positionTransitionDelay, () => {
      if (this.ennemyPokemon.image) {
        this.ennemyPokemon.image.setDepth(99);
        this.ennemyPokemon.image.tint = 16777215;
        if (this.isShiny) {
          const zoneLimit = new Phaser.Geom.Circle(0, 0, Number(this.game.config.height));
          const stars = this.add.particles("object_star");
          stars.setScale(0.1);
          stars.setPosition(Number(this.game.config.width) / 1.5, Number(this.game.config.height) / 4);
          stars.createEmitter({
            maxParticles: 4,
            x: this.ennemyPokemon.image.x / (this.ennemyPokemon.image.width / 2),
            y: this.ennemyPokemon.image.y / (this.ennemyPokemon.image.height / 2),
            scale: {start: 0.8, end: 0},
            lifespan: 500,
            frequency: 250,
            speed: 200,
            gravityY: -50,
            angle: {min: 180, max: 360},
            emitZone: {type: "random", source: zoneLimit}
          });
          this.time.delayedCall(1500, () => {
            stars.destroy();
          });
        }
      }
    });
    const playerGoBackOutOfScreenDelay = positionTransitionDelay + 500;
    this.tweens.add({
      targets: this.trainerBack,
      x: -50,
      duration: 1e3,
      delay: playerGoBackOutOfScreenDelay
    });
    const pokeball = this.add.image(-50, Number(this.game.config.height) / 1.6, "object_pokeball");
    pokeball.setScale(2.5);
    this.add.existing(pokeball);
    const pokemonGoInDelay1 = playerGoBackOutOfScreenDelay + 1e3;
    this.tweens.add({
      targets: pokeball,
      x: Number(this.game.config.width) / 3,
      y: Number(this.game.config.height) / 1.8,
      duration: 500,
      delay: pokemonGoInDelay1
    });
    const pokemonGoInDelay2 = pokemonGoInDelay1 + 500;
    this.tweens.add({
      targets: pokeball,
      x: Number(this.game.config.width) / 3,
      y: Number(this.game.config.height) / 1.5,
      duration: 250,
      delay: pokemonGoInDelay2
    });
    const userData = useUserDataStore.getState();
    const firstPokemonInTeam = userData.pokemons?.[0]?.id;
    this.pokemonFromTeam = this.add.image(this.scale.width / 2, this.scale.height / 2, `pokemon_${firstPokemonInTeam}_back`);
    this.pokemonFromTeam.displayHeight = Number(this.game.config.height) / 5;
    this.pokemonFromTeam.scaleX = this.pokemonFromTeam.scaleY;
    this.pokemonFromTeam.y = Number(this.game.config.height);
    this.pokemonFromTeam.x = Number(this.game.config.width) / 2.9;
    const pokemonFromTeamAppearsDelay = pokemonGoInDelay2 + 250;
    this.tweens.add({
      targets: this.pokemonFromTeam,
      y: Number(this.game.config.height) / 1.8,
      duration: 250,
      delay: pokemonFromTeamAppearsDelay
    });
    this.time.delayedCall(pokemonFromTeamAppearsDelay, () => {
      this.listenKeyboardControl();
    });
  }
  listenKeyboardControl() {
    this.input.keyboard.on("keyup", (event) => {
      const uiStore = useUIStore.getState();
      const isOpen = uiStore.battle.isOpen;
      switch (event.key.toUpperCase()) {
        case "ENTER":
          if (isOpen) {
            playClick(this);
            triggerUINextStep();
          }
          break;
        case "ESCAPE":
          if (isOpen) {
            playClick(this);
            triggerUIExit();
          }
          break;
        case "ARROWDOWN":
          if (isOpen) {
            playClick(this);
            triggerUIDown();
          }
          break;
        case "ARROWUP":
          if (isOpen) {
            playClick(this);
            triggerUIUp();
          }
          break;
        case "ARROWLEFT":
          if (isOpen) {
            playClick(this);
            triggerUILeft();
          }
          break;
        case "ARROWRIGHT":
          if (isOpen) {
            playClick(this);
            triggerUIRight();
          }
          break;
      }
    });
  }
}
