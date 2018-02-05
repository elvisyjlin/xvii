class World {
    constructor(width, height, viewWidth, viewHeight, ground, gravity=0.9, fraction=0.2) {
        this.width = width;
        this.height = height;
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.ground = ground;
        this.gravity = gravity;
        this.fraction = fraction;
        this.hud = new Container();
        this.foreground = new Container();
        this.background = new Container();
        this.container = new Container();
        this.container.vx = 0;
        this.container.vy = 0;

        this.sceneRect = null;
        this.leftBound = this.viewWidth / 4;
        this.rightBound = this.viewWidth * 3 / 4;

        this.playerList = [];
    }

    debug() {
        let line, rectangle;
        line = new Graphics();
        line.lineStyle(4, 0x00FF00, 0.5);
        line.moveTo(4, this.ground);
        line.lineTo(this.viewWidth-4, this.ground);
        this.hud.addChild(line);

        rectangle = new Graphics();
        rectangle.lineStyle(4, 0xFF0000, 0.5);
        rectangle.drawRect(8, 8, this.viewWidth-16, this.viewHeight-16);
        this.hud.addChild(rectangle);

        rectangle = new Graphics();
        rectangle.lineStyle(4, 0xFFFF00, 0.5);
        rectangle.drawRect(4, 4, this.width-8, this.height-8);
        this.hud.addChild(rectangle);
        this.sceneRect = rectangle;

        rectangle = new Graphics();
        rectangle.beginFill(0x0000FF,0.2);
        rectangle.drawRect(0, 0, this.leftBound, this.viewHeight);
        this.hud.addChild(rectangle);

        rectangle = new Graphics();
        rectangle.beginFill(0x0000FF,0.2);
        rectangle.drawRect(this.rightBound, 0, this.viewWidth, this.viewHeight);
        this.hud.addChild(rectangle);
    }

    setStage(stage) {
        stage.addChild(this.container);
        stage.addChild(this.hud);
    }

    addChild(actor) {
        this.container.addChild(actor);
    }

    addPlayer(player) {
        this.addChild(player);
        this.playerList.push(player);
    }

    moveScene(delta) {
        let playersCenterX = 0, playersCenterY = 0;
        this.playerList.forEach((player) => {
            let position = this.container.toGlobal(player);
            playersCenterX += position.x;
            playersCenterY += position.y;
        });
        playersCenterX /= this.playerList.length;
        playersCenterY /= this.playerList.length;
        if(playersCenterX < this.leftBound && this.container.x <= 0) {
            this.container.vx = (this.leftBound-playersCenterX)/50 * delta;
        } else if(playersCenterX > this.rightBound && this.container.x >= this.viewWidth-this.width) {
            this.container.vx = (this.rightBound-playersCenterX)/50 * delta;
        } else {
            this.container.vx = 0;
        }
        this.container.x += this.container.vx;
        this.container.y += this.container.vy;
        if(this.sceneRect != null) {
            this.sceneRect.x = this.container.x;
            this.sceneRect.y = this.container.y;
        }
    }

    update(delta) {
        this.container.children.forEach((actor) => {
            actor.update(delta);
            actor.updateState(this.ground);
            if(actor.isOnGround()) {
                actor.stayOnGround(this.ground);
                actor.applyFraction(this.fraction * delta);
            } else if(actor.isUnderGravity()) {
                actor.applyGravity(this.gravity * delta);
            }
        });
        this.moveScene(delta);
    }
}

class Actor extends Sprite {
    constructor(texture, gravity=true) {
        super(texture);

        this.gravity = gravity;

        this.vx = 0;
        this.vy = 0;

        this.onGround = false;
    }

    update(delta=1.0) {
        this.x += this.vx * delta;
        this.y += this.vy * delta;
    }

    updateState(ground) {
        if(this.touchGround(ground)) {
            this.onGround = true;
        } else {
            this.onGround = false;
        }
    }

    touchGround(ground) {
        return this.y+this.height >= ground;
    }

    isUnderGravity() {
        return this.gravity;
    }

    isOnGround() {
        return this.onGround;
    }

    isInAir() {
        return !this.onGround;
    }

    stayOnGround(ground) {
        this.y = ground - this.height;
        this.vy = 0;
    }

    applyGravity(gravity) {
        this.vy += gravity;
    }

    applyFraction(fraction) {
        if(this.vx > 0) {
            this.vx -= fraction;
            if(this.vx < 0) {
                this.vx = 0;
            }
        } else if(this.vx < 0) {
            this.vx += fraction;
            if(this.vx > 0) {
                this.vx = 0;
            }
        }
    }
}

function Enum() {
    for (var i in arguments) {
        this[arguments[i]] = arguments[i];
    }
}

var PlayerState = new Enum("Idle", "Walk", "Run", "Jump", "Punch");

class Player extends Actor {
    constructor(textures, keyCodes, speed=1.0, speedLimit=4.0, jumpSpeed=20) {
        super(textures.Idle[0], true);
        this.anchor.x = 0.5;

        this.speed = speed;
        this.speedLimit = speedLimit;
        this.jumpSpeed = jumpSpeed;
        this.textures = textures;
        this.controller = {};
        for(var key in keyCodes) {
            this.controller[key] = keyboard(keyCodes[key]);
        }
        this.controller.up.press = () => {
            if(this.can(PlayerState.Jump)) {
                this.vy = -this.jumpSpeed;
            }
        }

        this.state = PlayerState.Idle;
        this.nextState = PlayerState.Idle;
        this.textureIndex = 0;
        this.counter = 0;
        this.duration = 60;
    }

    update(delta=1.0) {
        if(this.controller.left.isDown && this.isOnGround() && this.can(PlayerState.Walk)) {
            this.vx -= this.speed * delta;
            if(this.vx < -this.speedLimit) {
                this.vx = -this.speedLimit;
            }
        }
        if(this.controller.right.isDown && this.isOnGround() && this.can(PlayerState.Walk)) {
            this.vx += this.speed * delta;
            if(this.vx > +this.speedLimit) {
                this.vx = +this.speedLimit;
            }
        }
        this.counter += delta;
        if(this.counter > this.duration) {
            this.counter = 0;
            this.textureIndex = (this.textureIndex+1) % this.textures[this.state].length;
            this.setTexture(this.textures[this.state][this.textureIndex])
        }
        super.update(delta);
    }

    updateState(ground) {
        super.updateState(ground);
        if(this.nextState != this.state) {
            //
        }
        if(this.vx > 0 && this.scale.x > 0) {
            this.scale.x = -this.scale.x;
        } else if(this.vx < 0 && this.scale.x < 0) {
            this.scale.x = -this.scale.x;
        }
    }

    can(playerState) {
        let flag = false;
        switch(playerState) {
            case PlayerState.Idle:
                flag = true;
                break;
            case PlayerState.Walk:
                flag = this.state==PlayerState.Idle || this.state==PlayerState.Walk;
                break;
            case PlayerState.Jump:
                flag = this.state==PlayerState.Idle || this.state==PlayerState.Walk;
                break;
        }
        return flag;
    }
}