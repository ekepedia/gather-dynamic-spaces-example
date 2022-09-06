//BEHAVIOR: FOLLOW, TAKE, DROP, PUSH
//LOGIC: ID of objects it will interact with e.g TAKE object with DROP
//DOORS: ID of door objects (only works with drop for now) and limited to 1x3 doors

module.exports = {
  API_KEY: "Yp9mowc2viQlq8xT", // info@raidheroom.com
  
  url: "kuOpQ63ckdxpfANU\\kevinwebsockets",
  SPACE_ID: "kuOpQ63ckdxpfANU\\kevinwebsockets",

  MAP_ID: [
    "test-room-11"
  ],
  
  STATUE: {
    "off": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/internal-dashboard/images/twIKv7bnw-CLPwyfYsO-E",
    "on": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/internal-dashboard/images/A_4_wAmZIAazGZoGYrCgW"
  },
  DOORS: {
    "open": "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FOAS5P91MeHHJ9X3x?alt=media&token=5cbaf712-c15f-47ca-9a35-160831d22ffd",
    "close": "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F2NUrsU3ek8g60Yez?alt=media&token=7ee54bfe-0594-42e0-95e8-0befc2064521",
  },
  ARROW_DIR: {
    "down": "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F6BgVETZfCGaKPA2T?alt=media&token=cc32fda4-d498-4593-8547-7675f1e561cb",
    "left": "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FvxC2LnC8H1ltvP1S?alt=media&token=409d5b82-8b11-47ed-b145-c4b55b65da8d",
    "up": "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FnQIEQCMu2OBHi20G?alt=media&token=d6462a6e-df94-416e-afdc-d54d6a1e3c7e",
    "right": "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F2lmHBWwOnr066bTe?alt=media&token=3aa45e8f-795d-4e34-9829-a23c5dc3c66d",
  },
  BLANK: "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FPGcG9m2GSI8BCixU?alt=media&token=1890032a-0726-40db-a8bb-9426871e7db8",
  PLATE: {
    "glass": "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FYEeExcvH2DBnZsrI?alt=media&token=1b8fcb20-960f-40ec-b8b8-2a8496123e59"
  },
  BRAIN: "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/internal-dashboard/images/8WKeYhaQDxaW7P7IBFSqv",

  ALL_OBJECTS: {
    KEVIN_WEBSOCKETS: {

    "start": {
      "id": "start",
      "type": 7,
      "x": 12,
      "y": 13,
      "width": 1,
      "height": 2,
      "distThreshold": 2,
      "previewMessage": "Press x to start a new game.",
      "normal": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/9g1r0WE8y6Fgb9VanyCxJx",
      "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/2GHxbsaHYPUKCrbsnM4n9b",
      "customState": "none",
      'COOLDOWN': 0,
      "properties": {
        extensionData: {
            entries: [
                {
                    type: "header",
                    value: "Are you sure you want to start a new game?",
                    key: "start_header"
                },
                {
                  type: "radio",
                  key: "radio_input",
                  options: [
                    {
                      label: "No",
                      key: "No",
                    },
                    {
                      label: "Yes",
                      key: "Yes",
                    },
                  ],
                },                 
            ]
        }
      },
      'BEHAVIOR': 'none',
      'FIXED': true,
      'LOGIC': 'none',
      'DOORS': 'none',
      'SWAPPABLE': false,
      'STACKABLE': false,
      'TRADEABLE': false,
      'LOOTABLE': false,
      "spritesheet":{
        "animations":{
          "default":{
            "useSequenceAsRange":true,
            "frameRate":4,
            "loop":true,
            "sequence":[0,3]
            }
        },
        "framing":{
          "frameWidth":32,
          "frameHeight":64
          },
        "currentAnim":"default",
        "spritesheetUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/GNHk0xZdxkuwhijnxJcKJU"
      },
    
  },

  "fireplace": {
    "id": "fireplace",
    "type": 5,
    "x": 26,
    "y": 13,
    "width": 2,
    "height": 3,
    "distThreshold": 2,
    "previewMessage": "Fireplace",
    "normal": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/oxrhEtb3sV7VutbQ/8QPrJNQNTK7GVbgFJbcf8y",
    "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/oxrhEtb3sV7VutbQ/8QPrJNQNTK7GVbgFJbcf8y",
    "spritesheet":{
      "animations":{
        "fire":{
          "useSequenceAsRange":true,
          "frameRate":6,
          "loop":true,
          "sequence":[0,5]
          }
      },
      "framing":{
        "frameWidth":64,
        "frameHeight":96
      },
      "currentAnim":"fire",
      "spritesheetUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/oxrhEtb3sV7VutbQ/Nh7Rng3SvwZLHXxmvL1yms"
    },
    "customState": "none",
    'COOLDOWN': 0,
    "properties": {},
    'BEHAVIOR': 'none',
    'FIXED': true,
    'LOGIC': 'none',
    'DOORS': 'none',
    'SWAPPABLE': false,
    'STACKABLE': false,
    'TRADEABLE': false,
    'LOOTABLE': false,
    
  
  },

  "sheep": {
      "id": "sheep",
      "type": 5,
      "x": 5,
      "y": 5,
      "width": 1,
      "height": 2,
      "distThreshold": 1,
      // "previewMessage": "Press space to pick up",
      "normal": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/nsSvPdlHLbP9bLZSWtKXWc",
      "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/nsSvPdlHLbP9bLZSWtKXWc",
      "customState": "none",
      'COOLDOWN': 0,
      'properties': {},
      'BEHAVIOR': 'none',
      'FIXED': true,
      'LOGIC': 'none',
      'DOORS': 'none',
      'SWAPPABLE': false,
      'STACKABLE': false,
      'TRADEABLE': false,
      'LOOTABLE': false,
      "spritesheet":{
        "animations":{
          "default":{
            "useSequenceAsRange":true,
            "frameRate":8,
            "loop":true,
            "sequence":[0,3]
            }
        },
        "framing":{
          "frameWidth":32,
          "frameHeight":64
          },
        "currentAnim":"default",
        "spritesheetUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/YvOV83atOFyMWIDnH1xCXY"
      },

    },

    "chicken": {
      "id": "chicken",
      "type": 5,
      "x": 9,
      "y": 5,
      "width": 1,
      "height": 2,
      "distThreshold": 1,
      // "previewMessage": "Press space to pick up",
      "normal": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/iGN6hTUKOMV8LtfawCAGMd",
      "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/iGN6hTUKOMV8LtfawCAGMd",
      "customState": "none",
      'COOLDOWN': 0,
      'properties': {},
      'BEHAVIOR': 'none',
      'FIXED': true,
      'LOGIC': 'none',
      'DOORS': 'none',
      'SWAPPABLE': false,
      'STACKABLE': false,
      'TRADEABLE': false,
      'LOOTABLE': false,
      "spritesheet":{
        "animations":{
          "default":{
            "useSequenceAsRange":true,
            "frameRate":8,
            "loop":true,
            "sequence":[0,3]
            }
        },
        "framing":{
          "frameWidth":32,
          "frameHeight":64
          },
        "currentAnim":"default",
        "spritesheetUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/NEnf4Te1J5hCO9zRtFDyeZ"
      },

    },

    "frog": {
      "id": "frog",
      "type": 5,
      "x": 13,
      "y": 5,
      "width": 1,
      "height": 2,
      "distThreshold": 1,
      // "previewMessage": "Press space to pick up",
      "normal": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/vSv4lxiWZiiuTHyLPMFCIS",
      "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/vSv4lxiWZiiuTHyLPMFCIS",
      "customState": "none",
      'COOLDOWN': 0,
      'properties': {},
      'BEHAVIOR': 'none',
      'FIXED': true,
      'LOGIC': 'none',
      'DOORS': 'none',
      'SWAPPABLE': false,
      'STACKABLE': false,
      'TRADEABLE': false,
      'LOOTABLE': false,
      "spritesheet":{
        "animations":{
          "default":{
            "useSequenceAsRange":true,
            "frameRate":8,
            "loop":true,
            "sequence":[0,3]
            }
        },
        "framing":{
          "frameWidth":32,
          "frameHeight":64
          },
        "currentAnim":"default",
        "spritesheetUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/J9eeVHpoQuqo40bOLPspKL"
      },

    },

    "mouse": {
      "id": "mouse",
      "type": 5,
      "x": 17,
      "y": 5,
      "width": 1,
      "height": 2,
      "distThreshold": 1,
      // "previewMessage": "Press space to pick up",
      "normal": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/bYjplZDlUL4KqKS63UMBZJ",
      "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/bYjplZDlUL4KqKS63UMBZJ",
      "customState": "none",
      'COOLDOWN': 0,
      'properties': {},
      'BEHAVIOR': 'none',
      'FIXED': true,
      'LOGIC': 'none',
      'DOORS': 'none',
      'SWAPPABLE': false,
      'STACKABLE': false,
      'TRADEABLE': false,
      'LOOTABLE': false,
      "spritesheet":{
        "animations":{
          "default":{
            "useSequenceAsRange":true,
            "frameRate":8,
            "loop":true,
            "sequence":[0,3]
            }
        },
        "framing":{
          "frameWidth":32,
          "frameHeight":64
          },
        "currentAnim":"default",
        "spritesheetUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/gG6KHYS6t2zyNfRpZxuEgp"
      },

    },

    "megaman": {
      "id": "megaman",
      "type": 5,
      "x": 21,
      "y": 5,
      "width": 2,
      "height": 2,
      "distThreshold": 1,
      // "previewMessage": "Press space to pick up",
      "normal": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/UE70SAoLA3voIiynNfZWeF",
      "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/UE70SAoLA3voIiynNfZWeF",
      "customState": "none",
      'COOLDOWN': 0,
      'properties': {},
      'BEHAVIOR': 'none',
      'FIXED': true,
      'LOGIC': 'none',
      'DOORS': 'none',
      'SWAPPABLE': false,
      'STACKABLE': false,
      'TRADEABLE': false,
      'LOOTABLE': false,
      "spritesheet":{
        "animations":{
          "default":{
            "useSequenceAsRange":true,
            "frameRate":14,
            "loop":true,
            "sequence":[0,6]
            }
        },
        "framing":{
          "frameWidth":64,
          "frameHeight":64
          },
        "currentAnim":"default",
        "spritesheetUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/WfBT3ch2OUGXG8VCdPRaOl"
      },

    },

    // "zero": {
    //   "id": "zero",
    //   "type": 0,
    //   "x": 2,
    //   "y": 8,
    //   "width": 16,
    //   "height": 7,
    //   "distThreshold": 0,
    //   // "previewMessage": "Press space to pick up",
    //   "normal": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/UE70SAoLA3voIiynNfZWeF",
    //   "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/UE70SAoLA3voIiynNfZWeF",
    //   "customState": "none",
    //   'COOLDOWN': 0,
    //   'properties': {},
    //   'BEHAVIOR': 'none',
    //   'FIXED': true,
    //   'LOGIC': 'none',
    //   'DOORS': 'none',
    //   'SWAPPABLE': false,
    //   'STACKABLE': false,
    //   'TRADEABLE': false,
    //   'LOOTABLE': false,
    //   "spritesheet":{
    //     "animations":{
    //       "default":{
    //         "useSequenceAsRange":true,
    //         "frameRate":16,
    //         "loop":true,
    //         "sequence":[0,32]
    //         }
    //     },
    //     "framing":{
    //       "frameWidth":512,
    //       "frameHeight":224
    //       },
    //     "currentAnim":"default",
    //     "spritesheetUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/bgmgkdGmXiac6DIbiHrb2s"
    //   },

    // },

    "zero": {
      "id": "zero",
      "type": 0,
      "x": 2,
      "y": 8,
      "width": 9,
      "height": 4,
      "distThreshold": 0,
      // "previewMessage": "Press space to pick up",
      "normal": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/UE70SAoLA3voIiynNfZWeF",
      "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/UE70SAoLA3voIiynNfZWeF",
      "customState": "none",
      'COOLDOWN': 0,
      'properties': {},
      'BEHAVIOR': 'none',
      'FIXED': true,
      'LOGIC': 'none',
      'DOORS': 'none',
      'SWAPPABLE': false,
      'STACKABLE': false,
      'TRADEABLE': false,
      'LOOTABLE': false,
      "spritesheet":{
        "animations":{
          "default":{
            "useSequenceAsRange":true,
            "frameRate":16,
            "loop":true,
            "sequence":[0,32]
            }
        },
        "framing":{
          "frameWidth":288,
          "frameHeight":128
          },
        "currentAnim":"default",
        "spritesheetUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/vLKzU1moonx4NZLMaI3H3Z"
      },

    },

    "message": {
      "id": "message",
      "type": 0,
      "x": 13,
      "y": 8,
      "width": 5,
      "height": 3,
      "distThreshold": 0,
      // "previewMessage": "Press space to pick up",
      "normal": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/UE70SAoLA3voIiynNfZWeF",
      "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/UE70SAoLA3voIiynNfZWeF",
      "customState": "none",
      'COOLDOWN': 0,
      'properties': {},
      'BEHAVIOR': 'none',
      'FIXED': true,
      'LOGIC': 'none',
      'DOORS': 'none',
      'SWAPPABLE': false,
      'STACKABLE': false,
      'TRADEABLE': false,
      'LOOTABLE': false,
      "spritesheet":{
        "animations":{
          "default":{
            "useSequenceAsRange":true,
            "frameRate":13,
            "loop":true,
            "sequence":[0,78]
            }
        },
        "framing":{
          "frameWidth":160,
          "frameHeight":96
          },
        "currentAnim":"default",
        "spritesheetUrl":"https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/9oGoRHR83HfQwCXcK51CKX"
      },

    },

    "note": {
      "id": "note",
      "type": 7,
      "x": 18,
      "y": 3,
      "width": 6,
      "height": 1,
      "distThreshold": 2,
      "previewMessage": "Press x to leave a note for others during this game.",
      "normal": "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=[Leave a note during this game]&font=Roboto-Regular.ttf&red=255&green=255&blue=255&size=14",
      "highlighted": "https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=[Leave a note during this game]&font=Roboto-Regular.ttf&red=255&green=255&blue=0&size=14",
      "customState": "none",
      'COOLDOWN': 0,
      "properties": {
        extensionData: {
            entries: [
                {
                    type: "header",
                    value: "Submit text below to leave your shared note here.",
                    key: "start_header"
                },
                {
                  type: "text",
                  value: "Enter your note here",
                  key: "secret_word",
                },
                                      
            ]
        }
      },
      'BEHAVIOR': 'none',
      'FIXED': true,
      'LOGIC': 'none',
      'DOORS': 'none',
      'SWAPPABLE': false,
      'STACKABLE': false,
      'TRADEABLE': false,
      'LOOTABLE': false,
    
  },

              
  }
}


}

