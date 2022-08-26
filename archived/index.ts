let {
  url, 
  API_KEY,
  SPACE_ID,
  MAP_ID,
  BLANK,
  ALL_OBJECTS,
  ALL_ROOMS,
} = require("./config");


import yargs from "yargs";
import { ServerClientEventContext } from "@gathertown/gather-game-client/dist/src/public/utils";
import axios from 'axios';

import { Game, generateEmptyDeskCoordsMap, PlayerActivelySpeaks, WireObject } from "@gathertown/gather-game-client";
import { stringify } from "querystring";

global.WebSocket = require("isomorphic-ws");


// TODO REMOVE GAME INIT CODE
let game = new Game(url, () => Promise.resolve({ apiKey: API_KEY }));
game.connect();
game.subscribeToConnection((connected) => console.log("connected?", connected));


// *** Heroku Online Code (Start) ***

//Initial setup for POSTing
const express = require("express");
//const axios = require("axios");
const app = express();
// use alternate localhost and the port Heroku assigns to $PORT
const host = '0.0.0.0';
const port = process.env.PORT || 8000;

// *** Heroku Online Code (End) ***

// let game = new Game(url, () => Promise.resolve({ apiKey: API_KEY }));
// game.connect();
// game.subscribeToConnection((connected) => console.log("connected?", connected));

const throttledQueue = require('throttled-queue');
const throttle = throttledQueue(2, 200, true);
// const throttleRtR = throttledQueue(1, 1000, true);

const initSocks = (game) => {
  let temp = false;

  game.subscribeToEvent("playerMoves", (data, context) => {
    if(temp == false) {
      temp = true;
      console.log('Building hall...');
      buildMainHall();
      
    }
  });
  
  
  game.subscribeToEvent("playerJoins", (data, context) => {
    
    // console.log(context.playerId + "Display Name: " + context.player.name + data.playerJoins.encId);

    // game.registerCommand("teleport"); // Register Command for /teleport
    // game.registerCommand("count"); // Register Command for /count players in each map
    // game.registerCommand("mute"); // Register Command for /mute for players
    

    // throttle(() => { 
      
    //   game.registerCommand("teleport"); // Register Command for /teleport
    //   game.registerCommand("count"); // Register Command for /count players in each map
    //   game.registerCommand("mute"); // Register Command for /mute for players
      
      
        
     
      

    // });
  
    throttle(() => { 
      
      // Log Player Joins
      const payload = {
        "version": "1",
        "display_name": context.player.name,
        "space_id": SPACE_ID,
        "map_id": context.player.map,
        "player_id": context.playerId,
        "player_xy":  context.player.x + ", " + context.player.y,
        "field_1": data.playerJoins.encId,
        "timestamp": Date.now()
      }
      axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerjoins", payload).then ((res)=>{
            console.log(res.data);
      })

    });
    
    //   let testArray = [];
    //   testArray = [
    //     {id: ALL_OBJECTS.KEVIN_WEBSOCKETS.brain.id, x: ALL_OBJECTS.KEVIN_WEBSOCKETS.brain.x, y: ALL_OBJECTS.KEVIN_WEBSOCKETS.brain.y},
    //     {id: ALL_OBJECTS.KEVIN_WEBSOCKETS.sneaker.id, x: ALL_OBJECTS.KEVIN_WEBSOCKETS.sneaker.x, y: ALL_OBJECTS.KEVIN_WEBSOCKETS.sneaker.y},

    //   ]

    

    // for (let i=0; i < testArray.length; i++){
    //   throttle(() => { 
    //     if (game.getImpassable(MAP_ID[0], testArray[i].x, testArray[i].y) === false){
          
    //       // console.log(game.getImpassable(MAP_ID[0], testArray[i].x, testArray[i].y));
    //       game.setImpassable(MAP_ID[0], testArray[i].x, testArray[i].y, true);
    //       console.log("setImpassable for: " + testArray[i].id + " - " + testArray[i].x + ", " + testArray[i].y);
    //     }
    //   });

    // }
  

  });

}

let crystalAnswer = [];
let submissionArray = [];

let inGame = 0;

let guessCount = 0;

// Set Submission Spots
let sub_1_x = 14;
let sub_1_y = 12;

let sub_2_x = 15;
let sub_2_y = 12;

let sub_3_x = 16;
let sub_3_y = 12;

let sub_4_x = 17;
let sub_4_y = 12;






// initSocks();

axios.post("http://localhost:4000/api/gather-managed-spaces", {
	reference_space_id: SPACE_ID,
	api_key: API_KEY,
	space_name: MAP_ID[0]
}).then((res) => {
	console.log(res.data)

	if (res.data && res.data.data) {
		const gather_space = res.data.data;

		const {
			gather_space_id,
			gather_space_link,
		} = gather_space;

		console.log("Link to new space:", gather_space_link);

		SPACE_ID = gather_space_id;
		url = gather_space_id;

		let game = new Game(url, () => Promise.resolve({ apiKey: API_KEY }));
		game.connect();
		game.subscribeToConnection((connected) => console.log("connected?", connected));

		initSocks(game);
		runSocks(game);
	}
})



//Builds map with objects listed in config.ts under MAIN_HALL_OBJ
const raidObjects: { [id: string]: RaidObject } = {};
const raidPlayers: { [id: string]: string } = {};
const raidPlayersXY: { [id: string]: {x: number, y: number, map_id: string}} = {};
const raidRooms: { [id: string]: RaidRoom } = {};
const raidTeams: { [team_name: string]: any} = {};

const raidPlayerStats: { [id: string]: {HP: number, MP: number}} = {};

const setRaidObject = (x: number, map: string, someObject: {id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, properties: {}}) => {
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
      customState: someObject.customState,
      properties: someObject.properties
    })

    console.log(`${someObject.id.toString()} has been set successfully`);
  });

  

}



