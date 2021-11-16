import {Audios, Layers, Objects, Sprites} from "../constants/assets.js";
import {TILE_SIZE} from "../constants/game.js";
import {getCurrentPlayerTile} from "./map.js";
import {getAudioConfig, playClick} from "./audio.js";
import {Direction} from "../../web_modules/grid-engine.js";
import {
  isDialogOpen,
  isUIOpen,
  openDialog,
  triggerDialogNextStep
} from "./ui.js";
import {useUserDataStore} from "../stores/userData.js";
export const convertObjectPositionToTilePosition = (object) => ({
  ...object,
  x: ~~(object.x / TILE_SIZE),
  y: ~~(object.y / TILE_SIZE)
});
export const findObjectByPosition = (scene, position) => {
  const {tilemap} = scene;
  const objects = tilemap.getObjectLayer(Layers.OBJECTS).objects.map((object) => convertObjectPositionToTilePosition(object));
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
export const removeObject = (scene, object) => {
  const removeTile = (layer) => scene.tilemap.removeTileAt(object.x, object.y, false, false, layer);
  let removedTile = removeTile(Layers.WORLD2);
  if (removedTile?.index === -1) {
    removedTile = removeTile(Layers.WORLD);
  }
  const objectLayer = scene.tilemap.objects[0];
  const objects = objectLayer.objects;
  const filteredObjects = objects.filter(({id}) => id !== object.id);
  objectLayer.objects = filteredObjects;
  scene.tilemap.objects = [objectLayer];
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
export const handleClickOnObject = (scene) => {
  if (isDialogOpen()) {
    playClick(scene);
    return triggerDialogNextStep();
  }
  const object = getObjectLookedAt(scene);
  if (object) {
    playClick(scene);
    switch (object.name) {
      case Objects.DIALOG:
        handleDialogObject(object);
        break;
      case Objects.POKEBALL:
        handlePokeball(scene, object);
    }
  }
};
export const handleOverlappableObject = (scene, object) => {
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
export const handleDialogObject = (dialog) => {
  const content = dialog.properties.find(({name}) => name === "content")?.value;
  if (content) {
    openDialog(content);
  }
};
export const handlePokeball = (scene, pokeball) => {
  const pokemonInside = pokeball.properties.find(({name}) => name === "pokemon_inside")?.value;
  removeObject(scene, pokeball);
  useUserDataStore.getState().addObjectToInventory(pokeball.id);
  if (pokemonInside) {
    scene.sound.play(Audios.GAIN, getAudioConfig(0.1, false));
    openDialog(`You found a <span class="gain">${pokemonInside}</span> inside this pokeball!`);
  }
};
export const handleBicycle = (scene) => {
  if (isDialogOpen()) {
    playClick(scene);
    return triggerDialogNextStep();
  }
  const mapProperties = scene.tilemap.properties;
  const isIndoor = mapProperties.find && mapProperties.find(({name}) => name === "indoor");
  if (isUIOpen()) {
    return;
  }
  if (isIndoor) {
    playClick(scene);
    openDialog("No bicycle inside!");
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
