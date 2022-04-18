class Sprite {
    constructor({position, imageSrc, framesMax = 1, imgOffset = {x: 0, y: 0}}) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.imgOffset = imgOffset
    }

    animateFrames() {
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.imgOffset.x,
            this.position.y - this.imgOffset.y,
            this.image.width / this.framesMax,
            this.image.height
        )
    }

    update() {
        this.draw()
        this.framesElapsed++
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }

    }
}

class Fighter extends Sprite {
    constructor(
        {
            position,
            velocity,
            imageSrc,
            framesMax = 1,
            imgOffset = {x: 0, y: 0},
            sprites,
            attackBox = {offset: {x: 0, y: 0}, width: undefined, height: undefined},
            effect
        }
    ) {
        super({
            position,
            imageSrc,
            framesMax,
            imgOffset
        })
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey = ''
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.isAttacking = false
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.sprites = sprites
        this.dead = false
        this.effect = effect

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }


    update() {
        this.draw()
        if (!this.dead)
            this.animateFrames()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // Draw attack box
        // c.fillStyle = 'rgba(0, 0, 0, 0.3)'
        // c.fillRect(
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height,)

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        // Gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 125) {
            this.velocity.y = 0;
            this.position.y = 301
        } else {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.switchSprite('attack')
        this.isAttacking = true
    }

    takeHit() {
        this.health -= 10
        if (this.health <= 0) {
            this.switchSprite('death')
        } else {
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite) {
        // Overriding all other animations when character death
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1) {
                this.dead = true
            }
            console.log('return 1')
            return
        }

        // Overriding all other animations with the attack animation
        if (this.image === this.sprites.attack.image &&
            this.framesCurrent < this.sprites.attack.framesMax - 1 &&
            this.health !== 0
        ) {
            console.log('return 2')
            return
        }


        // Overriding all other animations when fighter get hit
        if (this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1 &&
            this.health !== 0
        ) {
            console.log('return 3')
            return
        }


        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'attack':
                if (this.image !== this.sprites.attack.image) {
                    this.effect.voice.play()
                    this.effect.sword.play()
                    this.image = this.sprites.attack.image
                    this.framesMax = this.sprites.attack.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }
}
