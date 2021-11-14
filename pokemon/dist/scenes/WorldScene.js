import {Direction} from "../../web_modules/grid-engine.js";
import {GAME_HEIGHT, GAME_WIDTH} from "../constants/game.js";
import {Sprites, Layers, Tilesets, Maps} from "../constants/assets.js";
import {
  getObjectLookedAt,
  getObjectUnderPlayer,
  handleBicycle,
  handleObject
} from "../utils/object.js";
import {playClick} from "../utils/audio.js";
import {getStartPosition} from "../utils/map.js";
import {isDialogOpen, isUIOpen, toggleDialog} from "../utils/ui.js";
export default class WorldScene extends Phaser.Scene {
  constructor() {
    super("World");
    this.map = Maps.MAP;
  }
  init(data) {
    this.receivedData = data;
  }
  create() {
    this.initializeTilemap();
    this.initializePlayer();
    this.initializeCamera();
    this.initializeGrid();
    this.listenKeyboardControl();
  }
  update() {
    if (isUIOpen()) {
      return;
    }
    this.listenMoves();
    this.handleObjectsOverlap();
  }
  initializeTilemap() {
    this.tilemap = this.make.tilemap({key: this.map});
    const all_tilesets = Object.values(Tilesets).map((tileset) => {
      if (this.tilemap.tilesets.find(({name}) => name === tileset)) {
        return this.tilemap.addTilesetImage(tileset);
      }
    }).filter(Boolean);
    Object.values(Layers).filter((layer) => layer !== Layers.OBJECTS).forEach((layer) => {
      this.tilemap.createLayer(layer, all_tilesets);
    });
  }
  handleObjectsOverlap() {
    const objectUnderPlayer = getObjectUnderPlayer(this);
    if (objectUnderPlayer) {
      handleObject(this, objectUnderPlayer);
    }
  }
  initializePlayer() {
    const player = this.add.sprite(0, 0, Sprites.PLAYER);
    const bicycle = this.add.sprite(0, 0, Sprites.BICYCLE);
    this.currentSprite = this.receivedData.onBicycle ? bicycle : player;
    this.speed = this.receivedData.onBicycle ? 10 : 5;
    this.currentSprite.setOrigin(0.5, 0.5);
    this.currentSprite.setDepth(1);
    this.currentSprite.setScale(1.25);
    [player, bicycle].forEach((sprite) => {
      if (sprite.texture.key !== this.currentSprite.texture.key) {
        sprite.destroy();
      }
    });
  }
  initializeGrid() {
    const {startPosition, facingDirection} = getStartPosition(this);
    const gridEngineConfig = {
      collisionTilePropertyName: "collides",
      characters: [
        {
          id: Sprites.PLAYER,
          sprite: this.currentSprite,
          walkingAnimationMapping: 0,
          startPosition,
          charLayer: Layers.WORLD2,
          facingDirection,
          speed: this.speed
        }
      ]
    };
    this.gridEngine.create(this.tilemap, gridEngineConfig);
  }
  initializeCamera() {
    this.cameras.roundPixels = true;
    this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.currentSprite, true);
    this.cameras.main.setFollowOffset(-this.currentSprite.width, -this.currentSprite.height);
  }
  listenKeyboardControl() {
    this.input.keyboard.on("keyup", (event) => {
      switch (event.key.toUpperCase()) {
        case "M":
          this.sound.mute = !this.sound.mute;
          break;
        case "E":
          if (isDialogOpen()) {
            playClick(this);
            return toggleDialog();
          }
          const object = getObjectLookedAt(this);
          if (object) {
            playClick(this);
            if (object.name === "dialog") {
              const content = object.properties.find(({name}) => name === "content")?.value;
              if (content) {
                toggleDialog(content);
              }
            }
          }
          break;
        case "ESCAPE":
          playClick(this);
          break;
        case " ":
          handleBicycle(this);
          break;
      }
    });
  }
  listenMoves() {
    const cursors = this.input.keyboard.createCursorKeys();
    const keys = this.input.keyboard.addKeys("W,S,A,D");
    if (cursors.left.isDown || keys.A.isDown) {
      this.gridEngine.move(Sprites.PLAYER, Direction.LEFT);
    } else if (cursors.right.isDown || keys.D.isDown) {
      this.gridEngine.move(Sprites.PLAYER, Direction.RIGHT);
    } else if (cursors.up.isDown || keys.W.isDown) {
      this.gridEngine.move(Sprites.PLAYER, Direction.UP);
    } else if (cursors.down.isDown || keys.S.isDown) {
      this.gridEngine.move(Sprites.PLAYER, Direction.DOWN);
    }
    setTimeout(() => {
      this.input.on("pointerup", (pointer) => {
        const getTile = (x, y, layer) => {
          return this.tilemap.getTileAtWorldXY(x, y, true, this.cameras.main, layer);
        };
        const tileWorld = getTile(pointer.worldX, pointer.worldY, Layers.WORLD);
        const tileWorld2 = getTile(pointer.worldX, pointer.worldY, Layers.WORLD2);
        const targetX = tileWorld.x ?? tileWorld2.x ?? 0;
        const targetY = tileWorld.y ?? tileWorld2.y ?? 0;
        const targetCollides = tileWorld.properties.collides ?? tileWorld2.properties.collides;
        if (!targetCollides) {
          this.gridEngine.setPosition("player", {
            x: targetX,
            y: targetY
          });
        }
      }, this);
    }, 500);
  }
}
