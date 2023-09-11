import {Audios, Layers, Objects, Sprites} from "../constants/assets.js";
import {TILE_SIZE} from "../constants/game.js";
import {getCurrentPlayerTile} from "./map.js";
import {getAudioConfig, playClick} from "./audio.js";
import {Direction} from "../../_snowpack/pkg/grid-engine.js";
import {isDialogOpen, isUIOpen, openDialog, triggerUINextStep} from "./ui.js";
import {useUserDataStore} from "../stores/userData.js";
import {getRandomNumber} from "./number.js";
import pokemons from "../constants/pokemons.json.proxy.js";
import {getRandomPokemonFromZone} from "./pokemon.js";
export const convertObjectPositionToTilePosition = (object) => ({
  ...object,
  x: ~~((object?.x ?? 0) / TILE_SIZE),
  y: ~~((object?.y ?? 0) / TILE_SIZE)
});
export const findObjectByPosition = (scene, position) => {
  const {tilemap} = scene;
  const objects = tilemap.getObjectLayer(Layers.OBJECTS)?.objects.map((object) => convertObjectPositionToTilePosition(object));
  return objects?.find((object) => object.x === position.x && object.y === position.y);
};
export const getObjectUnderPlayer = (scene) => {
  const currentTile = getCurrentPlayerTile(scene);
  if (!currentTile) {
    return;
  }
  const playerPosition = {
    x: currentTile?.x,
    y: currentTile?.y
  };
  return findObjectByPosition(scene, playerPosition);
};
export const getObjectLookedAt = (scene) => {
  const currentTile = getCurrentPlayerTile(scene);
  const facingDirection = scene.gridEngine.getFacingDirection(Sprites.PLAYER);
  let lookingPosition = {
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
  const removeTile = (layer) => {
    if (object.x && object.y) {
      return scene.tilemap.removeTileAt(object.x, object.y, false, false, layer);
    }
  };
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
  if (spawnPoint?.x && spawnPoint?.y) {
    const facingDirection = spawnPoint.properties?.find((property) => property.name === "spriteDirection")?.value;
    return {
      startPosition: {
        x: Math.floor(spawnPoint.x / TILE_SIZE),
        y: Math.floor(spawnPoint.y / TILE_SIZE)
      },
      facingDirection
    };
  } else {
    console.error("No spawn point set or no position detected");
  }
};
export const handleClickOnObjectIfAny = (scene) => {
  const object = getObjectLookedAt(scene);
  if (object) {
    playClick(scene);
    switch (object.name) {
      case Objects.DIALOG:
        handleDialogObject(object);
        break;
      case Objects.POKEBALL:
        handlePokeball(scene, object);
        break;
      case Objects.NPC:
        handleNPC(scene, object);
        break;
    }
  }
};
export const handleOverlappableObject = (scene, object) => {
  switch (object.name) {
    case Objects.DOOR:
      handleDoor(scene, object);
      break;
    case Objects.GRASS:
      handleMoveOnGrass(scene, object);
      break;
  }
};
export const handleDoor = (scene, door) => {
  const userData = useUserDataStore.getState();
  const nextMap = getTiledObjectProperty("nextMap", door);
  const x = getTiledObjectProperty("x", door);
  const y = getTiledObjectProperty("y", door);
  userData.update({
    position: {
      x,
      y,
      map: nextMap,
      facingDirection: scene.gridEngine.getFacingDirection(Sprites.PLAYER)
    },
    onBicycle: false
  });
  scene.map = nextMap;
  scene.sound.play(Audios.DOOR, getAudioConfig(0.5, false));
  scene.scene.restart({startPosition: {x, y}});
};
export const handleMoveOnGrass = (scene, grass) => {
  const min = 0;
  const max = 10;
  const userData = useUserDataStore.getState();
  const randomNumber = getRandomNumber(min, max);
  if (grass.x && grass.y) {
    const realX = grass.x * 48;
    const realY = grass.y * 48;
    const tile = scene.tilemap.getTileAtWorldXY(realX, realY, false, scene.cameras.main, "below_player");
    if (tile) {
      const starsEmitter = scene.add.particles(realX + 24, realY + 24, "object_star", {
        speed: 50,
        lifespan: 500,
        scale: {start: 0.02, end: 0.01},
        emitting: false,
        duration: 100,
        tintFill: true,
        tint: 3706928
      });
      starsEmitter.setDepth(1);
      starsEmitter.explode(10);
      if (!userData.pokemons?.length) {
        scene.gridEngine.stopMovement(Sprites.PLAYER);
        const newPosition = {
          x: userData.position?.x ?? 0,
          y: userData.position?.y ?? 0
        };
        if (userData.position?.facingDirection === Direction.UP) {
          newPosition.y += 1;
        }
        if (userData.position?.facingDirection === Direction.DOWN) {
          newPosition.y -= 1;
        }
        if (userData.position?.facingDirection === Direction.LEFT) {
          newPosition.x += 1;
        }
        if (userData.position?.facingDirection === Direction.RIGHT) {
          newPosition.x -= 1;
        }
        scene.gridEngine.moveTo(Sprites.PLAYER, newPosition);
        openDialog("You don't have any pokemon. It's not safe to walk on grass.");
        return;
      }
      if (randomNumber === max / 2) {
        scene.gridEngine.stopMovement(Sprites.PLAYER);
        scene.gridEngine.setSpeed(Sprites.PLAYER, 0);
        const battleStarted = scene.data.get("battleStarted");
        if (!battleStarted) {
          const pokemon = getRandomPokemonFromZone(Number(grass.properties.find((property) => property.name === "id")?.value));
          scene.sound.stopAll();
          scene.sound.play(Audios.BATTLE, getAudioConfig());
          scene.data.set("battleStarted", true);
          scene.cameras.main.shake(1500, 0.01);
          scene.time.delayedCall(1500, () => {
            scene.cameras.main.fadeOut(200);
          });
          scene.time.delayedCall(2e3, () => {
            scene.data.reset();
            scene.receivedData = {};
            scene.scene.stop("World").start("Battle", {
              pokemon
            });
          });
        }
      }
    }
  }
};
export const handleDialogObject = (dialog) => {
  const content = dialog.properties.find((property) => property.name === "content")?.value;
  if (content) {
    openDialog(content);
  }
};
export const handlePokeball = (scene, pokeball) => {
  const pokemonInside = pokeball.properties.find((property) => property.name === "pokemon_inside")?.value;
  removeObject(scene, pokeball);
  useUserDataStore.getState().addObjectToInventory(pokeball.id);
  if (pokemonInside) {
    const pokemon = pokemons[pokemonInside - 1];
    useUserDataStore.getState().addPokemon(pokemon.id);
    scene.sound.play(Audios.GAIN, getAudioConfig(0.1, false));
    openDialog(`You found a <span class="gain">${pokemon.name}</span> inside this pokeball!`);
  }
};
export const handleBicycle = (scene) => {
  if (isDialogOpen()) {
    playClick(scene);
    return triggerUINextStep();
  }
  const userData = useUserDataStore.getState();
  const mapProperties = scene.tilemap.properties;
  const isIndoor = mapProperties.find && mapProperties.find((property) => property.name === "indoor");
  if (isUIOpen()) {
    return;
  }
  if (isIndoor) {
    playClick(scene);
    openDialog("No bicycle inside!");
    return;
  }
  const onBicycle = userData.onBicycle;
  if (!onBicycle) {
    scene.sound.play(Audios.BICYCLE, getAudioConfig(0.5, false));
  }
  const tile = getCurrentPlayerTile(scene);
  if (!tile) {
    return;
  }
  userData.update({
    onBicycle: !onBicycle
  });
  scene.scene.restart({
    startPosition: {
      x: tile.x,
      y: tile.y
    },
    facingDirection: scene.gridEngine.getFacingDirection(Sprites.PLAYER)
  });
};
export const getNPCs = (scene) => {
  const objects = scene.tilemap.getObjectLayer(Layers.OBJECTS)?.objects.map((object) => convertObjectPositionToTilePosition(object));
  return objects?.filter((object) => object.name === "npc") ?? [];
};
export const spawnNPC = (scene) => {
  const NPCs = getNPCs(scene);
  if (NPCs.length) {
    NPCs.forEach((npc) => {
      const name = getTiledObjectProperty("name", npc);
      const x = getTiledObjectProperty("x", npc);
      const y = getTiledObjectProperty("y", npc);
      const sprite = scene.add.sprite(0, 0, name);
      sprite.setOrigin(0.5, 0.5);
      sprite.setDepth(1);
      sprite.setScale(1.25);
      scene.gridEngine.addCharacter({
        id: name,
        sprite,
        walkingAnimationMapping: 0,
        startPosition: {x, y},
        speed: 5
      });
    });
  }
};
export const handleNPC = (scene, npc) => {
  if (!isDialogOpen()) {
    const name = getTiledObjectProperty("name", npc);
    openDialog(`Hello, I'm ${name}!`);
  }
};