// Thick Message Spritesheet 160x7584 79 Frames
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/9oGoRHR83HfQwCXcK51CKX

// Message Spritesheet 160x8160
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/nl5D1aUUs3YraYw4T8TOjY

// Zero Spritesheet
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/ADQqOVge0IR6jKEhZDSDm7

// Zero Spritesheet 512x2464
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/vdrUEjuZfexJAIbmUfdHWe

// Zero Spritesheet 512x7392
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/bgmgkdGmXiac6DIbiHrb2s

// Zero Spritesheet 288x4224
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/vLKzU1moonx4NZLMaI3H3Z

// Megaman Default
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/UE70SAoLA3voIiynNfZWeF

// Megaman Spritesheet
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/WfBT3ch2OUGXG8VCdPRaOl

// Default Sheep
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/nsSvPdlHLbP9bLZSWtKXWc

// Dancing Sheep
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/YvOV83atOFyMWIDnH1xCXY

// Chicken Spritesheet
// https://dynamic-assets.staging.gather.town/sprite/avatar-FUAHIumeZywaDeIEnZGN.png

// Default Chicken
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/iGN6hTUKOMV8LtfawCAGMd

// Dancing Chicken
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/NEnf4Te1J5hCO9zRtFDyeZ

// Frog Spritesheet
// https://dynamic-assets.staging.gather.town/sprite/avatar-hM6wbFfGv5sAAF1lW0II.png