const buildMainHall = () => {
  let map_index = 0;
  let index_tracker = 0;

  //Classes stuff
  Object.keys(ALL_OBJECTS).forEach((key, index) => {
    let map = MAP_ID[index];
    map_index = index_tracker;

    Object.keys(ALL_OBJECTS[key]).forEach((key2, index2) => {
      setRaidObject(index2 + map_index, map, ALL_OBJECTS[key][key2]);

      switch (ALL_OBJECTS[key][key2].BEHAVIOR) {
        case 'FOLLOW':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new FollowRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
            ALL_OBJECTS[key][key2].BEHAVIOR,
            ALL_OBJECTS[key][key2].FIXED,
            ALL_OBJECTS[key][key2].TRADEABLE,
            ALL_OBJECTS[key][key2].LOOTABLE,
            ALL_OBJECTS[key][key2].SWAPPABLE,
            ALL_OBJECTS[key][key2].STACKABLE,
            ALL_OBJECTS[key][key2].LOGIC,
            ALL_OBJECTS[key][key2].DOORS)
            break;
        // case 'TAKE':
        //   raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new TakeRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
        //     ALL_OBJECTS[key][key2].x,
        //     ALL_OBJECTS[key][key2].y,
        //     ALL_OBJECTS[key][key2].width,
        //     ALL_OBJECTS[key][key2].height,
        //     ALL_OBJECTS[key][key2].distThreshold,
        //     ALL_OBJECTS[key][key2].previewMessage,
        //     ALL_OBJECTS[key][key2].normal,
        //     ALL_OBJECTS[key][key2].highlighted,
        //     ALL_OBJECTS[key][key2].customState,
        //     map,
        //     ALL_OBJECTS[key][key2].COOLDOWN,
        //     ALL_OBJECTS[key][key2].BEHAVIOR,
        //     ALL_OBJECTS[key][key2].FIXED,
        //     ALL_OBJECTS[key][key2].LOGIC,
        //     ALL_OBJECTS[key][key2].DOORS)
        //     break;
        // case 'DROP':
        //   raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new DropRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
        //     ALL_OBJECTS[key][key2].x,
        //     ALL_OBJECTS[key][key2].y,
        //     ALL_OBJECTS[key][key2].width,
        //     ALL_OBJECTS[key][key2].height,
        //     ALL_OBJECTS[key][key2].distThreshold,
        //     ALL_OBJECTS[key][key2].previewMessage,
        //     ALL_OBJECTS[key][key2].normal,
        //     ALL_OBJECTS[key][key2].highlighted,
        //     ALL_OBJECTS[key][key2].customState,
        //     map,
        //     ALL_OBJECTS[key][key2].COOLDOWN,
        //     ALL_OBJECTS[key][key2].BEHAVIOR,
        //     ALL_OBJECTS[key][key2].FIXED,
        //     ALL_OBJECTS[key][key2].LOGIC,
        //     ALL_OBJECTS[key][key2].DOORS)
        //     break;
        case 'PUSH':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new PushRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
            ALL_OBJECTS[key][key2].BEHAVIOR,
            ALL_OBJECTS[key][key2].FIXED,
            ALL_OBJECTS[key][key2].TRADEABLE,
            ALL_OBJECTS[key][key2].LOOTABLE,
            ALL_OBJECTS[key][key2].SWAPPABLE,
            ALL_OBJECTS[key][key2].STACKABLE,
            ALL_OBJECTS[key][key2].LOGIC,
            ALL_OBJECTS[key][key2].DOORS)
            break;
        case 'CHANGE':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new ChangeRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
          ALL_OBJECTS[key][key2].BEHAVIOR,
          ALL_OBJECTS[key][key2].FIXED,
          ALL_OBJECTS[key][key2].TRADEABLE,
          ALL_OBJECTS[key][key2].LOOTABLE,
          ALL_OBJECTS[key][key2].SWAPPABLE,
          ALL_OBJECTS[key][key2].STACKABLE,
          ALL_OBJECTS[key][key2].LOGIC,
          ALL_OBJECTS[key][key2].DOORS,
          ALL_OBJECTS[key][key2].STATES,
          ALL_OBJECTS[key][key2].GROUP)
          break;
        case 'TELEPORT':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new TeleportRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
          ALL_OBJECTS[key][key2].BEHAVIOR,
          ALL_OBJECTS[key][key2].FIXED,
          ALL_OBJECTS[key][key2].TRADEABLE,
          ALL_OBJECTS[key][key2].LOOTABLE,
          ALL_OBJECTS[key][key2].SWAPPABLE,
          ALL_OBJECTS[key][key2].STACKABLE,
          ALL_OBJECTS[key][key2].LOGIC,
          ALL_OBJECTS[key][key2].DOORS,
          ALL_OBJECTS[key][key2].TELEPORT,
          ALL_OBJECTS[key][key2].MAP)
          break;
        case 'LIGHTS_OUT':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new LightsOutRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
          ALL_OBJECTS[key][key2].BEHAVIOR,
          ALL_OBJECTS[key][key2].FIXED,
          ALL_OBJECTS[key][key2].TRADEABLE,
          ALL_OBJECTS[key][key2].LOOTABLE,
          ALL_OBJECTS[key][key2].SWAPPABLE,
          ALL_OBJECTS[key][key2].STACKABLE,
          ALL_OBJECTS[key][key2].LOGIC,
          ALL_OBJECTS[key][key2].DOORS,
          ALL_OBJECTS[key][key2].normalTwo,
          ALL_OBJECTS[key][key2].GROUP,
          ALL_OBJECTS[key][key2].NEXT)
          break;
        // case 'SWAP':
        //   raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new SwapRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
        //     ALL_OBJECTS[key][key2].x,
        //     ALL_OBJECTS[key][key2].y,
        //     ALL_OBJECTS[key][key2].width,
        //     ALL_OBJECTS[key][key2].height,
        //     ALL_OBJECTS[key][key2].distThreshold,
        //     ALL_OBJECTS[key][key2].previewMessage,
        //     ALL_OBJECTS[key][key2].normal,
        //     ALL_OBJECTS[key][key2].highlighted,
        //     ALL_OBJECTS[key][key2].customState,
        //     map,
        //     ALL_OBJECTS[key][key2].COOLDOWN,
        //     ALL_OBJECTS[key][key2].BEHAVIOR,
        //     ALL_OBJECTS[key][key2].FIXED,
        //     ALL_OBJECTS[key][key2].LOGIC,
        //     ALL_OBJECTS[key][key2].DOORS)
        //     break;
        case 'SWAPPOS':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new SwapPositionRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
            ALL_OBJECTS[key][key2].BEHAVIOR,
            ALL_OBJECTS[key][key2].FIXED,
            ALL_OBJECTS[key][key2].TRADEABLE,
            ALL_OBJECTS[key][key2].LOOTABLE,
            ALL_OBJECTS[key][key2].SWAPPABLE,
            ALL_OBJECTS[key][key2].STACKABLE,
            ALL_OBJECTS[key][key2].LOGIC,
            ALL_OBJECTS[key][key2].DOORS,
            ALL_OBJECTS[key][key2].GROUP)
            break;
        case 'WARP':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new WarpRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
            ALL_OBJECTS[key][key2].BEHAVIOR,
            ALL_OBJECTS[key][key2].FIXED,
            ALL_OBJECTS[key][key2].TRADEABLE,
            ALL_OBJECTS[key][key2].LOOTABLE,
            ALL_OBJECTS[key][key2].SWAPPABLE,
            ALL_OBJECTS[key][key2].STACKABLE,
            ALL_OBJECTS[key][key2].LOGIC,
            ALL_OBJECTS[key][key2].DOORS,
            ALL_OBJECTS[key][key2].GROUP)
            break;
        case 'MEMMATCH':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new MemoryMatchRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
            ALL_OBJECTS[key][key2].BEHAVIOR,
            ALL_OBJECTS[key][key2].FIXED,
            ALL_OBJECTS[key][key2].TRADEABLE,
            ALL_OBJECTS[key][key2].LOOTABLE,
            ALL_OBJECTS[key][key2].SWAPPABLE,
            ALL_OBJECTS[key][key2].STACKABLE,
            ALL_OBJECTS[key][key2].LOGIC,
            ALL_OBJECTS[key][key2].DOORS,
            ALL_OBJECTS[key][key2].GROUP,
            ALL_OBJECTS[key][key2].flippedImage)
            break;
        case 'ENTER':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new EnterRaidRoomObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
          ALL_OBJECTS[key][key2].BEHAVIOR,
          ALL_OBJECTS[key][key2].FIXED,
          ALL_OBJECTS[key][key2].TRADEABLE,
          ALL_OBJECTS[key][key2].LOOTABLE,
          ALL_OBJECTS[key][key2].SWAPPABLE,
          ALL_OBJECTS[key][key2].STACKABLE,
          ALL_OBJECTS[key][key2].LOGIC,
          ALL_OBJECTS[key][key2].DOORS,
          ALL_OBJECTS[key][key2].TELEPORT,
          ALL_OBJECTS[key][key2].MAP,
          ALL_OBJECTS[key][key2].CLOSED)
          break;
        case 'EXIT':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new ExitRaidRoomObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
          ALL_OBJECTS[key][key2].BEHAVIOR,
          ALL_OBJECTS[key][key2].FIXED,
          ALL_OBJECTS[key][key2].TRADEABLE,
          ALL_OBJECTS[key][key2].LOOTABLE,
          ALL_OBJECTS[key][key2].SWAPPABLE,
          ALL_OBJECTS[key][key2].STACKABLE,
          ALL_OBJECTS[key][key2].LOGIC,
          ALL_OBJECTS[key][key2].DOORS,
          ALL_OBJECTS[key][key2].TELEPORT,
          ALL_OBJECTS[key][key2].MAP)
          break;
        case 'TEAMSORT':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new TeamSortRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
            ALL_OBJECTS[key][key2].BEHAVIOR,
            ALL_OBJECTS[key][key2].FIXED,
            ALL_OBJECTS[key][key2].TRADEABLE,
            ALL_OBJECTS[key][key2].LOOTABLE,
            ALL_OBJECTS[key][key2].SWAPPABLE,
            ALL_OBJECTS[key][key2].STACKABLE,
            ALL_OBJECTS[key][key2].LOGIC,
            ALL_OBJECTS[key][key2].DOORS)
            break;
        case 'RANDOMTEAMSORT':
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new RandomTeamSortRaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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
            ALL_OBJECTS[key][key2].BEHAVIOR,
            ALL_OBJECTS[key][key2].FIXED,
            ALL_OBJECTS[key][key2].TRADEABLE,
            ALL_OBJECTS[key][key2].LOOTABLE,
            ALL_OBJECTS[key][key2].SWAPPABLE,
            ALL_OBJECTS[key][key2].STACKABLE,
            ALL_OBJECTS[key][key2].LOGIC,
            ALL_OBJECTS[key][key2].DOORS,
            ALL_OBJECTS[key][key2].TEAMS,
            ALL_OBJECTS[key][key2].LOCATION)
            break;
        default:
          console.log(`No behavior found for ${ALL_OBJECTS[key][key2].id.toString()}, setting default Object`)
          raidObjects[ALL_OBJECTS[key][key2].id.toString()] = new RaidObject(Object.keys(ALL_OBJECTS[key])[index], ALL_OBJECTS[key][key2].id.toString(), ALL_OBJECTS[key][key2].type,
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

    // Queue after all objects and map are initialized

    throttle(() => {
      crystalAnswer = [];
      guessCount = 0;

      newAnswer();

    });

    throttle(() => {
      setNewGameStatus();
    });
  
  });

  

  Object.keys(ALL_ROOMS).forEach((key, index) => {
    console.log(key);
    raidRooms[key] = new RaidRoom(
      key,
      ALL_ROOMS[key].map_id,
      ALL_ROOMS[key].x,
      ALL_ROOMS[key].y,
      ALL_ROOMS[key].width,
      ALL_ROOMS[key].height,
      ALL_ROOMS[key].capacity);
  });

  

}

//Delete object
const deleteRaidObject = (id: string, player: string) => {
  game.deleteObject(raidObjects[id].map_id, raidObjects[id].id)
  delete raidPlayers[player];
  delete raidObjects[id];
}


