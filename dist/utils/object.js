import {Audios, Layers, Objects, Sprites} from "../constants/assets.js";
import {TILE_SIZE} from "../constants/game.js";
import {getCurrentPlayerTile} from "./map.js";
import {getAudioConfig, playClick} from "./audio.js";
import {Direction} from "../../web_modules/grid-engine.js";
import {isDialogOpen, isUIOpen, toggleDialog} from "./ui.js";
export const findObjectByPosition = (scene, position) => {
  const {tilemap} = scene;
  const objects = tilemap.getObjectLayer(Layers.OBJECTS).objects.map((object) => ({
    ...object,
    x: ~~(object.x / TILE_SIZE),
    y: ~~(object.y / TILE_SIZE)
  }));
  return objects.find((object) => object.x === position.x && object.y === position.y);
};
export const getObjectUnderPlayer = (scene) => {
  const currentTile = getCurrentPlayerTile(scene);
  const playerPosition = {
    x: currentTile?.x,
    y: currentTile?.y
  };
  return findObjectByPosition(scene, playerPosition);
};
export const getObjectLookedAt = (scene) => {
  const currentTile = getCurrentPlayerTile(scene);
  const facingDirection = scene.gridEngine.getFacingDirection(Sprites.PLAYER);
  const lookingPosition = {
    x: currentTile?.x ?? 0,
    y: currentTile?.y ?? 0
  };
  if (facingDirection === Direction.DOWN) {
    lookingPosition.y += 1;
  } else if (facingDirection === Direction.UP) {
    lookingPosition.y -= 1;
  } else if (facingDirection === Direction.LEFT) {
    lookingPosition.x -= 1;
  } else if (facingDirection === Direction.RIGHT) {
    lookingPosition.x += 1;
  }
  return findObjectByPosition(scene, lookingPosition);
};
export const getTiledObjectProperty = (name, object) => {
  return object.properties?.find((property) => property.name === name)?.value;
};
export const getSpawn = (scene) => {
  const spawnPoint = scene.tilemap.findObject(Layers.OBJECTS, (obj) => obj.name === Objects.SPAWN);
  const facingDirection = spawnPoint.properties?.find(({name}) => name === "spriteDirection")?.value;
  return {
    startPosition: {
      x: Math.floor(spawnPoint.x / TILE_SIZE),
      y: Math.floor(spawnPoint.y / TILE_SIZE)
    },
    facingDirection
  };
};
export const handleObject = (scene, object) => {
  switch (object.name) {
    case Objects.DOOR:
      handleDoor(scene, object);
      break;
  }
};
export const handleDoor = (scene, door) => {
  const nextMap = getTiledObjectProperty("nextMap", door);
  const x = getTiledObjectProperty("x", door);
  const y = getTiledObjectProperty("y", door);
  scene.map = nextMap;
  scene.sound.play(Audios.DOOR, getAudioConfig(0.5, false));
  scene.scene.restart({startPosition: {x, y}});
};
export const handleBicycle = (scene) => {
  if (isDialogOpen()) {
    playClick(scene);
    return toggleDialog();
  }
  const mapProperties = scene.tilemap.properties;
  const isIndoor = mapProperties.find && mapProperties.find(({name}) => name === "indoor");
  if (isUIOpen()) {
    return;
  }
  if (isIndoor) {
    playClick(scene);
    toggleDialog("No bicycle inside!");
    return;
  }
  const onBicycle = scene.receivedData.onBicycle;
  if (!onBicycle) {
    scene.sound.play(Audios.BICYCLE, getAudioConfig(0.5, false));
  }
  const tile = getCurrentPlayerTile(scene);
  scene.scene.restart({
    startPosition: {
      x: tile.x,
      y: tile.y
    },
    onBicycle: !onBicycle,
    facingDirection: scene.gridEngine.getFacingDirection(Sprites.PLAYER)
  });
};
