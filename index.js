const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, 1024, 576)

const gravity = 0.7


// BACKGROUND
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/environment.jpg'
})

const flyingEye = new Sprite({
    position: {
        x: 350,
        y: -30
    },
    imageSrc: './img/flying-eye/Flight.png',
    framesMax: 8
})


// PLAYER
const player = new Fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 5
    },
    imageSrc: './img/king/Idle.png',
    framesMax: 8,
    imgOffset: {
        x: 220,
        y: 150
    },
    sprites: {
        idle: {
            imageSrc: './img/king/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './img/king/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/king/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/king/Fall.png',
            framesMax: 2
        },
        attack: {
            imageSrc: './img/king/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/king/Take-Hit-silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './img/king/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 50,
            y: 50
        },
        width: 150,
        height: 50
    },
    effect: {
        sword: sfx.playerSword,
        voice: sfx.playerVoice
    }
})

// ENEMY
const enemy = new Fighter({
    position: {
        x: 780,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    imgOffset: {
        x: 230,
        y: 185
    },
    sprites: {
        idle: {
            imageSrc: './img/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2
        },
        attack: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './img/kenji/Take-Hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -150,
            y: 50
        },
        width: 170,
        height: 50
    },
    effect: {
       sword: sfx.enemySword,
       voice: sfx.enemyVoice
    }
})

// KEYBOARD KEYS
const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    w: {
        pressed: false
    },
    space: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    },
    arrowUp: {
        pressed: false
    },
    arrowDown: {
        pressed: false
    }
}

decreaseTimer()

// ANIMATE
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    flyingEye.update()
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0

    // Player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    // Player Jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }

    // Enemy movement
    if (keys.arrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.arrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    // Enemy Jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }


    // COLLISION
    // Player attack & enemy gets hit
    if (rectangularCollision({rectangle1: player, rectangle2: enemy}) &&
        player.isAttacking && player.framesCurrent === 2
    ) {
        enemy.takeHit()
        player.isAttacking = false
        gsap.to('#enemyHealth', {width: enemy.health + '%'})
    }

    // Player misses
    if (player.isAttacking && player.framesCurrent === 2) {
        player.isAttacking = false
    }

    // Enemy attack
    if (rectangularCollision({rectangle1: enemy, rectangle2: player}) &&
        enemy.isAttacking && enemy.framesCurrent === 2
    ) {
        player.takeHit()
        enemy.isAttacking = false
        gsap.to('#playerHealth', {width: player.health + '%'})
    }

    // Enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // End game base on health
    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({player, enemy, timerId})
    }

    // Player death
    if (player.dead) {
        keys.a.pressed = false
        keys.d.pressed = false
        keys.w.pressed = false
    }
    // Enemy death
    if (enemy.dead) {
        keys.arrowRight.pressed = false
        keys.arrowUp.pressed = false
        keys.arrowLeft.pressed = false
    }
    // PLayer movement bounds
    if (player.position.x < 40) {
        player.position.x = 40
    }
    if (player.position.x > 950) {
        player.position.x = 950
    }
    // Enemy movement bounds
    if (enemy.position.x < 35) {
        enemy.position.x = 35
    }
    if (enemy.position.x > 930) {
        enemy.position.x = 930
    }

}

animate()


// KEYBOARD EVENTS
window.addEventListener('keydown', (event) => {

    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                if (player.velocity.y === 0) {
                    player.velocity.y = -20
                }
                break
            case ' ':
                if (player.image !== player.sprites.takeHit.image && !keys.space.pressed) {
                    keys.space.pressed = true
                    player.attack()
                }
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.arrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.arrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                if (enemy.velocity.y === 0) {
                    enemy.velocity.y = -20
                }
                break
            case 'ArrowDown':
                if (enemy.image !== enemy.sprites.takeHit.image && !keys.arrowDown.pressed) {
                    keys.arrowDown.pressed = true
                    enemy.attack()
                }
                break
        }
    }
})

window.addEventListener('keyup', (event) => {

    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = false
                break
            case 'a':
                keys.a.pressed = false
                break
            case 'w':
                player.velocity.y = 0
                break
            case ' ':
                keys.space.pressed = false
                break
        }
    }

    if (!enemy.dead) {
        switch (event.key) {
            case 'ArrowRight':
                keys.arrowRight.pressed = false
                break
            case 'ArrowLeft':
                keys.arrowLeft.pressed = false
                break
            case 'ArrowUp':
                enemy.velocity.y = 0
                break
            case 'ArrowDown':
                keys.arrowDown.pressed = false
                break
        }
    }
})