//soundUrl: string, x: number, y: number, width: number, height: number
const playSoundinArea = (objectID: string, width: number, height: number, soundURL: string, volume: number) => {
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

const checkPlayersinArea = (x: number, y: number, width: number, height: number) => {
  let playerCount = 0;

  Object.keys(raidPlayersXY).forEach((key, index) => {
    if (raidPlayersXY[key].x >= x && raidPlayersXY[key].x <= x + (width - 1) && raidPlayersXY[key].y >= y && raidPlayersXY[key].y <= y + (height - 1)) {
      playerCount++;
    }
  });
}

//Deletes all non-Raid Objects in map_id
const deleteNonRaidObjects = (map_id: string) => {
  const map_objects = Object.values(game.partialMaps[map_id].objects);
  
  let key_array = []
  
  Object.keys(map_objects).forEach((key, index) => {
    
    let obj_id = map_objects[key].id;
    let obj_key = map_objects[key].key;

    if (obj_id.length > 6) {
      key_array.push(obj_key);
      console.log(`Non-RaidObject found. ${obj_key} marked for deletion`)
    }
  });

  let x = 0;
  for (let i = key_array.length - 1; i >= 0; i--) {
    setTimeout(() => {
       game.deleteObjectByKey(map_id, key_array[i]);
       console.log(`Object ${key_array[i]} has been deleted.`)
    }, 100 * x);
    x++;
  }

  console.log(`deleteNonRaidObject has finished.`)
}

//Loop test
// const eventLoop = setInterval(() => {
//   console.log('Hello!');
// }, 1000);

//When you want to stop the event loop
//clearInterval(eventLoop);

// const setCountdown = (time: number, player: string) => {
//   let x = time; //in seconds
//   const countdown = setInterval(() => {
//     if (x >= 0) {
//       //Code to execute every second;
//       game.setTextStatus("[ Time Left: "+ x +" ]", player);

//       console.log(x);
//       x--;
//       return x
      

//     }
//     else {
//       clearInterval(countdown);
//     }
    
//   }, 1000);

  
// }

function newAnswer(){
  for (let i = 0; i < 4; i++) {

    let randInt = Math.floor(Math.random() * 6)
    let randColor = "";
    console.log(randInt);

      for (let x = 0; x < 6; x++){
        if (randInt == 0){
          randColor = "blue";
        }
        else if (randInt == 1){
          randColor = "red";
        }
        else if (randInt == 2){
          randColor = "orange";
        }
        else if (randInt == 3){
          randColor = "purple";
        }
        else if (randInt == 4){
          randColor = "green";
        }
        else if (randInt == 5){
          randColor = "gray";
        }
        
      }

    crystalAnswer.push(randColor.toString());
  }
  console.log(crystalAnswer);

 
}

function readSubmission(){

    submissionArray = [];
    // Check Answer Spots
    let answer_spot_1 = game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].id.toString();
    let answer_spot_2 = game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].id.toString();
    let answer_spot_3 = game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].id.toString();
    let answer_spot_4 = game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].id.toString();

    let submission_1 = "";
    let submission_2 = "";
    let submission_3 = "";
    let submission_4 = "";
    
    if (answer_spot_1.includes("blue")){
      submission_1 = "blue";
    }
    else if (answer_spot_1.includes("red")){
      submission_1 = "red";
    }
    else if (answer_spot_1.includes("orange")){
      submission_1 = "orange";
    }
    else if (answer_spot_1.includes("purple")){
      submission_1 = "purple";
    }
    else if (answer_spot_1.includes("green")){
      submission_1 = "green";
    }
    else if (answer_spot_1.includes("gray")){
      submission_1 = "gray";
    }
    
    submissionArray.push(submission_1.toString());

    if (answer_spot_2.includes("blue")){
      submission_2 = "blue";
    }
    else if (answer_spot_2.includes("red")){
      submission_2 = "red";
    }
    else if (answer_spot_2.includes("orange")){
      submission_2 = "orange";
    }
    else if (answer_spot_2.includes("purple")){
      submission_2 = "purple";
    }
    else if (answer_spot_2.includes("green")){
      submission_2 = "green";
    }
    else if (answer_spot_2.includes("gray")){
      submission_2 = "gray";
    }
      
    submissionArray.push(submission_2.toString());
    
    if (answer_spot_3.includes("blue")){
      submission_3 = "blue";
    }
    else if (answer_spot_3.includes("red")){
      submission_3 = "red";
    }
    else if (answer_spot_3.includes("orange")){
      submission_3 = "orange";
    }
    else if (answer_spot_3.includes("purple")){
      submission_3 = "purple";
    }
    else if (answer_spot_3.includes("green")){
      submission_3 = "green";
    }
    else if (answer_spot_3.includes("gray")){
      submission_3 = "gray";
    }
    
    submissionArray.push(submission_3.toString());
    if (answer_spot_4.includes("blue")){
      submission_4 = "blue";
    }
    else if (answer_spot_4.includes("red")){
      submission_4 = "red";
    }
    else if (answer_spot_4.includes("orange")){
      submission_4 = "orange";
    }
    else if (answer_spot_4.includes("purple")){
      submission_4 = "purple";
    }
    else if (answer_spot_4.includes("green")){
      submission_4 = "green";
    }
    else if (answer_spot_4.includes("gray")){
      submission_4 = "gray";
    }
    
    submissionArray.push(submission_4.toString());


    // console.log(answer_spot_1 + ", " + answer_spot_2 + ", " + answer_spot_3 + ", " + answer_spot_4);
    console.log(submissionArray);

    
}

function setNewGameStatus(){

  inGame = 1;

  game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.status.id.toString(), {
    normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Pull lever to submit&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
    highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Pull lever to submit&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
  });

  game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.status_2.id.toString(), {
    normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Game in progress!&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
    highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Game in progress!&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
  });
  console.log("New game started");
}

// let exactHit = 0;
// let partialHit = 0;

let HIT = 0;
let BLOW = 0;

function confirm() {
  //HIT = Correct color and placement
  //BLOW = Only correct color

  HIT = 0;
  BLOW = 0;

  let tempAnswer = crystalAnswer.slice(), tempStack = submissionArray.slice();

  //Check if there's four inputs
  if (submissionArray.length != 4) {
      alert('You must select four inputs to submit!');
      return;
  }

  //Check for hits, label the index as HIT to ignore blow checks
  for (let i = 0; i < crystalAnswer.length; i++) {
      if (submissionArray[i] == crystalAnswer[i]) {
          tempAnswer[i] = 'HIT';
          tempStack[i] = 'HIT';
          HIT++;
      }
  }

  //Check for blows, ignoring any previously labeled HITs and BLOWs
  for (let i = 0; i < tempStack.length; i++) {
      switch (tempStack[i]) {
          case 'HIT':
          case 'BLOW':
              break;

          default:
              for (let j = 0; j < tempAnswer.length; j++) {
                  switch (tempAnswer[j]) {
                      case 'HIT':
                      case 'BLOW':
                          break;

                      default:
                          if (tempStack[i] == tempAnswer[j]) {
                              tempStack[i] = 'BLOW';
                              tempAnswer[j] = 'BLOW';
                              BLOW++;
                          }
                  }
              }
      }
  }

  //Check if all inputs are correct
  if (HIT == 4) {
    throttle(() => {

      inGame = 0;

      game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.status.id.toString(), {
        normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=You Won! Office points earned!&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
        highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=You Won! Office points earned!&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
      });

      game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.status_2.id.toString(), {
        normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Start a new game to earn more. :)&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
        highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Start a new game to earn more. :)&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
      });

      console.log("You Win!");
    });

    throttle(() => {
      game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_1.id.toString(), {
        normal: game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].normal,
        highlighted: game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].highlighted,
      });
    });

    throttle(() => {
      game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_2.id.toString(), {
        normal: game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].normal,
        highlighted: game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].highlighted,
      });
    });

    throttle(() => {
      game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_3.id.toString(), {
        normal: game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].normal,
        highlighted: game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].highlighted,
      });
    });

    throttle(() => {
      game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_4.id.toString(), {
        normal: game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].normal,
        highlighted: game.filterObjectsInMap(MAP_ID[0],  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].highlighted,
      });
    });

  }

}

