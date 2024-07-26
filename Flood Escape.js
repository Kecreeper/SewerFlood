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

var downCount = 0

function down() {
  let fromFloor = height() - (getFirst(playerIdle).y + 1)
  console.log(fromFloor)
  
  if (downCount < jumpHeight) {
    getFirst(playerIdle).y += 1
    downCount += 1
    setTimeout(down, 100)
  } else if (downCount = jumpHeight) {
    downCount = 0
  }
}

function gravity() {
  if (allowFall == true) {
    getFirst(playerIdle).y += 1
  }

  // console.log(allowFall)
  
  setTimeout(gravity, 100)
}
gravity()

var upCount = 0

function up() {
  if (upCount < jumpHeight) {
    allowFall = false
    getFirst(playerIdle).y -= 1
    upCount += 1
    setTimeout(up, 100)
  } else if (upCount == jumpHeight) {
    allowFall = true
    upCount = 0
  }
}

onInput("w", function(){
  up()
})

onInput("a", function(){
  getFirst(playerIdle).x -= 1
})

onInput("d", function(){
  getFirst(playerIdle).x += 1
})

afterInput(() => {
  let tileBelow = getTile(getFirst(playerIdle).x, getFirst(playerIdle).y + 1)

  tileBelow.forEach(function(sprite) {
    if (sprite.type === platform) {
      allowFall = false
      console.log(allowFall)
    }
  })
})

console.log(getFirst(playerIdle).y)