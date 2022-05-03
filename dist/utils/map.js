import {useUserDataStore} from "../stores/userData.js";
import {Layers, Sprites} from "../constants/assets.js";
import {getSpawn} from "./object.js";
export const getCurrentPlayerTile = (scene) => {
  const {cameras, tilemap} = scene;
  const {x, y} = scene.gridEngine.getSprite(Sprites.PLAYER);
  const tile = tilemap.getTileAtWorldXY(x, y, true, cameras.main, Layers.WORLD);
  return {
    ...tile,
    x: tile.x + 1,
    y: tile.y + 1
  };
};
export const getStartPosition = (scene) => {
  const receivedData = scene.receivedData;
  const {startPosition: spawnPosition, facingDirection: spawnDirection} = getSpawn(scene);
  const position = useUserDataStore.getState().position;
  const facingDirection = receivedData?.facingDirection ?? position?.facingDirection ?? spawnDirection;
  if (receivedData?.startPosition?.x && receivedData?.startPosition?.y) {
    return {
      startPosition: {
        x: receivedData.startPosition.x,
        y: receivedData.startPosition.y
      },
      facingDirection
    };
  }
  if (position?.x && position?.y) {
    return {
      startPosition: {
        x: position.x,
        y: position.y
      },
      facingDirection
    };
  }
  return {
    startPosition: {
      x: spawnPosition.x,
      y: spawnPosition.y
    },
    facingDirection
  };
};