const runSocks = (game) => {
	console.log("Running sockets now");
    game.subscribeToEvent('playerInteracts', (data, context) => {
    const objectID = data.playerInteracts.objId;
    console.log("player intereacted with,", objectID)

    //When interacting with reset
    //Change this part later 
    // if (objectID == '1000') {
    //   buildMainHall();
    //   game.setTextStatus('this guy hit the reset button', context.playerId);
    // }

    // Throttle and setTextStatus test

    



    // if (objectID == ALL_OBJECTS.KEVIN_WEBSOCKETS.sneaker.id){

    //   let today = new Date();
    //   // console.log(today);
    //   let dd = String(today.getDate()).padStart(2, '0');
    //   let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    //   let yyyy = today.getFullYear();

    //   // console.log( mm + '/' + dd + '/' + yyyy);

    //   let newToday = mm + '/' + dd + '/' + yyyy;
    //   console.log(newToday);

    //   axios.get("https://rtr-web.herokuapp.com/api/gather-tracker/betadwarf-cooking-test?player_id=" +context.playerId + "&field_1=" + newToday).then ((response)=>{
    //   // console.log(response.data);
    
    //   if (!response){
    //     console.log("No response");
    //     return;
    //   }
    //   if (!response.data){
    //     console.log("No response.data");
    //     return;
    //   }
      
    //   console.log(response.data.length);

    //   if (response.data.length >= 3){
    //     console.log("You've used all of your Action Points for today");
    //     game.chat(context.playerId, [], MAP_ID[0], { contents: "You've used all of your Action Points for today. Your available points will reset tomorrow." + '\n' + '\n'});
    //     return
    //   }

    //   const payload = {
    //     "version": "1",
    //     "display_name": context.player.name,
    //     "space_id": SPACE_ID,
    //     "map_id": MAP_ID[0],
    //     "player_id": context.playerId,
    //     "player_xy": context.player.x + ", " + context.player.y,
    //     "timestamp": Date.now(),
    //     "object_id": "Cook Test",
    //     "field_1": newToday,
    //     // "field_1": kitchen_spot_1.toString(),
    //     // "field_2": kitchen_spot_2.toString(),
    //     // "field_3": kitchen_spot_3.toString(),
    //   }
    //   axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/betadwarf-cooking-test", payload).then ((res)=>{
    //         console.log(res.data);
    //         // var data = res.data[res.data.length-1];
    //         game.chat("GLOBAL_CHAT", [], MAP_ID[0], { contents: context.player.name + " " + "used an Action Point! " + '\n' + (2 - response.data.length) + " Action Point(s) remain." + '\n' + '\n'});

    //   })

     

    //   console.log("Data entry success!");
      

    //   })


      


    // }

    if (objectID == ALL_OBJECTS.KEVIN_WEBSOCKETS.start.id){

        let json_data = data.playerInteracts.dataJson;
        console.log(json_data);

        let parsed_JSON = JSON.parse(json_data);
        console.log(parsed_JSON);

        let newGame = parsed_JSON.radio_input;

        console.log(newGame);
        console.log(parsed_JSON.radio_input);

        if (parsed_JSON = !undefined) {

          throttle(() => { 
        
            // Log Notes Written
            const payload = {
              "version": "1",
              "display_name": context.player.name,
              "space_id": SPACE_ID,
              "map_id": MAP_ID[0],
              "player_id": context.playerId,
              "player_xy":  context.player.x + ", " + context.player.y,
              "object_id": objectID,
              "field_1": newGame,
              "timestamp": Date.now()
            }
            // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerInteracts", payload).then ((res)=>{
            //       console.log(res.data);
            // })
          });

          if (newGame == "No"){
            return
          }

          if (newGame == "Yes"){
            // buildMainHall();
            throttle(() => {
              crystalAnswer = [];
              HIT = 0;
              BLOW = 0;
              guessCount = 0;

              newAnswer();
  
            });
           
            buildMainHall();
          }
          
        }

    }

    if (objectID == ALL_OBJECTS.KEVIN_WEBSOCKETS.check.id && inGame == 1 && game.filterObjectsInMap(MAP_ID[0], (obj) => obj.y == 12 && (obj.x == 14 || obj.x == 15 || obj.x == 16 || obj.x == 17)).length == 4){

      let today = new Date();
      // console.log(today);
      let dd = String(today.getDate()).padStart(2, '0');
      let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      let yyyy = today.getFullYear();

    //   // console.log( mm + '/' + dd + '/' + yyyy);

      let newToday = mm + '/' + dd + '/' + yyyy;
      console.log(newToday);

      axios.get("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-demo-dailycheck?player_id=" +context.playerId + "&field_2=" + newToday).then ((response)=>{
        // console.log(response.data);
      
        if (!response){
          console.log("No response");
          return;
        }
        if (!response.data){
          console.log("No response.data");
          return;
        }
        
        console.log("Response Length: " + response.data.length);
        console.log("Gems in guess submission: " + game.filterObjectsInMap(MAP_ID[0], (obj) => obj.y == 12 && (obj.x == 14 || obj.x == 15 || obj.x == 16 || obj.x == 17)).length)
        console.log("Players in map " + game.filterUidsInSpace((player) => player.map == MAP_ID[0]).length);

        // if (response.data.length >= 4){
        //   console.log("You've used all of your Action Points for today");
        //   game.chat(context.playerId, [], MAP_ID[0], { contents: "You've used all of your Action Points for today. Your available points will reset tomorrow." + '\n' + '\n'});
        //   return;
        // }

        const payload = {
          "version": "1",
          "display_name": context.player.name,
          "space_id": SPACE_ID,
          "map_id": MAP_ID[0],
          "player_id": context.playerId,
          "player_xy": context.player.x + ", " + context.player.y,
          "timestamp": Date.now(),
          "object_id": "Check daily points",
          "field_1": response.data.length,
          "field_2": newToday,

        }

        // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-demo-dailycheck", payload).then ((res)=>{
        //       console.log(res.data);
        //         // var data = res.data[res.data.length-1];
        //         // game.chat("GLOBAL_CHAT", [], MAP_ID[0], { contents: context.player.name + " " + "used an Action Point! " + '\n' + (2 - response.data.length) + " Action Point(s) remain." + '\n' + '\n'});

        // })

     

      // if (response.data.length < 5){
      if (response.data.length != undefined){

      
          // console.log("Data entry success!");

          game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.check.id.toString(), {
            normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/VqouPC0Xut0YzgCvM33FIm",
            highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/VqouPC0Xut0YzgCvM33FIm",
          });

          setTimeout(() => {
            game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.check.id.toString(), {
              normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/57VP7npw7WXaVthsvrAHwJ",
              highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/MVKh7TNZo19FTmpYhjsjI1",
            });
          }, 1500)
          
        
          readSubmission();

          if (submissionArray.length == 4){
            guessCount++;
            console.log(guessCount);
          }


          
      
      
        

          if (guessCount == 1){

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_1_1.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_1_2.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_1_3.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_1_4.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].highlighted,
              });
            });

            throttle(() => {

              confirm();

              console.log("Exact Hit: " + HIT + " | Partial Hit: " + BLOW);
          
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.result_1.id.toString(), {
                normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                
              });

            });

          }

          if (guessCount == 2){


            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_2_1.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_2_2.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_2_3.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_2_4.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].highlighted,
              });
            });

            throttle(() => {
          

              confirm();

              console.log("Exact Hit: " + HIT + " | Partial Hit: " + BLOW);
          
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.result_2.id.toString(), {
                normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                
              });

            });

          }

          if (guessCount == 3){


            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_3_1.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_3_2.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_3_3.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_3_4.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].highlighted,
              });
            });

            throttle(() => {
          

              confirm();

              console.log("Exact Hit: " + HIT + " | Partial Hit: " + BLOW);
          
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.result_3.id.toString(), {
                normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                
              });

            });

          }

          if (guessCount == 4){


            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_4_1.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_4_2.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_4_3.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_4_4.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].highlighted,
              });
            });

            throttle(() => {
          

              confirm();

              console.log("Exact Hit: " + HIT + " | Partial Hit: " + BLOW);
          
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.result_4.id.toString(), {
                normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                
              });

            });

          }

          if (guessCount == 5){


            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_5_1.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_5_2.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_5_3.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_5_4.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].highlighted,
              });
            });

            throttle(() => {
          

              confirm();

              console.log("Exact Hit: " + HIT + " | Partial Hit: " + BLOW);
          
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.result_5.id.toString(), {
                normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                
              });

            });

          }

          if (guessCount == 6){


            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_6_1.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_6_2.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_6_3.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_6_4.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].highlighted,
              });
            });

            throttle(() => {
          

              confirm();

              console.log("Exact Hit: " + HIT + " | Partial Hit: " + BLOW);
          
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.result_6.id.toString(), {
                normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                
              });

            });

          }

          if (guessCount == 7){


            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_7_1.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_7_2.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_7_3.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_7_4.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].highlighted,
              });
            });

            throttle(() => {
          

              confirm();

              console.log("Exact Hit: " + HIT + " | Partial Hit: " + BLOW);
          
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.result_7.id.toString(), {
                normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                
              });

            });

          }


          if (guessCount == 8){


            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_8_1.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_1_x && obj.y == sub_1_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_8_2.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_2_x && obj.y == sub_2_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_8_3.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_3_x && obj.y == sub_3_y)[0].highlighted,
              });
            });

            throttle(() => {
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_8_4.id.toString(), {
                normal: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].normal,
                highlighted: game.filterObjectsInMap(context.player.map,  (obj) => obj.x == sub_4_x && obj.y == sub_4_y)[0].highlighted,
              });
            });

            throttle(() => {
          

              confirm();

              console.log("Exact Hit: " + HIT + " | Partial Hit: " + BLOW);
          
              game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.result_8.id.toString(), {
                normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Exact : " + HIT + "  l  Close : " + BLOW + "&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                
              });

            });

            if (HIT < 4){

                inGame = 0;
        
                throttle(() => {
        
                  game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.status.id.toString(), {
                    normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=You Lost! New game?&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                    highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=You Lost! New game?&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                  });
            
                  game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.status_2.id.toString(), {
                    normal: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Start a new game to try again.&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                    highlighted: "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=Start a new game to try again&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
                  });
            
                  console.log("You Lost!");
                });

                throttle(() => {
                  if (crystalAnswer[0] == "blue"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_1.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FKlXm4V64UBYuQQuN?alt=media&token=e20f544d-d47d-43f6-8194-c8e1f1e16ddd",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FKlXm4V64UBYuQQuN?alt=media&token=e20f544d-d47d-43f6-8194-c8e1f1e16ddd",
                    });
                  }
                  else if (crystalAnswer[0] == "red"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_1.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/PXwK0mA3yHtnQPN1PuY6zk",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/PXwK0mA3yHtnQPN1PuY6zk",
                    });
                  }
                  else if (crystalAnswer[0] == "orange"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_1.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/OMEKxZ36SZZ4H3AUuTOWol",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/OMEKxZ36SZZ4H3AUuTOWol",
                    });
                  }
                  else if (crystalAnswer[0] == "purple"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_1.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FcckeRLmeMY9R6vF1?alt=media&token=d93ee66d-3341-4674-a66d-c6ad7ad429de",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FcckeRLmeMY9R6vF1?alt=media&token=d93ee66d-3341-4674-a66d-c6ad7ad429de",
                    });
                  }
                  else if (crystalAnswer[0] == "green"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_1.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F9Yww3v4mr4Riru4w?alt=media&token=2912e83d-0076-4210-8fd3-b7fcd2efb05d",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F9Yww3v4mr4Riru4w?alt=media&token=2912e83d-0076-4210-8fd3-b7fcd2efb05d",
                    });
                  }
                  else if (crystalAnswer[0] == "gray"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_1.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/RItc5gsMEhLSntGIV8YVUW",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/RItc5gsMEhLSntGIV8YVUW",
                    });
                  }

                });
            
                throttle(() => {
                  if (crystalAnswer[1] == "blue"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_2.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FKlXm4V64UBYuQQuN?alt=media&token=e20f544d-d47d-43f6-8194-c8e1f1e16ddd",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FKlXm4V64UBYuQQuN?alt=media&token=e20f544d-d47d-43f6-8194-c8e1f1e16ddd",
                    });
                  }
                  else if (crystalAnswer[1] == "red"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_2.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/PXwK0mA3yHtnQPN1PuY6zk",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/PXwK0mA3yHtnQPN1PuY6zk",
                    });
                  }
                  else if (crystalAnswer[1] == "orange"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_2.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/OMEKxZ36SZZ4H3AUuTOWol",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/OMEKxZ36SZZ4H3AUuTOWol",
                    });
                  }
                  else if (crystalAnswer[1] == "purple"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_2.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FcckeRLmeMY9R6vF1?alt=media&token=d93ee66d-3341-4674-a66d-c6ad7ad429de",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FcckeRLmeMY9R6vF1?alt=media&token=d93ee66d-3341-4674-a66d-c6ad7ad429de",
                    });
                  }
                  else if (crystalAnswer[1] == "green"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_2.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F9Yww3v4mr4Riru4w?alt=media&token=2912e83d-0076-4210-8fd3-b7fcd2efb05d",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F9Yww3v4mr4Riru4w?alt=media&token=2912e83d-0076-4210-8fd3-b7fcd2efb05d",
                    });
                  }
                  else if (crystalAnswer[1] == "gray"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_2.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/RItc5gsMEhLSntGIV8YVUW",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/RItc5gsMEhLSntGIV8YVUW",
                    });
                  }
                });

            
                throttle(() => {
                  if (crystalAnswer[2] == "blue"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_3.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FKlXm4V64UBYuQQuN?alt=media&token=e20f544d-d47d-43f6-8194-c8e1f1e16ddd",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FKlXm4V64UBYuQQuN?alt=media&token=e20f544d-d47d-43f6-8194-c8e1f1e16ddd",
                    });
                  }
                  else if (crystalAnswer[2] == "red"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_3.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/PXwK0mA3yHtnQPN1PuY6zk",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/PXwK0mA3yHtnQPN1PuY6zk",
                    });
                  }
                  else if (crystalAnswer[2] == "orange"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_3.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/OMEKxZ36SZZ4H3AUuTOWol",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/OMEKxZ36SZZ4H3AUuTOWol",
                    });
                  }
                  else if (crystalAnswer[2] == "purple"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_3.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FcckeRLmeMY9R6vF1?alt=media&token=d93ee66d-3341-4674-a66d-c6ad7ad429de",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FcckeRLmeMY9R6vF1?alt=media&token=d93ee66d-3341-4674-a66d-c6ad7ad429de",
                    });
                  }
                  else if (crystalAnswer[2] == "green"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_3.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F9Yww3v4mr4Riru4w?alt=media&token=2912e83d-0076-4210-8fd3-b7fcd2efb05d",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F9Yww3v4mr4Riru4w?alt=media&token=2912e83d-0076-4210-8fd3-b7fcd2efb05d",
                    });
                  }
                  else if (crystalAnswer[2] == "gray"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_3.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/RItc5gsMEhLSntGIV8YVUW",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/RItc5gsMEhLSntGIV8YVUW",
                    });
                  }
                });
            
                throttle(() => {
                  if (crystalAnswer[3] == "blue"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_4.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FKlXm4V64UBYuQQuN?alt=media&token=e20f544d-d47d-43f6-8194-c8e1f1e16ddd",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FKlXm4V64UBYuQQuN?alt=media&token=e20f544d-d47d-43f6-8194-c8e1f1e16ddd",
                    });
                  }
                  else if (crystalAnswer[3] == "red"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_4.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/PXwK0mA3yHtnQPN1PuY6zk",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/PXwK0mA3yHtnQPN1PuY6zk",
                    });
                  }
                  else if (crystalAnswer[3] == "orange"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_4.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/OMEKxZ36SZZ4H3AUuTOWol",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/OMEKxZ36SZZ4H3AUuTOWol",
                    });
                  }
                  else if (crystalAnswer[3] == "purple"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_4.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FcckeRLmeMY9R6vF1?alt=media&token=d93ee66d-3341-4674-a66d-c6ad7ad429de",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FcckeRLmeMY9R6vF1?alt=media&token=d93ee66d-3341-4674-a66d-c6ad7ad429de",
                    });
                  }
                  else if (crystalAnswer[3] == "green"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_4.id.toString(), {
                      normal: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F9Yww3v4mr4Riru4w?alt=media&token=2912e83d-0076-4210-8fd3-b7fcd2efb05d",
                      highlighted: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F9Yww3v4mr4Riru4w?alt=media&token=2912e83d-0076-4210-8fd3-b7fcd2efb05d",
                    });
                  }
                  else if (crystalAnswer[3] == "gray"){
                    game.setObject(MAP_ID[0], ALL_OBJECTS.KEVIN_WEBSOCKETS.guess_9_4.id.toString(), {
                      normal: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/RItc5gsMEhLSntGIV8YVUW",
                      highlighted: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/RItc5gsMEhLSntGIV8YVUW",
                    });
                  }
                });

            }

          }

          throttle(() => { 
        
            // Log Player Checks
            const payload = {
              "version": "1",
              "display_name": context.player.name,
              "space_id": SPACE_ID,
              "map_id": MAP_ID[0],
              "player_id": context.playerId,
              "player_xy":  context.player.x + ", " + context.player.y,
              "object_id": objectID,
              "field_1": crystalAnswer,
              "field_2": guessCount,
              "field_3": submissionArray,
              "field_4": HIT,
              "field_5": BLOW,
              "field_6": game.filterUidsInSpace((player) => player.map == MAP_ID[0]).length,
      
      
              "timestamp": Date.now()
            }
            // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerInteracts", payload).then ((res)=>{
            //       console.log(res.data);
            // })
    
        });

      }

      });

    }

    if (objectID == ALL_OBJECTS.KEVIN_WEBSOCKETS.note.id){

      let json_data = data.playerInteracts.dataJson;
      console.log(json_data);

      let parsed_JSON = JSON.parse(json_data);
      console.log(parsed_JSON);

      let newWord = parsed_JSON.secret_word;

      console.log(newWord);
      console.log(parsed_JSON.secret_word);

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

        throttle(() => { 
        
          // Log Notes Written
          const payload = {
            "version": "1",
            "display_name": context.player.name,
            "space_id": SPACE_ID,
            "map_id": MAP_ID[0],
            "player_id": context.playerId,
            "player_xy":  context.player.x + ", " + context.player.y,
            "object_id": objectID,
            "field_1": newWord,
            "timestamp": Date.now()
          }
          // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerInteracts", payload).then ((res)=>{
          //       console.log(res.data);
          // })
        });

      }

    }

    


    //Classes experimentation
    if (raidObjects[objectID].id != 'undefined') {
      console.log (objectID + " has been interacted with");
      // playSoundinArea(objectID, 9, 9, "https://s3.amazonaws.com/raidtheroom.online/gather/kevinwebsockets/teleport-quick.wav", .25);
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
            // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
            //       console.log(res.data);
            // })
        
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
              properties: {}
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
              // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
              //       console.log(res.data);
              // })
          
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
              properties: {}
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
          properties: {}
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
          // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
          //       console.log(res.data);
          // })
      
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
            // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
            //       console.log(res.data);
            // })
        
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
            // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
            //       console.log(res.data);
            // })
        
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
            // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
            //       console.log(res.data);
            // })
        
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
        properties: {}
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
        // axios.post("https://rtr-web.herokuapp.com/api/gather-tracker/mastermind-test-playerTriggers", payload).then ((res)=>{
        //       console.log(res.data);
        // })
    
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

       


        // if (raidObjects[key].BEHAVIOR == 'PUSH') {
        //   let newX = context.player.x;
        //   let newY = context.player.y;

        //   if(newX == raidObjects[key].x && newY == raidObjects[key].y) {
        //     switch (data.playerMoves.direction) {
        //       case 1:
        //       case 2:
        //           newY += 1;
        //           break;
        //       case 3:
        //       case 4:
        //           newY -= 1;
        //           break;
        //       case 5:
        //       case 6:
        //           newX -= 1;
        //           break;
        //       case 7:
        //       case 8:
        //           newX += 1;
        //           break;
        //       default:
        //           console.log('Invalid direction??');
        //           break;
        //     }

        //     raidObjects[key].setMove(newX, newY);
        //     raidObjects[key].move(newX, newY);
        //   }
        // }

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

      //Set x == plates.length for number of plates to be stepped on
      if (x == raidRooms['first-puzzle-room'].capacity) {
        raidObjects['5000'].setTypeToFive();
      } else {
        raidObjects['5000'].setTypeToZero();
      }
    }

    // if (context.player.isAlone == true){
    //   console.log(context.player.name + " is alone");
    // }
    // else if (context.player.isAlone == false || context.player.inConversation == true || context.player.activelySpeaking == 1){
    //   console.log(context.player.name + " isAlone: " + context.player.isAlone + " is inConversation: " + context.player.inConversation + " is activelySpeaking: " + context.player.activelySpeaking);
    // }

    // console.log(context.player.name + " isAlone: " + context.player.isAlone + " is inConversation: " + context.player.inConversation + " is activelySpeaking: " + context.player.activelySpeaking);

    // console.log(context.player.name + " - " + game.filterUidsInSpace((player) => player.isAlone == false));

  });

  game.subscribeToEvent("playerChats", (data, context) => {
    const message = data.playerChats;
    console.log(message);
  });

  // game.subscribeToEvent("playerSetsIsAlone", (data, context) => {
  //   console.log(context.player.name + " sets is alone");
  // });


  // game.subscribeToEvent("playerActivelySpeaks", (data, context) => {
    // const message = data.playerActivelySpeaks;
    // console.log(message);

    // if (data.playerActivelySpeaks && context.player.isAlone == false){
      // console.log(context.player.name + "Speaking together");
      // console.log(Object.keys(game.filterPlayersInSpace((player) => player.isAlone == false)));
      // console.log(context.player.name + " - " + game.filterUidsInSpace((player) => player.isAlone == false));
      // console.log(Object.keys(game.players));
    // }

    // const payload = {
    //   "space_id": SPACE_ID,
    //   "map_id": MAP_ID[0],
    //   "player_id": context.playerId,
    //   "increment": "1",
    // }
    // axios.post("https://rtr-web.herokuapp.com/api/gather-counter/kevinwebsockets", payload).then ((res)=>{
    //       console.log(res.data);
    // })

  // });

}

