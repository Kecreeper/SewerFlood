/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: Flood Escape
@author: Eduardo
@tags: []
@addedOn: 2024-00-00
*/

const jumpHeight = 5


const playerIdle = "i"
const playerJump = "j"
const playerFall = "f"
const platform = "o"
const water = "w"

setLegend(
  [ playerIdle, bitmap`
................
................
.......00.......
......0220......
.....022220.....
.....022220.....
......0220......
.......00.......
......0000......
.....0.00.0.....
....0..00..0....
...0...00...0...
.......00.......
.......00.......
......0..0......
......0..0......` ],
  [ playerJump, bitmap`
................
................
.......00.......
......0220......
.....022220.....
.....052250.0...
......0550..0...
.......00..0....
......00000.....
.....0.00...7...
....0..00.7.7...
...0.7.00.7.7...
.....7.00.7.7...
...7...00.7.....
...7..0..0..7...
...7..0..0..7...` ],
  [ playerFall, bitmap`
.....7....7.....
.....7....7.....
.....7.00.......
..7...0550......
..7..052250.....
..7..022220.....
..7...0220......
..7....00.......
.....000000.....
...00..00..00...
..0....00....0..
.......00.......
.......00.......
.......00.......
......0..0......
......0..0......` ],
  [ platform,   bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000` ],
  [ water,      bitmap`
7777777777777777
7777777777777777
5777755775577775
7577577777757757
7755777777775577
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7777777777777777
7557777557777557
7775775775775777
7777557777557777
7777777777777777
7777777777777777` ],
)

setSolids([ playerIdle, platform ])
setSolids([ playerJump, platform ])
setSolids([ playerFall, platform ])

let level = 0
const levels = [
  map`
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
...............
.......i.......`,
]

setMap(levels[level])

var allowFall = false
var allowJump = true

let currentSprite = playerIdle

function getPlayer() {
  let plr = null

  if (getFirst(playerIdle) != null) {
    plr = getFirst(playerIdle)
  } else if (getFirst(playerJump) != null) {
    plr = getFirst(playerJump)
  } else if (getFirst(playerFall) != null) {
    plr = getFirst(playerFall)
  }

  return plr
}

function replaceSprite(sprite) {
  let plr = null
  let x = null
  let y = null
  
  if (getFirst(playerIdle) != null) {
    plr = getFirst(playerIdle)
    x = plr.x
    y = plr.y
    plr.remove()
    addSprite(x, y, sprite)
    currentSprite = playerIdle
  } else if (getFirst(playerJump) != null) {
    plr = getFirst(playerJump)
    x = plr.x
    y = plr.y
    plr.remove()
    addSprite(x, y, sprite)
    currentSprite = playerJump
  } else if (getFirst(playerFall) != null) {
    plr = getFirst(playerFall)
    x = plr.x
    y = plr.y
    plr.remove()
    addSprite(x, y, sprite)
    currentSprite = playerFall
  }
}

function gravity() {
  if (allowFall == true) {
    replaceSprite(playerFall)
    allowJump = false
    
    var plr = getFirst(playerFall)
    var x = null
    var y = null
    var stop = false

    let tileBelowY = plr.y + 1

    let tileBelow = getTile(plr.x, tileBelowY)
    tileBelow.forEach(function(sprite) {
      if (sprite.type === platform) {
        stop = true
      }
    })

    if (tileBelowY == height()) {
      stop = true
    }

    if (stop == false) {
      getFirst(playerFall).y += 1
    } else if (stop == true) {
      allowFall = false
      allowJump = true
      replaceSprite(playerIdle)
    }
  }
  
  setTimeout(gravity, 100)
}

var upCount = 0

function jump() {
  if (upCount < jumpHeight) {
    allowJump = false
    replaceSprite(playerJump)
    allowFall = false
    getFirst(playerJump).y -= 1
    upCount += 1
    setTimeout(jump, 100)
  } else if (upCount == jumpHeight) {
    allowFall = true
    upCount = 0
  }
}

function fallInAir() {
  let plr = getPlayer()
  let tileBelow = getTile(plr.x, plr.y+1)
  if (!tileBelow.includes(platform) && allowFall == false && allowJump == true) {
    allowFall = true
  }
}

function createPlatform(pos) {
  let x = 0
  let y = 0
  if (pos != null) {
    x = pos[0]
    y = pos[1]
  }
  
  addSprite(0+x,0+y, platform)
  addSprite(1+x,0+y, platform)
  addSprite(2+x,0+y, platform)
  addSprite(3+x,0+y, platform)
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function randomPlatforms() {
  for (let i = 2; i < height()-2; i+=4) {
    let x = getRndInteger(0, 11)
    createPlatform([x, i])
  }
}

randomPlatforms()

let toFour = 2

function updateFrame() {
  toFour += 1
  let platforms = getAll(platform)
  platforms.forEach(function(sprite) {
    if (sprite.y != height()-2) {
      sprite.y += 1
    } else {
      sprite.remove()
    }
  })
  if (toFour == 4) {
    createPlatform([getRndInteger(0, 11), 0])
    toFour = 0
  }
  if (allowJump == true && allowFall == false) {
    allowFall = true
  }
  setTimeout(updateFrame, 2500)
}

function checkDeath() {
  if (getPlayer().y == height()-1) {
    console.log("dead")
  }
  setTimeout(checkDeath, 100)
}

function createWater() {
  for (let i = 0; i < width(); i++) {
    addSprite(i, 21, water)
  }
}

onInput("w", () => {
  if (allowJump == true) {
    jump()
  }
})

onInput("a", () => {
  getPlayer().x -=1
})

onInput("d", () => {
  getPlayer().x +=1
})

afterInput(fallInAir)

function start() {
  gravity()
  setTimeout(createWater, 2500)
  setTimeout(updateFrame, 2500)
  setTimeout(checkDeath, 2500)
}

start()