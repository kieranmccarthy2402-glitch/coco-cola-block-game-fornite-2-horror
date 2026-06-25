// ==========================================
// 1. GAME SETUP & HELLISH ATMOSPHERE
// ==========================================
info.setLife(3)
game.splash("THE ZERO POINT ENTITY", "Find the Vault Key. Escape!")

// Build a solid block maze using the native engine
// (Each block character tile is exactly 16x16 pixels)
tiles.setTilemap(tilemap`
    2 2 2 2 2 2 2 2 2 2
    2 . . . 2 . . . . 2
    2 . 2 . 2 . 2 2 . 2
    2 . 2 . . . . 2 . 2
    2 . 2 2 2 2 . 2 . 2
    2 . . . . 2 . . . 2
    2 2 2 2 . 2 2 2 . 2
    2 . . . . . . 2 . 2
    2 . 2 2 2 2 . . . 2
    2 2 2 2 2 2 2 2 2 2
`)

// Define which tiles are solid physical walls
// Tile '2' corresponds to the block walls in our layout map above
tiles.setWallAt(tiles.getTileLocation(0, 0), true)
// Set up structural walls natively on the grid layout
// (0,0 is the top-left corner; 9,9 is the bottom-right corner)
for (let i = 0; i < 10; i++) {
    tiles.setWallAt(tiles.getTileLocation(i, 0), true) // Top outer wall
    tiles.setWallAt(tiles.getTileLocation(i, 9), true) // Bottom outer wall
    tiles.setWallAt(tiles.getTileLocation(0, i), true) // Left outer wall
    tiles.setWallAt(tiles.getTileLocation(9, i), true) // Right outer wall
}

// Internal maze partitions (blocks you cannot cross)
tiles.setWallAt(tiles.getTileLocation(4, 2), true)
tiles.setWallAt(tiles.getTileLocation(4, 4), true)
tiles.setWallAt(tiles.getTileLocation(4, 5), true)
tiles.setWallAt(tiles.getTileLocation(2, 3), true)
tiles.setWallAt(tiles.getTileLocation(7, 3), true)
tiles.setWallAt(tiles.getTileLocation(7, 7), true)


// ==========================================
// 4. OVERLAP INTERACTION EVENTS
// ==========================================

// Drink Coca-Cola -> Gain instant Adrenaline Running Rush
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function (sprite, otherSprite) {
    otherSprite.destroy()
    music.powerUp.play()
    controller.moveSprite(survivor, 110, 110) // Break out of standard speed caps

    // Smooth countdown fallback loop without blocking the clock engine
    let clearBoostTime = game.runtime() + 3500
    game.onUpdate(function () {
        if (game.runtime() > clearBoostTime) {
            controller.moveSprite(survivor, 65, 65)
        }
    })
})

// Grab Key item
sprites.onOverlap(SpriteKind.Player, SpriteKind.Item, function (sprite, otherSprite) {
    otherSprite.destroy()
    hasKey = true
    music.melodyUpDown.play()
    game.showLongText("Vault Key Acquired. Find the escape corner!", DialogLayout.Bottom)
})

// Monster jumpscare impact logic
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function (sprite, otherSprite) {
    scene.cameraShake(7, 500)
    music.wawawawaa.play()
    info.changeLifeBy(-1)

    // Teleport the entity back to its starting base node to give you breathing room
    tiles.placeOnTile(entity, tiles.getTileLocation(8, 8))
})

// Win Condition: Reach the exit room hatch (tile location 1, 1) with the Vault Key
game.onUpdate(function () {
    if (hasKey) {
        let currentTile = survivor.tilemapLocation()
        if (currentTile.column == 1 && currentTile.row == 1) {
            game.over(true, effects.confetti)
        }
    }
})

