const {
  BLANK,
  ALL_OBJECTS,
  ALL_ROOMS,
} = require("./config");

import yargs from "yargs";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import axios from 'axios';

import { Game, generateEmptyDeskCoordsMap, PlayerActivelySpeaks, WireObject } from "@gathertown/gather-game-client";
import { stringify } from "querystring";
import { games } from "googleapis/build/src/apis/games";
global.WebSocket = require("isomorphic-ws");

// *** Heroku Online Code (Start) ***

//Initial setup for POSTing
const express = require("express");
const app = express();
const host = '0.0.0.0';
const port = process.env.PORT || 8000;

// *** Heroku Online Code (End) ***

const throttledQueue = require('throttled-queue');
const throttle = throttledQueue(2, 200, true);

//
// 
//
//
//
//
// BEGIN POLLING CODE
// 
//
//
// 
//
//

// Dictionary to keep track of websocket connection to avoid duplicate connections 
const POLLING_INTERVAL = 1000;
const ALL_SPACES = {};

// Iniate new web socket connection for new spaces
const spawnNewSpace = (API_KEY, SPACE_ID, MAP_ID) => {
  const gather_space_link = `https://app.gather.town/app/${SPACE_ID}`;

  console.log(`[${SPACE_ID}]:`, "listening to gather space:", gather_space_link);

  // SPACE_ID = gather_space_id;
  let url = SPACE_ID;

  let temp = false;

  const game = new Game(url, () => Promise.resolve({ apiKey: API_KEY }));

  ALL_SPACES[SPACE_ID] = { game };

  game.connect();
  game.subscribeToConnection((connected) => console.log(`[${SPACE_ID}]:`,"connected?", connected));


  game.subscribeToEvent("playerMoves", (data, context) => {
      if(temp == false) {
          temp = true;
          console.log(`[${SPACE_ID}]:`,'Building hall for:', SPACE_ID);
          buildMainHall(game, MAP_ID);
      }
  });

    
  runSocks(game, MAP_ID, SPACE_ID);  
}

// Poll API endpoint
const pollNewSpaces = (API_KEY, SPACE_ID, MAP_ID, interval) => {

  console.log(`\n\nPolling spaces in for SPACE_ID, ${SPACE_ID}, on interval, ${interval}`);

  axios.get(`https://rtr-web.herokuapp.com/api/gather-managed-spaces?active=true&reference_space_id=${SPACE_ID}`).then((res) => {

        if (res.data && res.data.length) {

            const gather_sapces = res.data;

            gather_sapces.forEach((gather_space) => {
                const {
                    space_id
                } = gather_space;

                if (!ALL_SPACES[space_id]) {
                  console.log(`\n\n!!Spanwing new space for ${space_id}!!\n\n`)
                  spawnNewSpace(API_KEY, space_id, MAP_ID)
                } else {
                  console.log(`${space_id} has already been spawned`);
                }

            });            
        }

        setTimeout(() => {
             pollNewSpaces(API_KEY, SPACE_ID, MAP_ID, interval);
        }, interval);
    })
}

// Get config and begin polling process
const initSocks = () => {
    let {
      API_KEY,
      SPACE_ID,
      MAP_ID,
    } = require("./config");

   pollNewSpaces(API_KEY, SPACE_ID, MAP_ID, POLLING_INTERVAL);
}

//
// 
//
//
//
//
// END POLLING CODE
// 
//
//
// 
//
//

//Builds map with objects listed in config.ts under MAIN_HALL_OBJ
const raidObjects: { [id: string]: RaidObject } = {};
const raidPlayers: { [id: string]: string } = {};
const raidPlayersXY: { [id: string]: {x: number, y: number, map_id: string}} = {};
// const raidRooms: { [id: string]: RaidRoom } = {};
const raidTeams: { [team_name: string]: any} = {};
const raidPlayerOufit: { [id: string]: string} = {}; 

const raidPlayerStats: { [id: string]: {HP: number, MP: number}} = {};