// *** Heroku Online Code (Start) ***

app.listen(port, host, function() {
  console.log("Server started.......");
});

// *** Heroku Online Code (End) **

//Experimenting with classes
class RaidObject {
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

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string) {
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
    game.setObject(this.map_id, this.id, {
      type: this.type,
      normal: this.normal,
      highlighted: this.highlighted,
      x: this.x,
      y: this.y
    });
  }

  move(x: number, y: number) {
    game.setObject(this.map_id, this.id, {
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

    game.setObject(this.map_id, this.id, {
      type: this.type,
      normal: this.normal,
      highlighted: this.highlighted,
      x: x,
      y: y
    });
  }

  setSprite(normal: string) {
    game.setObject(this.map_id, this.id, {
      normal: normal,
      highlighted: normal
    });
  }

  setTypeToZero() {
    if (this.type != 0) {
      this.type = 0;
      game.setObject(this.map_id, this.id, {
        type: 0
      });
    }
  }

  setTypeToFive() {
    if (this.type != 5) {
      this.type = 5;
      game.setObject(this.map_id, this.id, {
        type: 5
      });
    }
  }

  flipType() {
    this.type == 5 ? this.type = 0 : this.type = 5;
    game.setObject(this.map_id, this.id, {
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

    game.moveMapObject(this.map_id, this.id, {x, y}, 180, "Linear");
  }
}

class FollowRaidObject extends RaidObject {
  carried: string;

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.carried = 'none'
  }

  interaction(player: string): void {
    console.log(`Object ${this.id} has been assigned to ${player} (FOLLOW)`);
    
    if (this.customState == 'none') {
      this.customState = player;
      this.previewMessage = "Now following: " + game.getPlayer(player).name;
    } else {
      this.customState = 'none';
      this.previewMessage = "Press x to make me follow";
    }

  }

  deleteObject(id: string): void {
    game.deleteObject(raidObjects[id].map_id, raidObjects[id].id)
  }
}

//To be deprecated
// class TakeRaidObject extends RaidObject {
//   constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, LOGIC: string, DOORS: string) {
//     super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, LOGIC, DOORS)
//   }

//   interaction(player: string): void {
//     console.log(`Object ${this.id} has been assigned to ${player} (TAKE) in ${this.map_id}`);

//     if(raidObjects[this.id + 'a'] == undefined) this.createBaseDrop()

//     this.setRaidObjectCustomState(player);
    
//     game.setObject(this.map_id, this.id, {
//       type: 0,
//       normal: BLANK,
//       highlighted: BLANK
//     });

//     if (raidObjects[raidObjects[this.LOGIC].DOORS] != undefined && raidObjects[raidObjects[this.LOGIC].DOORS].normal == DOORS.open) {
//       for (let i = 0; i < 3; i++) {
//         game.setObject(this.map_id, (parseInt(raidObjects[raidObjects[this.LOGIC].DOORS].id) + i).toString(), {
//           type: 0,
//           normal: DOORS.close,
//           highlighted: DOORS.close
//         });

//         raidObjects[(parseInt(raidObjects[raidObjects[this.LOGIC].DOORS].id) + i).toString()].setSprite(DOORS.close);

//         game.setImpassable(this.map_id, raidObjects[raidObjects[this.LOGIC].DOORS].x, raidObjects[raidObjects[this.LOGIC].DOORS].y + i, true);
//       }
//     }

//     raidObjects[this.LOGIC].move(raidObjects[this.LOGIC].x, raidObjects[this.LOGIC].y)
//   }

//   createBaseDrop() {
//     raidObjects[this.id + 'a'] = new DropRaidObject(
//       this.name + 'Temp',
//       this.id + 'a', 
//       5,
//       this.x,
//       this.y,
//       this.width,
//       this.height,
//       this.distThreshold,
//       'Press \'x\' to drop off the brain',
//       PLATE,
//       PLATE,
//       'none',
//       this.map_id,
//       this.COOLDOWN,
//       'DROP',
//       this.id,
//       this.DOORS)

//       game.setObject(this.map_id, this.id + 'a', {
//         id: this.id +'a',
//         type: 5,
//         x: this.x,
//         y: this.y,
//         width: this.width,
//         height: this.height,
//         distThreshold: this.distThreshold,
//         previewMessage: 'Press \'x\' to drop off the brain',
//         normal: PLATE.glass,
//         highlighted: PLATE.glass,
//         customState: 'none'
//       });
//   }
// }

// //To be deprecated
// class DropRaidObject extends RaidObject {
//   constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, LOGIC: string, DOORS: string) {
//     super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, LOGIC, DOORS)
//   }

//   interaction(player: string): void {
//     console.log(`Object ${this.id} has been interacted with by ${player} (DROP)`);

//     if (raidObjects[this.LOGIC].customState == player) {
//       game.setObject(this.map_id, this.id, {
//         type: 0,
//         normal: BLANK,
//         highlighted: BLANK
//       });

//       if (this.DOORS != 'none') {
//         for (let i = 0; i < 3; i++) {
//           game.setObject(this.map_id, (parseInt(raidObjects[this.DOORS].id) + i).toString(), {
//             type: 0,
//             normal: DOORS.open,
//             highlighted: DOORS.open
//           });

//           raidObjects[(parseInt(raidObjects[this.DOORS].id) + i).toString()].setSprite(DOORS.open);

//           game.setImpassable(this.map_id, raidObjects[this.DOORS].x, raidObjects[this.DOORS].y + i, false);
//         }
//       }


//       raidObjects[this.LOGIC].move(this.x, this.y);
//     }
//   }
// }

class PushRaidObject extends RaidObject {
  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    game.setMapCollisions(this.map_id, this.x, this.y, 1, 1, Buffer.from([0x01]).toString("base64"));
  }

  interaction(player: string): void {
    let player_x = game.getPlayer(player).x, player_y = game.getPlayer(player).y;
    let new_x = this.x, new_y = this.y
    let up: number, down: number, left: number, right: number;

    up = down = left = right = 0x00;

    if (player_y == this.y) {
      player_x < this.x ? new_x++: new_x--;
    } else if (player_x == this.x) {
      player_y < this.y ? new_y++ : new_y--;
    }

    const map_objects = Object.values(game.partialMaps[this.map_id].objects);
    let blocked = false;

    Object.keys(map_objects).forEach((key, value) => {
      if (map_objects[key].x == new_x && map_objects[key].y == new_y) blocked = true;
    });

    if(game.partialMaps[this.map_id].collisions[new_y][new_x]) blocked = true;

    this.flipType();

    //Maybe need better mask method
    if (!blocked) {
      game.setMapCollisions(this.map_id, this.x, this.y, 1, 1, Buffer.from([0x00]).toString("base64"));
      this.setMove(new_x, new_y);
      game.setMapCollisions(this.map_id, this.x, this.y, 1, 1, Buffer.from([0x01]).toString("base64"));
    }

    setTimeout(() => {
      this.flipType();
    }, this.COOLDOWN);
  }
}

class ChangeRaidObject extends RaidObject {
  STATES: []
  tracker: number
  buttonPressed: boolean
  GROUP: []

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, STATES: [], GROUP: []) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.STATES = STATES
    this.tracker = 0
    this.buttonPressed = false
    this.GROUP = GROUP
  }

  interaction (player: string) {
    if(this.buttonPressed) {
      console.log("Too fast!");
      //game.chat(player, [], '', "Too fast!");
      return;
    }

    this.tracker < this.STATES.length - 1 ? this.tracker++ : this.tracker = 0;

    game.setObject(this.map_id, this.id, {
      type: this.type,
      normal: this.STATES[this.tracker],
      highlighted: this.STATES[this.tracker],
      previewMessage: 'On cooldown'
    });

    console.log(this.tracker)
    this.buttonPressed = true;
    setTimeout(() => {
        this.buttonPressed = false;
        game.setObject(this.map_id, this.id, {
          previewMessage: this.previewMessage
        });
    }, this.COOLDOWN)

    if (this.GROUP != [] && player != 'ignore') {
      for (let i = 0; i < this.GROUP.length; i++) {
        raidObjects[this.GROUP[i]].interaction('ignore')
      }
    }
  }
}

