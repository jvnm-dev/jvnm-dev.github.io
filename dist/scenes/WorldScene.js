import {Direction} from "../../web_modules/grid-engine.js";
import {GAME_HEIGHT, GAME_WIDTH} from "../constants/game.js";
import {Sprites, Layers, Tilesets, Maps} from "../constants/assets.js";
import {
  convertObjectPositionToTilePosition,
  getObjectUnderPlayer,
  handleBicycle,
  handleClickOnObject,
  handleOverlappableObject,
  removeObject
} from "../utils/object.js";
import {playClick} from "../utils/audio.js";
import {getCurrentPlayerTile, getStartPosition} from "../utils/map.js";
import {isUIOpen} from "../utils/ui.js";
import {useUserDataStore} from "../stores/userData.js";
export default class WorldScene extends Phaser.Scene {
  constructor() {
    super("World");
    this.map = Maps.MAP;
  }
  init(data) {
    this.receivedData = data;
  }
  create() {
    this.applyUserDataBeforeRender();
    this.initializeTilemap();
    this.initializePlayer();
    this.initializeCamera();
    this.initializeGrid();
    this.listenKeyboardControl();
    this.applyUserDataAfterRender();
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
      handleOverlappableObject(this, objectUnderPlayer);
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
          handleClickOnObject(this);
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
    const userData = useUserDataStore.getState();
    if (!this.gridEngine.isMoving(Sprites.PLAYER)) {
      const currentTile = getCurrentPlayerTile(this);
      if (currentTile && (userData.position?.x !== currentTile.x || userData.position?.y !== currentTile.y || userData.position?.map !== this.map)) {
        userData.setPosition({
          x: currentTile.x,
          y: currentTile.y,
          map: this.map
        });
      }
    }
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
  applyUserDataBeforeRender() {
    const position = useUserDataStore.getState().position;
    if (position?.map) {
      this.map = position.map;
    }
  }
  applyUserDataAfterRender() {
    const inventory = useUserDataStore.getState().inventory;
    const userItemIds = inventory.map(({objectId}) => objectId);
    this.tilemap.objects?.[0].objects.forEach((object) => {
      if (userItemIds.includes(object.id)) {
        removeObject(this, convertObjectPositionToTilePosition(object));
      }
    });
  }
}