const setRaidObject = (game: any, x: number, map: string, someObject: {id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, spritesheet: { spritesheetUrl: any; framing: any; animations: any; }, customState: string, properties: {}}) => {
  throttle(() => {
    game.setObject(map, someObject.id.toString(), {
      id: someObject.id.toString(),
      type: someObject.type,
      x: someObject.x,
      y: someObject.y,
      width: someObject.width,
      height: someObject.height,
      distThreshold: someObject.distThreshold,
      previewMessage: someObject.previewMessage,
      normal: someObject.normal,
      highlighted: someObject.highlighted,
      spritesheet: someObject.spritesheet,
      customState: someObject.customState,
      properties: someObject.properties
    })

    console.log(`${someObject.id.toString()} has been set successfully`);
  });
}

const buildMainHall = (game: any, MAP_ID: any) => {
  let map_index = 0;
  let index_tracker = 0;

  Object.keys(ALL_OBJECTS).forEach((key, index) => {
    let map = MAP_ID[index];
    map_index = index_tracker;

    Object.keys(ALL_OBJECTS[key]).forEach((key2, index2) => {
      setRaidObject(game, index2 + map_index, map, ALL_OBJECTS[key][key2]);

      switch (ALL_OBJECTS[key][key2].BEHAVIOR) {
        
        default:
          console.log(`No behavior found for ${ALL_OBJECTS[key][key2].id.toString()}, setting default Object`)
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new RaidObject(game, Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
            ALL_OBJECTS[key][key2].x,
            ALL_OBJECTS[key][key2].y,
            ALL_OBJECTS[key][key2].width,
            ALL_OBJECTS[key][key2].height,
            ALL_OBJECTS[key][key2].distThreshold,
            ALL_OBJECTS[key][key2].previewMessage,
            ALL_OBJECTS[key][key2].normal,
            ALL_OBJECTS[key][key2].highlighted,
            ALL_OBJECTS[key][key2].customState,
            map,
            ALL_OBJECTS[key][key2].COOLDOWN,
            ALL_OBJECTS[key][key2].properties,
            ALL_OBJECTS[key][key2].BEHAVIOR,
            ALL_OBJECTS[key][key2].FIXED,
            ALL_OBJECTS[key][key2].TRADEABLE,
            ALL_OBJECTS[key][key2].LOOTABLE,
            ALL_OBJECTS[key][key2].SWAPPABLE,
            ALL_OBJECTS[key][key2].STACKABLE,
            ALL_OBJECTS[key][key2].LOGIC,
            ALL_OBJECTS[key][key2].DOORS)
            break;
      }

      index_tracker++;
    });
  });
}

//soundUrl: string, x: number, y: number, width: number, height: number
const playSoundinArea = (game: any, objectID: string, width: number, height: number, soundURL: string, volume: number) => {
  let halfwidth = width / 2 | 0
  let halfheight = height / 2 | 0
  let x = raidObjects[objectID].x - halfwidth
  let y = raidObjects[objectID].y - halfheight

  //plays sound to players in 5x5
  // "https://s3.amazonaws.com/raidtheroom.online/gather/kevinwebsockets/teleport-quick.wav"
  Object.keys(raidPlayersXY).forEach((key, index) => {
    if (raidPlayersXY[key].x >= x && raidPlayersXY[key].x <= x + (width - 1) && raidPlayersXY[key].y >= y && raidPlayersXY[key].y <= y + (height - 1)) {
      game.playSound(soundURL, volume, key);
    }
  });
}


