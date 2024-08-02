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
)

setSolids([ playerIdle, platform ])

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
oooooo.........
.......i.......`,
]

setMap(levels[level])

var allowFall = false
var allowJump = true

function gravity() {
  if (allowFall == true) {
    var plr = null
    var x = null
    var y = null
    
    if (getFirst(playerIdle) != null) {
      plr = getFirst(playerIdle)
      x = plr.x
      y = plr.y
      plr.remove()
      addSprite(x, y, playerFall)
    }else if (getFirst(playerJump) != null) {
      plr = getFirst(playerIdle)
      x = plr.x
      y = plr.y
      plr.remove()
      addSprite(x, y, playerFall)
    }

    getFirst(playerFall).y += 1
  }

  // console.log(allowFall)
  
  setTimeout(gravity, 100)
}

var upCount = 0

function jump() {
  if (upCount < jumpHeight) {
    allowFall = false
    getFirst(playerIdle).y -= 1
    upCount += 1
    setTimeout(jump, 100)
  } else if (upCount == jumpHeight) {
    allowFall = true
    upCount = 0
  }
}

function createPlatform() {
  
  addSprite(0,0, platform)
  addSprite(1,0, platform)
  addSprite(2,0, platform)
}


function updateWater() {
  
}

function updateFrame() {
  
}

onInput("w", function(){
  if (allowJump == true) {
    jump()
  }
})

onInput("a", function(){
  if (getFirst(playerIdle) != null) {
    getFirst(playerIdle).x -= 1
  }else if (getFirst(playerJump) != null) {
    getFirst(playerJump).x -= 1
  }else if (getFirst(playerFall) != null) {
    getFirst(playerFall).x -= 1
  }
})

onInput("d", function(){
  if (getFirst(playerIdle) != null) {
    getFirst(playerIdle).x += 1
  }else if (getFirst(playerJump) != null) {
    getFirst(playerJump).x += 1
  }else if (getFirst(playerFall) != null) {
    getFirst(playerFall).x += 1
  }
})

/*
afterInput(() => {
  let tileBelow = getTile(getFirst(playerIdle).x, getFirst(playerIdle).y + 1)

  tileBelow.forEach(function(sprite) {
    if (sprite.type === platform) {
      allowFall = false
      console.log(allowFall)
    }
  })
})
*/

console.log(getFirst(playerIdle).y)

function start() {
  gravity()
}

start()