class TeleportRaidObject extends RaidObject {
  TELEPORT: {
    x: number,
    y: number
  }
  MAP: string

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, TELEPORT: {x: number, y: number}, MAP: string) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.TELEPORT = TELEPORT
    this.MAP = MAP
  }

  interaction(player: string): void {
    console.log(`Object ${this.id} has teleported ${player}`);
    
    game.teleport(this.MAP, this.TELEPORT.x, this.TELEPORT.y, player);
  }
}

class LightsOutRaidObject extends RaidObject{
  normalOne: string
  normalTwo: string
  GROUP: []
  NEXT: []
  
  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, normalTwo: string, GROUP: [], NEXT: []) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.normalOne = normal
    this.normalTwo = normalTwo
    this.GROUP = GROUP
    this.NEXT = NEXT
  }

  interaction(player: string) {
    this.flip()

    for (let i = 0; i < this.NEXT.length; i++) {
      raidObjects[this.NEXT[i]].flip();
    }

    let clear = true;

    for (let i = 0; i < this.GROUP.length; i++) {
      if (raidObjects[this.GROUP[i]].normal != this.normalTwo) {
        clear = false;
        break;
      }
    }

    if (clear) {
      console.log('Lights out successfully cleared')
    }
  }

  flip() {
    this.normal == this.normalOne ? this.normal = this.normalTwo : this.normal = this.normalOne

    game.setObject(this.map_id, this.id, {
      normal: this.normal,
      highlighted: this.normal
    });
  }
}

//To be deprecated
// class SwapRaidObject extends RaidObject {
//   constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string) {
//     super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, LOGIC, DOORS)
//   }