const runSocks = (game: any, MAP_ID: any, SPACE_ID: any) => {
  game.subscribeToEvent('playerInteracts', (data, context) => {
    const objectID = data.playerInteracts.objId;

    console.log(`[${SPACE_ID}]:`, "PLAYER INTERACTED:", objectID)


    if (objectID == ALL_OBJECTS.KEVIN_WEBSOCKETS.sheep.id){
      
     
      if (raidPlayerOufit[context.playerId] == undefined) {
        console.log(`[${SPACE_ID}]:`, "sheep case");
        raidPlayerOufit[context.playerId] = context.player.outfitString;
        let outfit = JSON.parse(game.players[context.playerId].outfitString);
        let spriteSheetId = "XSATKnUokhgNuZV71QeZ";
        console.log(`[${SPACE_ID}]:`, outfit + " " + spriteSheetId);

        outfit.costume = {"id":"ro7qFRHBfXhwZZ2LpeLR","color":"black","type":"costume","parts":[{"spritesheetId":spriteSheetId,"layerId":"costume front"}],"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/HHjh8IShCs1sAXRpLU-Nd","name":"bride_of_frankenstein","isDefault":true,"startDate":{"_seconds":1633046400,"_nanoseconds":0}};

        game.setOutfitString(JSON.stringify(outfit), context.playerId);
        
      } else {
        console.log(`[${SPACE_ID}]:`, "else case");
        
        game.setOutfitString(raidPlayerOufit[context.playerId], context.playerId);
        delete raidPlayerOufit[context.playerId];
        
      }    
  
      
    }


    if (objectID == ALL_OBJECTS.KEVIN_WEBSOCKETS.chicken.id){
           
      if (raidPlayerOufit[context.playerId] == undefined) {
        console.log(`[${SPACE_ID}]:`, "chicken case");
        raidPlayerOufit[context.playerId] = context.player.outfitString;
        let outfit = JSON.parse(game.players[context.playerId].outfitString);
        let spriteSheetId = "FUAHIumeZywaDeIEnZGN";
        console.log(`[${SPACE_ID}]:`, outfit + " " + spriteSheetId);

        outfit.costume = {"id":"ro7qFRHBfXhwZZ2LpeLR","color":"black","type":"costume","parts":[{"spritesheetId":spriteSheetId,"layerId":"costume front"}],"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/HHjh8IShCs1sAXRpLU-Nd","name":"bride_of_frankenstein","isDefault":true,"startDate":{"_seconds":1633046400,"_nanoseconds":0}};

        game.setOutfitString(JSON.stringify(outfit), context.playerId);
        
      } else {
        console.log(`[${SPACE_ID}]:`, "else case");
        
        game.setOutfitString(raidPlayerOufit[context.playerId], context.playerId);
        delete raidPlayerOufit[context.playerId];
        
      }    
      
    }


    if (objectID == ALL_OBJECTS.KEVIN_WEBSOCKETS.frog.id){
           
      if (raidPlayerOufit[context.playerId] == undefined) {
        console.log(`[${SPACE_ID}]:`, "frog case");
        raidPlayerOufit[context.playerId] = context.player.outfitString;
        let outfit = JSON.parse(game.players[context.playerId].outfitString);
        let spriteSheetId = "hM6wbFfGv5sAAF1lW0II";
        console.log(`[${SPACE_ID}]:`, outfit + " " + spriteSheetId);

        outfit.costume = {"id":"ro7qFRHBfXhwZZ2LpeLR","color":"black","type":"costume","parts":[{"spritesheetId":spriteSheetId,"layerId":"costume front"}],"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/HHjh8IShCs1sAXRpLU-Nd","name":"bride_of_frankenstein","isDefault":true,"startDate":{"_seconds":1633046400,"_nanoseconds":0}};

        game.setOutfitString(JSON.stringify(outfit), context.playerId);
        
      } else {
        console.log(`[${SPACE_ID}]:`, "else case");
        
        game.setOutfitString(raidPlayerOufit[context.playerId], context.playerId);
        delete raidPlayerOufit[context.playerId];
        
      }    
      
    }


    if (objectID == ALL_OBJECTS.KEVIN_WEBSOCKETS.mouse.id){
           
      if (raidPlayerOufit[context.playerId] == undefined) {
        console.log(`[${SPACE_ID}]:`, "mouse case");
        raidPlayerOufit[context.playerId] = context.player.outfitString;
        let outfit = JSON.parse(game.players[context.playerId].outfitString);
        let spriteSheetId = "n1FVIa6vDuOPu5wENX24";
        console.log(`[${SPACE_ID}]:`, outfit + " " + spriteSheetId);

        outfit.costume = {"id":"ro7qFRHBfXhwZZ2LpeLR","color":"black","type":"costume","parts":[{"spritesheetId":spriteSheetId,"layerId":"costume front"}],"previewUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/wearables/HHjh8IShCs1sAXRpLU-Nd","name":"bride_of_frankenstein","isDefault":true,"startDate":{"_seconds":1633046400,"_nanoseconds":0}};

        game.setOutfitString(JSON.stringify(outfit), context.playerId);
        
      } else {
        console.log(`[${SPACE_ID}]:`, "else case");
        
        game.setOutfitString(raidPlayerOufit[context.playerId], context.playerId);
        delete raidPlayerOufit[context.playerId];
        
      }    
      
    }


    if (objectID == ALL_OBJECTS.KEVIN_WEBSOCKETS.note.id){

      let json_data = data.playerInteracts.dataJson;
      console.log(`[${SPACE_ID}]:`,json_data);

      let parsed_JSON = JSON.parse(json_data);
      console.log(`[${SPACE_ID}]:`,parsed_JSON);

      let newWord = parsed_JSON.secret_word;

      console.log(`[${SPACE_ID}]:`,newWord);
      console.log(`[${SPACE_ID}]:`,parsed_JSON.secret_word);

      if (parsed_JSON = !undefined) {

        game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.note.id.toString(), {
          type: 7,
          normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=" + newWord.toString() + " - " + context.player.name + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
          highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=" + newWord.toString() + " - " + context.player.name + "&font=Regular-Black.ttf&red=255&green=255&blue=0&size=14",
          properties: {
            extensionData: {
                entries: [
                    {
                        type: "header",
                        value: "Submit text below to leave your shared note here.",
                        key: "start_header"
                    },
                    {
                      type: "text",
                      value: "Secret word",
                      key: "secret_word",
                    },
                                          
                ]
            }
          }

        });


      }

    }


    //Classes experimentation
    if (raidObjects[objectID] && raidObjects[objectID].id != 'undefined') {
      console.log (`[${SPACE_ID}]:`,objectID + " has been interacted with");
      // playSoundinArea(game, objectID, 9, 9, "https://s3.amazonaws.com/raidtheroom.online/gather/kevinwebsockets/teleport-quick.wav", .25);
      raidObjects[objectID].interaction(context.playerId);
    }

    
  });

  game.subscribeToEvent("playerTriggersItem", ({playerTriggersItem}, {player, playerId}) => {
    if (!playerId || !player) {
      return;
    }

    //Finds the closest object within a range of 1 and assigns it to the closestObject variable
    const {closestObjectTemplate, closestObject} = playerTriggersItem;

    //Get X/Y in front of player
    //Assigns them to front_x and front_y
    let front_x = game.getPlayer(playerId).x, front_y = game.getPlayer(playerId).y
    switch (game.getPlayer(playerId).direction) {
      case 3:
      case 4:
        front_y--;
        break;
      case 7:
      case 8:
        front_x++;
        break;
      case 1:
      case 2:
        front_y++;
        break;
      case 5:
      case 6:
        front_x--;
        break;
      default:
        console.log('invalid direction??');
    }

    //Check for any players in front
    //Assigns player id to front_player
    let front_player = 'none';
    Object.keys(raidPlayersXY).every((key, index) => {
      if (raidPlayersXY[key].x == front_x && raidPlayersXY[key].y == front_y && key != playerId) {
        front_player = key;
        return false;
      }
      return true;
    });

    //Check if player has any items currently;
    let player_object = 'none'
    if (raidPlayers[playerId] != undefined) player_object = raidPlayers[playerId];

    //Determine what action to take based on the properties of FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, and STACKABLE
    //Priotizes interacting with objects
    if (closestObject != undefined) {
      let close_object = raidObjects[closestObject];
      
      //Checks if the object is in front of the player or under the player as well as the FIXED property of the object
      if (((player.x == close_object.x && player.y == close_object.y) || (close_object.x == front_x && close_object.y == front_y)) && !close_object.FIXED) {
        //If the player has no items, pick up the close object
        if (player_object == 'none') {
          raidPlayers[playerId] = closestObject;
          game.deleteObject(raidObjects[closestObject].map_id, raidObjects[closestObject].id);
          game.setItem("closestObjectTemplate", raidObjects[closestObject].normal, playerId);

          console.log(`${game.getPlayer(playerId).name} picked up ${closestObject}!`);

          throttle(() => { 
      
            // Log Player Checks
            const payload = {
              "version": "1",
              "display_name": player.name,
              "space_id": SPACE_ID,
              "map_id": MAP_ID[0],
              "player_id": playerId,
              "player_xy":  player.x + ", " + player.y,
              "object_id": player_object,
              "field_1": "pick up",
              "field_2": front_player,
              "field_3": close_object.id,
              "timestamp": Date.now()
            }
            axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
                  console.log(res.data);
            })
        
          });

        } else {
          // If player has an item, check the SWAPPABLE property and swap items if true
          if (raidObjects[player_object].SWAPPABLE && close_object.SWAPPABLE == true) {
            raidPlayers[playerId] = closestObject;

            game.setObject(raidObjects[player_object].map_id, raidObjects[player_object].id.toString(), {
              id: raidObjects[player_object].id.toString(),
              type: raidObjects[player_object].type,
              x: close_object.x,
              y: close_object.y,
              width: raidObjects[player_object].width,
              height: raidObjects[player_object].height,
              distThreshold: raidObjects[player_object].distThreshold,
              previewMessage: raidObjects[player_object].previewMessage,
              normal: raidObjects[player_object].normal,
              highlighted: raidObjects[player_object].highlighted,
              customState: raidObjects[player_object].customState,
              properties: raidObjects[player_object].properties,
            });

            raidObjects[player_object].x = close_object.x;
            raidObjects[player_object].y = close_object.y;
          
            game.deleteObject(raidObjects[closestObject].map_id, raidObjects[closestObject].id);
            game.setItem("closestObjectTemplate", raidObjects[closestObject].normal, playerId);

            console.log(`${game.getPlayer(playerId).name} swapped ${player_object} with ${closestObject}!`);

            throttle(() => { 
      
              // Log Player Checks
              const payload = {
                "version": "1",
                "display_name": player.name,
                "space_id": SPACE_ID,
                "map_id": MAP_ID[0],
                "player_id": playerId,
                "player_xy":  player.x + ", " + player.y,
                "object_id": player_object,
                "field_1": "swap",
                "field_2": front_player,
                "field_4": close_object.id,
                "timestamp": Date.now()
              }
              axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
                    console.log(res.data);
              })
          
            });

          } else if (raidObjects[player_object].STACKABLE && close_object.STACKABLE) {
            //Stack currently held object on to another object if both STACKLABLE properties are true
            game.setObject(raidObjects[player_object].map_id, raidObjects[player_object].id.toString(), {
              id: raidObjects[player_object].id.toString(),
              type: raidObjects[player_object].type,
              x: close_object.x,
              y: close_object.y,
              width: raidObjects[player_object].width,
              height: raidObjects[player_object].height,
              distThreshold: raidObjects[player_object].distThreshold,
              previewMessage: raidObjects[player_object].previewMessage,
              normal: raidObjects[player_object].normal,
              highlighted: raidObjects[player_object].highlighted,
              customState: raidObjects[player_object].customState,
              properties: raidObjects[player_object].properties,
            });

            raidObjects[player_object].x = close_object.x;
            raidObjects[player_object].y = close_object.y;
          
            delete raidPlayers[playerId];
            game.clearItem(playerId);

            console.log(`${game.getPlayer(playerId).name} stacked ${player_object} with ${closestObject}!`);
          }
        }
      } else if (raidPlayers[playerId] != undefined ) {
        //If the space infront is empty and the player is carrying something, drop the currently held items in front of the player
        game.setObject(raidObjects[player_object].map_id, raidObjects[player_object].id.toString(), {
          id: raidObjects[player_object].id.toString(),
          type: raidObjects[player_object].type,
          x: front_x,
          y: front_y,
          width: raidObjects[player_object].width,
          height: raidObjects[player_object].height,
          distThreshold: raidObjects[player_object].distThreshold,
          previewMessage: raidObjects[player_object].previewMessage,
          normal: raidObjects[player_object].normal,
          highlighted: raidObjects[player_object].highlighted,
          customState: raidObjects[player_object].customState,
          properties: raidObjects[player_object].properties,
        });
  
        raidObjects[player_object].x = front_x;
        raidObjects[player_object].y = front_y;
  
        delete raidPlayers[playerId];
        game.clearItem(playerId);
  
        console.log(`${game.getPlayer(playerId).name} has dropped ${player_object}!`);

        throttle(() => { 
      
          // Log Player Checks
          const payload = {
            "version": "1",
            "display_name": player.name,
            "space_id": SPACE_ID,
            "map_id": MAP_ID[0],
            "player_id": playerId,
            "player_xy":  player.x + ", " + player.y,
            "object_id": player_object,
            "field_1": "drop",
            "timestamp": Date.now()
          }
          axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
                console.log(res.data);
          })
      
        });

      }
    } else if (front_player != 'none') {

      //Check if the other player is carrying anything
      let other_player_object = 'none';
      if (raidPlayers[front_player] != undefined) other_player_object = raidPlayers[front_player];

      //If both players have items and both items' TRADEABLE property is true, then trade items
      if (player_object != 'none' && other_player_object != 'none') {
        if (raidObjects[player_object].TRADEABLE && raidObjects[other_player_object].TRADEABLE) {
          raidPlayers[playerId] = other_player_object;
          raidPlayers[front_player] = player_object

          game.setItem("closestObjectTemplate", raidObjects[other_player_object].normal, playerId);
          game.setItem("closestObjectTemplate", raidObjects[player_object].normal, front_player);

          console.log(`${game.getPlayer(playerId).name} has traded ${player_object} for ${other_player_object} from ${game.getPlayer(front_player).name}!`);

          throttle(() => { 
      
            // Log Player Checks
            const payload = {
              "version": "1",
              "display_name": player.name,
              "space_id": SPACE_ID,
              "map_id": MAP_ID[0],
              "player_id": playerId,
              "player_xy":  player.x + ", " + player.y,
              "object_id": player_object,
              "field_1": "trade",
              "field_2": front_player,
              "field_3": other_player_object,
              "timestamp": Date.now()
            }
            axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
                  console.log(res.data);
            })
        
          });

        }
      } else if (player_object == 'none' && other_player_object != 'none') {
        //If the player doesn't have items but the other player does, steal his item if its LOOTABLE property is true
        if (raidObjects[other_player_object].LOOTABLE) {
          raidPlayers[playerId] = other_player_object;
          delete raidPlayers[front_player];
          game.setItem("closestObjectTemplate", raidObjects[other_player_object].normal, playerId);
          game.clearItem(front_player);

          console.log(`${game.getPlayer(playerId).name} has stolen ${other_player_object} from ${game.getPlayer(front_player).name}!`);

          throttle(() => { 
      
            // Log Player Checks
            const payload = {
              "version": "1",
              "display_name": player.name,
              "space_id": SPACE_ID,
              "map_id": MAP_ID[0],
              "player_id": playerId,
              "player_xy":  player.x + ", " + player.y,
              "object_id": player_object,
              "field_1": "steal",
              "field_2": front_player,
              "field_3": other_player_object,
              "timestamp": Date.now()
            }
            axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
                  console.log(res.data);
            })
        
          });

        } //Add gifting here
      } else if (player_object != 'none' && other_player_object == 'none') {
        if (raidObjects[player_object].TRADEABLE) {
          raidPlayers[front_player] = player_object;
          console.log(front_player);
          delete raidPlayers[playerId];
          game.setItem("closestObjectTemplate", raidObjects[player_object].normal, front_player);
          game.clearItem(playerId);

          console.log(`${game.getPlayer(playerId).name} has given ${other_player_object} to ${game.getPlayer(front_player).name}!`);

          throttle(() => { 
      
            // Log Player Checks
            const payload = {
              "version": "1",
              "display_name": player.name,
              "space_id": SPACE_ID,
              "map_id": MAP_ID[0],
              "player_id": playerId,
              "player_xy":  player.x + ", " + player.y,
              "object_id": player_object,
              "field_1": "give",
              "field_2": front_player,
              "field_3": other_player_object,
              "timestamp": Date.now()
            }
            axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
                  console.log(res.data);
            })
        
          });

        }
      }

    } else if (raidPlayers[playerId] != undefined ) {
      //If the space infront is empty and the player is carrying something, drop the currently held items in front of the player
      game.setObject(raidObjects[player_object].map_id, raidObjects[player_object].id.toString(), {
        id: raidObjects[player_object].id.toString(),
        type: raidObjects[player_object].type,
        x: front_x,
        y: front_y,
        width: raidObjects[player_object].width,
        height: raidObjects[player_object].height,
        distThreshold: raidObjects[player_object].distThreshold,
        previewMessage: raidObjects[player_object].previewMessage,
        normal: raidObjects[player_object].normal,
        highlighted: raidObjects[player_object].highlighted,
        customState: raidObjects[player_object].customState,
        properties: raidObjects[player_object].properties,
      });

      raidObjects[player_object].x = front_x;
      raidObjects[player_object].y = front_y;

      delete raidPlayers[playerId];
      game.clearItem(playerId);

      console.log(`${game.getPlayer(playerId).name} has dropped ${player_object}!`);

      throttle(() => { 
      
        // Log Player Checks
        const payload = {
          "version": "1",
          "display_name": player.name,
          "space_id": SPACE_ID,
          "map_id": MAP_ID[0],
          "player_id": playerId,
          "player_xy":  player.x + ", " + player.y,
          "object_id": player_object,
          "field_1": "drop",
          "timestamp": Date.now()
        }
        axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
              console.log(res.data);
        })
    
      });

    } else {
      console.log(`${game.getPlayer(playerId).name} has found nothing of importance`);
    }

    
    

  });


  game.subscribeToEvent("playerMoves", (data, context) => {
    //Experimental class follow code
    if (context.player.map == MAP_ID[0] || context.player.map == MAP_ID[1] || context.player.map == MAP_ID[2]) {
      Object.keys(raidObjects).forEach((key, index) => {
        if (raidObjects[key].BEHAVIOR == 'FOLLOW' || raidObjects[key].BEHAVIOR == 'SWAP' ) {
          let newX = context.player.x;
          let newY = context.player.y;

          if(raidObjects[key].customState != 'none') {
            switch (data.playerMoves.direction) {
              case 1:
              case 2:
                  newY -= 1;
                  break;
              case 3:
              case 4:
                  newY += 1;
                  break;
              case 5:
              case 6:
                  newX += 1;
                  break;
              case 7:
              case 8:
                  newX -= 1;
                  break;
              default:
                  console.log('Invalid direction??');
                  break;
            }

            raidObjects[key].follow(newX, newY, context.player.name);
          }
        }

      });
    }
    //Store player location data locally for play sound area
    if (context.player.map == MAP_ID[0]) {
      if (raidPlayersXY[context.playerId] == undefined) {
        raidPlayersXY[context.playerId] = {
          x: 0,
          y: 0,
          map_id: context.player.map
        }
      }
      raidPlayersXY[context.playerId].x = context.player.x;
      raidPlayersXY[context.playerId].y = context.player.y;
    }

    //Pressure Plates
    if (context.player.map == MAP_ID[4]) {
      let roomPlayers = game.getPlayersInMap(MAP_ID[4]);
      let plates = [{'x': 5, 'y': 2}, {'x': 7, 'y': 2}, {'x': 5, 'y': 4}, {'x': 7, 'y': 4}];
      let x = 0;
      
      for (let i = 0; i < roomPlayers.length; i++) {
        for (let j = 0; j < plates.length; j++) {
          if (roomPlayers[i].x == plates[j].x && roomPlayers[i].y == plates[j].y) {
            console.log( context.player.name + " is stepping on " + `${plates[j].x}, ${plates[j].y}`);
            x++;
          }
        }
      }
    }

  });

  game.subscribeToEvent("playerChats", (data, context) => {
    const message = data.playerChats;
    console.log(message);
  });

}