// Default Frog
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/vSv4lxiWZiiuTHyLPMFCIS

// Dancing Frog
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/J9eeVHpoQuqo40bOLPspKL

// Mouse Spritesheet
// https://dynamic-assets.staging.gather.town/sprite/avatar-n1FVIa6vDuOPu5wENX24.png

// Default Mouse
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/bYjplZDlUL4KqKS63UMBZJ

// Dancing Mouse
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/gG6KHYS6t2zyNfRpZxuEgp

// Indicator
// https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FYEeExcvH2DBnZsrI?alt=media&token=1b8fcb20-960f-40ec-b8b8-2a8496123e59

// Opened Doors
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/Ho6abUIslqoWcDQ7/FX06IIOJrhvZZAhzgpoono

// https://2y74lxqi4a.execute-api.us-west-2.amazonaws.com/dev/draw-text?text=G&font=Roboto-Bold.ttf&red=0&green=0&blue=0&size=48

// G 32px
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/TeIhehUps0bqloK9PX3aCY

// G White
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/CQ39Ni8TvuiHX7fV2JGovH


// blue-gem.png
// https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FKlXm4V64UBYuQQuN?alt=media&token=e20f544d-d47d-43f6-8194-c8e1f1e16ddd

// blue-gem-highlighted.png
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/rW3yhWcgSMrH7RhoyWl6mG