//   interaction(player: string): void {
//     console.log(`Object ${this.id} has been assigned to ${player} (SWAP)`);

//     if (raidPlayers[player] != undefined) {
//       raidObjects[raidPlayers[player]].setRaidObjectCustomState('none');
//       raidObjects[raidPlayers[player]].setMove(this.x, this.y);
//     } else {
//       let someObject = {
//         "id": this.id + 'a',
//         "type": 5,
//         "x": this.x,
//         "y": this.y,
//         "width": this.width,
//         "height": this.height,
//         "distThreshold": this.distThreshold,
//         "previewMessage": "Press x to drop the object",
//         "normal": BLANK,
//         "highlighted": BLANK,
//         "customState": "none",
//         "properties": {}
//       }
//       setRaidObject(0, this.map_id, someObject);
//       raidObjects[this.id + 'a'] = new SwapPadRaidObject(
//         this.name + 'Temp',
//         this.id + 'a', 
//         this.type,
//         this.x,
//         this.y,
//         this.width,
//         this.height,
//         this.distThreshold,
//         this.previewMessage,
//         this.normal,
//         this.highlighted,
//         this.customState,
//         this.map_id,
//         this.COOLDOWN,
//         'SWAPPAD',
//         true,
//         this.id,
//         this.DOORS)
//     }

//     raidPlayers[player] = this.id
//     this.setRaidObjectCustomState(player);
//   }
// }

// class SwapPadRaidObject extends RaidObject {
//   constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string) {
//     super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, LOGIC, DOORS)
//   }

//   interaction(player: string): void {
//     console.log('Pad interaction called')
//     if (raidPlayers[player] != undefined) {
//       raidObjects[raidPlayers[player]].setRaidObjectCustomState('none');
//       raidObjects[raidPlayers[player]].setMove(this.x, this.y);
//       deleteRaidObject(this.id, player);
//     }
//   }
// }

class SwapPositionRaidObject extends RaidObject {
  GROUP: []

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, GROUP: []) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.GROUP = GROUP
  }

  interaction(player: string): void {
    console.log(`Object ${this.id} has been assigned to ${player} (POSITION SWAP)`);
    
    if (this.LOGIC != 'none') {
      let tempX = raidObjects[this.LOGIC].x;
      let tempY = raidObjects[this.LOGIC].y;

      raidObjects[this.LOGIC].setMove(this.x, this.y);
      raidObjects[this.id].setMove(tempX, tempY);
    } else {
      let firstX = 0;
      let firstY = 0;
      for( let i = 0; i < this.GROUP.length; i++) {
        if (i > 0) {
          if (i == this.GROUP.length - 1) {
            raidObjects[this.GROUP[i]].setMove(firstX, firstY);
          } else {
            raidObjects[this.GROUP[i]].setMove(raidObjects[this.GROUP[i + 1]].x, raidObjects[this.GROUP[i + 1]].y);
          }
        } else {
          firstX = raidObjects[this.GROUP[i]].x;
          firstY = raidObjects[this.GROUP[i]].y;
          raidObjects[this.GROUP[i]].setMove(raidObjects[this.GROUP[i + 1]].x, raidObjects[this.GROUP[i + 1]].y);
        }
      }


      // let i = 0, j = 1

      // let tempX = raidObjects[this.GROUP[i]].x;
      // let tempY = raidObjects[this.GROUP[i]].y;

      // raidObjects[this.GROUP[i]].setMove(raidObjects[this.GROUP[j]].x, raidObjects[this.GROUP[j]].y);
      // raidObjects[this.GROUP[j]].setMove(tempX, tempY);
    }
    
  }
}

class ChangeRandomRaidObject extends RaidObject {
  STATES: []
  tracker: number
  buttonPressed: boolean
  GROUP: []

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, STATES: [], GROUP: []) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.STATES = STATES
    this.tracker = 0
    this.buttonPressed = false
    this.GROUP = GROUP
  }
  
  interaction (player: string) {
    if(this.buttonPressed) {
      console.log("Too fast!");
      return;
    }
    // Randomize the object image

    this.tracker = Math.floor(Math.random() * this.STATES.length);

    game.setObject(this.map_id, this.id, {
      type: this.type,
      normal: this.STATES[this.tracker],
      highlighted: this.STATES[this.tracker],
      previewMessage: 'On cooldown'
    });

    game.setObject(this.map_id, this.id, {
      type: 0,
    });

    console.log(this.tracker)
    this.buttonPressed = true;
    setTimeout(() => {
        this.buttonPressed = false;
        game.setObject(this.map_id, this.id, {
          type: 5,
          previewMessage: this.previewMessage
        });
    }, this.COOLDOWN)

    if (this.GROUP != [] && player != 'ignore') {
      for (let i = 0; i < this.GROUP.length; i++) {
        raidObjects[this.GROUP[i]].interaction('ignore')
      }
    }
  }
}

class ChangeRandomAnimatedRaidObject extends RaidObject {
  STATES: []
  tracker: number
  buttonPressed: boolean

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, STATES: [], GROUP: []) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.STATES = STATES
    this.tracker = 0
    this.buttonPressed = false
  }
  

  
  interaction (player: string) {
    let that = this;

    if (that.buttonPressed == false){
      game.setObject(that.map_id, that.id, {
        previewMessage: 'On cooldown'
      });

      game.setObject(that.map_id, that.id, {
        type: 0,
      });

      that.buttonPressed = true;
      setTimeout(() => {
        that.buttonPressed = false;
          game.setObject(that.map_id, that.id, {
            type: 5,
            previewMessage: that.previewMessage
          });
      }, 2000)
    }

    //Randomize the object image with delay for animation
    
    if (that.buttonPressed == true){
      (function myLoop(i) {
        setTimeout(() => {
          //console.log('Step: ' + i); //  your code here  
          
          // that.tracker = Math.floor(Math.random() * that.STATES.length);
          that.tracker < that.STATES.length - 1 ? that.tracker++ : that.tracker = 0; // Sequential

            console.log('image: ' + that.tracker)
            game.setObject(that.map_id, that.id, {
              normal: that.STATES[that.tracker],
              highlighted: that.STATES[that.tracker],
            });
            
          if (--i) myLoop(i);   //  decrement i and call myLoop again if i > 0
        }, 500)
      })(4);                   //  pass the number of iterations as an argument
    }
  }

}

class WarpRaidObject extends RaidObject {
  GROUP: []
  tracker: number
  limit: number
  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, GROUP: []) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.GROUP = GROUP
    this.tracker = 0
    this.limit = GROUP.length - 1
  }

  interaction(player: string): void {
    let random = Math.floor(Math.random() * this.limit);
    if (random == this.tracker) random++;
    this.tracker = random;

    let x = 0, y = 0, width = 0, height = 0, coords: []
    let temp = this.GROUP[random]

    Object.keys(temp).forEach((key, index) => {
      switch (key) {
        case 'x':
          x = temp[key];
          break
        case 'y':
          y = temp[key];
          break
        case 'width':
          width = temp[key];
          break
        case 'height':
          height = temp[key];
          break
        case 'coords':
          coords = temp[key];
      }
    });

    let randomX = Math.floor(Math.random() * width + x);
    let randomY = Math.floor(Math.random() * height + y);

    if (coords.length > 0) {
      let rando = coords[Math.floor(Math.random() * coords.length)]

      for (let i = 0; i < 2; i++) {
        if (i == 0) randomX = rando[i];
        if (i == 1) randomY = rando[i];
      }
    }

    this.setMove(randomX, randomY);
  }
}