// *** Heroku Online Code (Start) ***

app.listen(port, host, function() {
  console.log("Server started.......");
});

initSocks();

// *** Heroku Online Code (End) **

//Experimenting with classes
class RaidObject {
  game: any
  name: string
  id: string
  type: number
  x: number
  y: number
  width: number
  height: number
  distThreshold: number
  previewMessage: string
  normal: string
  highlighted: string
  customState: string
  map_id: string
  COOLDOWN: number
  BEHAVIOR: string
  FIXED: boolean
  TRADEABLE: boolean
  LOOTABLE: boolean
  SWAPPABLE: boolean
  STACKABLE: boolean
  LOGIC: string
  DOORS: string
  tracker: number
  isMatched: boolean
  isFlipped: boolean
  flippedImage: string
  GROUP: []
  properties: {}

  constructor(game: any, name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, properties: {}, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string) {
    this.game = game
    this.name = name
    this.id = id
    this.type = type
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.distThreshold = distThreshold
    this.previewMessage = previewMessage
    this.normal = normal
    this.highlighted = highlighted
    this.customState = customState
    this.COOLDOWN = COOLDOWN
    this.properties = properties
    this.map_id = map_id
    this.BEHAVIOR = BEHAVIOR
    this.FIXED = FIXED
    this.TRADEABLE = TRADEABLE
    this.LOOTABLE = LOOTABLE
    this.SWAPPABLE = SWAPPABLE
    this.STACKABLE = STACKABLE
    this.LOGIC = LOGIC
    this.DOORS = DOORS 
  }