// red-gem.png
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/PXwK0mA3yHtnQPN1PuY6zk

// red-gem-highlighted.png
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/snUrorgZCTfalmaq1Pgtkr

// orange-gem.png
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/OMEKxZ36SZZ4H3AUuTOWol

// orange-gem-highlighted.png
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/GzYShieBYRz26a56VxHGG4

// purple-gem.png
// https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FcckeRLmeMY9R6vF1?alt=media&token=d93ee66d-3341-4674-a66d-c6ad7ad429de

// purple-gem-highlighted.png
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/ilPdS6pnDwGC6emT8V56Im

// green-gem.png
// https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2F9Yww3v4mr4Riru4w?alt=media&token=2912e83d-0076-4210-8fd3-b7fcd2efb05d

// green-gem-highlighted.png
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/CCGQKIzvNUWyJYcXJp7Kdk

// gray-gem.png
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/RItc5gsMEhLSntGIV8YVUW

// gray-gem-highlighted.png
// https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/fsgnsf3nrdYY3PfCHq1Zav


// "blue-gem_1": {
//   "id": "blue-gem_1",
//   "type": 5,
//   "x": 3,
//   "y": 9,
//   "width": 1,
//   "height": 1,
//   "distThreshold": 2,
//   "previewMessage": "Press [Spacebar] to pick up.",
//   "normal": "https://cdn.gather.town/v0/b/gather-town.appspot.com/o/internal-dashboard-upload%2FKlXm4V64UBYuQQuN?alt=media&token=e20f544d-d47d-43f6-8194-c8e1f1e16ddd",
//   "highlighted": "https://cdn.gather.town/storage.googleapis.com/gather-town.appspot.com/uploads/kuOpQ63ckdxpfANU/rW3yhWcgSMrH7RhoyWl6mG",
//   "customState": "none",
//   'COOLDOWN': 0,
//   'properties': {},
//   'BEHAVIOR': 'none',
//   'FIXED': false,
//   'TRADEABLE': true,
//   'LOOTABLE': true,
//   'SWAPPABLE': true,
//   'STACKABLE': true,
//   'LOGIC': "none",
//   'DOORS': "none",


  
// },