class MemoryMatchRaidObject extends RaidObject {
  GROUP: []
  

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, GROUP: [], flippedImage: string) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.GROUP = GROUP
    this.flippedImage = flippedImage
    this.isFlipped = false
    this.isMatched = false
  }

  interaction(player: string): void {
    this.isFlipped = true;
    this.setSprite(this.flippedImage);
    this.flipType();

    let firstFlip = 'none'

    for (let i = 0; i < this.GROUP.length; i++) {
      if (raidObjects[this.GROUP[i]].isFlipped == true) {
        firstFlip = this.GROUP[i];
        
        for (let i = 0; i < this.GROUP.length; i++) {
          if (!raidObjects[this.GROUP[i]].isMatched) {
            raidObjects[this.GROUP[i]].flipType();
          }
        }

        break;
      }
    }

    if (firstFlip != 'none') {
      if (raidObjects[firstFlip].flippedImage == raidObjects[this.id].flippedImage) {
        raidObjects[firstFlip].isMatched = true;
        raidObjects[this.id].isMatched = true;

        for (let i = 0; i < this.GROUP.length; i++) {
          if (!raidObjects[this.GROUP[i]].isMatched) {
            raidObjects[this.GROUP[i]].flipType();
          }
        }
      } else {
        setTimeout(() => {
          console.log('settimeout called')
          raidObjects[firstFlip].flipType();
          raidObjects[this.id].flipType();
          raidObjects[firstFlip].setSprite(raidObjects[firstFlip].normal);
          raidObjects[this.id].setSprite(this.normal); 

          for (let i = 0; i < this.GROUP.length; i++) {
            if (!raidObjects[this.GROUP[i]].isMatched) {
              raidObjects[this.GROUP[i]].flipType();
            }
          }
        }, 1000);
      }
      raidObjects[firstFlip].isFlipped = false;
      raidObjects[this.id].isFlipped = false;
    }

    if (this.isMatched) { console.log(player)}
    console.log(this.checkAllMatch());
  }

  checkAllMatch(): boolean {
    let isAllMatched = true;

    for (let i = 0; i <= this.GROUP.length; i++) {
      if (i == this.GROUP.length) {
        if (!this.isMatched) {
          isAllMatched = false;
          break;
        }
      } else if (!raidObjects[this.GROUP[i]].isMatched) {
        isAllMatched = false;
        break;
      }
    }

    if (isAllMatched) {
      return true;
    }

    return false;
  }

  resetAll(): void {
    
    for (let i = 0; i < this.GROUP.length; i++) {
      raidObjects[this.GROUP[i]].isMatched = false;
      raidObjects[this.GROUP[i]].isFlipped = false;
      raidObjects[this.GROUP[i]].type = 5;

      setTimeout(() => {
        game.setObject(this.map_id, raidObjects[this.GROUP[i]].id, {
          type: 5,
          normal: raidObjects[this.GROUP[i]].normal,
          highlighted: raidObjects[this.GROUP[i]].normal
        });
      }, 100 * i);
    }
    
    
    this.isMatched = false;
    this.isFlipped = false;
    this.type = 5;

    game.setObject(this.map_id, this.id, {
      type: 5,
      normal: raidObjects[this.id].normal,
      highlighted: raidObjects[this.id].normal
    });
  }

  shuffleAll(): void {
    let tempArray = [];

    this.GROUP.forEach(val => tempArray.push(val));
    tempArray.push(this.id);

    let tempIndex = tempArray.length;
    let randomIndex = 0;

    while (tempIndex != 0) {
      randomIndex = Math.floor(Math.random() * tempIndex);
      tempIndex--;

      [tempArray[tempIndex], tempArray[randomIndex]] = [tempArray[randomIndex], tempArray[tempIndex]];

      let tempX = raidObjects[tempArray[tempIndex]].x;
      let tempY = raidObjects[tempArray[tempIndex]].y;

      raidObjects[tempArray[tempIndex]].x = raidObjects[tempArray[randomIndex]].x;
      raidObjects[tempArray[tempIndex]].y = raidObjects[tempArray[randomIndex]].y;
      raidObjects[tempArray[randomIndex]].x = tempX;
      raidObjects[tempArray[randomIndex]].y = tempY;

      // raidObjects[tempArray[tempIndex]].setMove(raidObjects[tempArray[randomIndex]].x, raidObjects[tempArray[randomIndex]].y);
      // raidObjects[tempArray[randomIndex]].setMove(tempX, tempY);
    }

    for (let i = 0; i < tempArray.length; i++) {
      raidObjects[tempArray[i]].isFlipped = false;
      raidObjects[tempArray[i]].isMatched = false;
      raidObjects[tempArray[i]].type = 5;

      setTimeout(() => { raidObjects[tempArray[i]].return(); }, 100 * i);
    }
  }
}

class EnterRaidRoomObject extends RaidObject {
  TELEPORT: {
    x: number,
    y: number
  }
  MAP: string
  CLOSED: string

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, TELEPORT: {x: number, y: number}, MAP: string, CLOSED: string) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.TELEPORT = TELEPORT
    this.MAP = MAP
    this.CLOSED = CLOSED
  }

  interaction(player: string): void {
    if (raidRooms[this.LOGIC].isFull() == false) {
      raidRooms[this.LOGIC].addPlayer(player, 'to-be-updated');
      console.log(raidRooms[this.LOGIC].playersInRoom);
      game.teleport(this.MAP, this.TELEPORT.x, this.TELEPORT.y, player);
      console.log(`Object ${this.id} has teleported ${player}`);
      setTimeout(() => { 
        console.log(`${this.MAP} now currently has ${game.getPlayersInMap(this.MAP).length} out of ${raidRooms['first-puzzle-room'].capacity} players(s)`);
      }, 100);
    }

    if (raidRooms[this.LOGIC].isFull() == true) {
      this.setSprite(this.CLOSED);
      this.flipType();
    }
  }
}

class ExitRaidRoomObject extends RaidObject {
  TELEPORT: {
    x: number,
    y: number
  }
  MAP: string

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, TELEPORT: {x: number, y: number}, MAP: string) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.TELEPORT = TELEPORT
    this.MAP = MAP
  }

  interaction(player: string): void {
    console.log(`Object ${this.id} has teleported ${player}`);
    
    // raidRooms[this.LOGIC].removePlayer(player);

    // let temp = game.getPlayersInMap(raidRooms[this.LOGIC].map_id);
    
    // for (let i = 0; i < temp.length; i++) {
    //   //game.teleport(this.MAP, this.TELEPORT.x, this.TELEPORT.y, temp[i].name);
    //   console.log(Object.keys(temp[i].));
    //   //console.log(Object.keys(raidRooms[this.LOGIC].playersInRoom));
    // }

    game.teleport(this.MAP, this.TELEPORT.x, this.TELEPORT.y, player);

    Object.keys(raidRooms[this.LOGIC].playersInRoom).forEach((key, index) => {
      console.log(`Teleporting ${key}`)
      game.teleport(this.MAP, this.TELEPORT.x, this.TELEPORT.y, key);
      raidRooms[this.LOGIC].removePlayer(key);
      console.log(raidRooms[this.LOGIC].isEmpty());
    });
    
    if (raidRooms[this.LOGIC].isEmpty()) {
      raidObjects[this.DOORS].setSprite(raidObjects[this.DOORS].normal);
      raidObjects[this.DOORS].flipType();
    }
  }
}

class TeamSortRaidObject extends RaidObject {
  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
  }

  interaction(player: string): void {
    console.log(`Assigning ${player} to ${this.LOGIC}`);

    if (raidTeams[this.LOGIC] == undefined) raidTeams[this.LOGIC] = [];
    if (raidPlayers[player] == undefined) raidPlayers[player] = game.getPlayer(player).name;

    Object.keys(raidTeams).forEach((key, index) => {
      for (let i = 0; i < raidTeams[key].length; i++) {
        if (raidTeams[key][i] == player) {
          raidTeams[key].splice(i, 1);
          break;
        }
      }
    });

    raidTeams[this.LOGIC].push(player);

    game.setName(`${raidPlayers[player]} ${this.LOGIC}`, player);

    console.log(raidTeams);
    Object.keys(raidTeams).forEach((key, index) => {
      console.log(`${key} has ${raidTeams[key].length} player(s)`);
    });
  }
}

class RandomTeamSortRaidObject extends RaidObject {
  TEAMS: []
  LOCATION: {}

  constructor(name: string, id: string, type: number, x: number, y: number, width: number, height: number, distThreshold: number, previewMessage: string, normal: string, highlighted: string, customState: string, map_id: string, COOLDOWN: number, BEHAVIOR: string, FIXED: boolean, TRADEABLE: boolean, LOOTABLE: boolean, SWAPPABLE: boolean, STACKABLE: boolean, LOGIC: string, DOORS: string, TEAMS: [], LOCATION: {}) {
    super(name, id, type, x, y, width, height, distThreshold, previewMessage, normal, highlighted, customState, map_id, COOLDOWN, BEHAVIOR, FIXED, TRADEABLE, LOOTABLE, SWAPPABLE, STACKABLE, LOGIC, DOORS)
    this.TEAMS = TEAMS
    this.LOCATION = LOCATION
  }

  interaction(player: string): void {

    //Checks if player is in a team, and removes them
    Object.keys(raidTeams).forEach((key, index) => {
      for (let i = 0; i < raidTeams[key].length; i++) {
        if (raidTeams[key][i] == player) {
          raidTeams[key].splice(i, 1);
          break;
        }
      }
    });

    //Temp array for tracking number of people in each team
    const temp_array = [];

    //Create teams in raidTeams if they don't exist and counts current players in each team
    for (let i = 0; i < this.TEAMS.length; i++) {
      if (raidTeams[this.TEAMS[i]] == undefined) raidTeams[this.TEAMS[i]] = [];
      temp_array.push(raidTeams[this.TEAMS[i]].length);
    }

    // checkEqual checks if all teams have equal members -- OBSOLETE
    //let checkEqual = temp_array.every((val, i, arr) => val === arr[0]);
    
    //Look for the team with the smallest number of members
    let smallest = Math.min(...temp_array);
    
    //Second array to record multiple teams with the same number of members == smallest
    const other_temp_array = [];

    //Add teams with member count == smallest
    for (let i = 0; i < temp_array.length; i++) {
      if (temp_array[i] == smallest) other_temp_array.push(i);
    }

    //Pick a random team among other_temp_array
    let x = Math.floor(Math.random() * other_temp_array.length);
    let y = other_temp_array[x];
    raidTeams[this.TEAMS[y]].push(player);

    console.log(`Assigned ${player} to ${this.TEAMS[y]}`);
    game.chat(player, [], game.getPlayer(player).map, {contents: `Assigned ${player} to ${this.TEAMS[y]}`});
    console.log(raidTeams);

    if (this.LOCATION['map'] != 'none') {
      const tele_x = this.LOCATION['coords'][y]['x'];
      const tele_y = this.LOCATION['coords'][y]['y'];

      game.teleport(this.LOCATION['map'], tele_x, tele_y, player);
    }
  }
}

/////////// RAID ROOM CLASSES /////////////////////

class RaidRoom {
  room_name: string
  map_id: string
  x: number
  y: number
  width: number
  height: number
  capacity: number
  playersInRoom: { [id: string]: string } = {}

  constructor(room_name: string, map_id: string, x: number, y: number, width: number, height: number, capacity: number) {
    this.room_name = room_name;
    this.map_id = map_id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.capacity = capacity;
  }

  addPlayer(player: string, id: string) {
    this.playersInRoom[player] = id;
  }

  removePlayer(player: string) {
    delete this.playersInRoom[player];
  }

  numberOfPlayers(): number {
    let x = Object.keys(this.playersInRoom).length;
    
    return x;
  }

  isFull(): boolean {
    let full = false;
    if(this.numberOfPlayers() == this.capacity) full = true
    return full;
  }

  isEmpty(): boolean {
    let empty = false;
    if (Object.keys(this.playersInRoom).length == 0) empty = true;
    return true;
  }
}

//28, 9