  setRaidObjectCustomState(customState: string): void {
    this.customState = customState
  }

  interaction(player: string) {
    console.log(this.id + ' base class interaction method called');
  }

  return() {
    this.game.setObject(this.map_id, this.id, {
      type: this.type,
      normal: this.normal,
      highlighted: this.highlighted,
      x: this.x,
      y: this.y
    });
  }

  move(x: number, y: number) {
    this.game.setObject(this.map_id, this.id, {
      type: this.type,
      normal: this.normal,
      highlighted: this.highlighted,
      x: x,
      y: y
    });
  }

  setMove(x: number, y: number) {
    this.x = x
    this.y = y

    this.game.setObject(this.map_id, this.id, {
      type: this.type,
      normal: this.normal,
      highlighted: this.highlighted,
      x: x,
      y: y
    });
  }

  setSprite(normal: string) {
    this.game.setObject(this.map_id, this.id, {
      normal: normal,
      highlighted: normal
    });
  }

  setTypeToZero() {
    if (this.type != 0) {
      this.type = 0;
      this.game.setObject(this.map_id, this.id, {
        type: 0
      });
    }
  }

  setTypeToFive() {
    if (this.type != 5) {
      this.type = 5;
      this.game.setObject(this.map_id, this.id, {
        type: 5
      });
    }
  }

  flipType() {
    this.type == 5 ? this.type = 0 : this.type = 5;
    this.game.setObject(this.map_id, this.id, {
      type: this.type
    });
  }

  flip() {
    console.log('Base flip triggered')
  }

  checkAllMatch(): boolean {
    return false;
  }

  resetAll(): void {
    console.log('base called')
  }

  shuffleAll(): void {
    console.log('base called');
  }

  follow(x: number, y: number, name: string) {
    this.x = x;
    this.y = y;

    this.game.moveMapObject(this.map_id, this.id, {x, y}, 180, "Linear");
  }
}
