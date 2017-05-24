var Dir		= { L:0, R:1 };
var State	= { IDLE: 0, WALK: 1, JUMP: 2,	ATK: 3, SKL: 4 };
var DirFactor	= [ -1, 1 ];

//Capture the keyboard arrow keys
var space = keyboard(32),
	left = keyboard(37),
	up = keyboard(38),
	right = keyboard(39),
	down = keyboard(40);

function Player() {
	this.hp = 100;
	this.mp = 100;
	this.x = gameWidth / 2;
	this.y = gameHeight / 2;
	this.ax = 0.5;
	this.ay = 1.0;
	this.sx = 0.2;
	this.sy = 0.2;
	this.vx = 0;
	this.vy = 0;
	this.speed = 10;
	this.dir = Dir.L;
	this.nextDir = Dir.L;
	this.state = State.IDLE;
	this.nextState = State.IDLE;
	this.dirChanged = false;

	this.sprites = [];

	var sprite = new Sprite(resources["img/pusheen_idle.png"].texture);
	sprite.anchor.x = this.ax;
	sprite.anchor.y = this.ay;
	sprite.scale.x = this.sx;
	sprite.scale.y = this.sy;
	sprite.isAnimated = false;
	this.sprites.push(sprite);
	this.sprites.push(sprite);
	this.sprites.push(sprite);

	var capguyTexture = Texture.fromImage("img/capguy-walk.png");
	var frames = [];
	var frame = resources["img/pusheen_atk.png"].texture;
	for(var i = 0; i < 8; i++) {
		frames.push(frame);
	}
	var animatedSprite = new AnimatedSprite(frames);
	animatedSprite.animationSpeed = 0.1;
	animatedSprite.loop = false;
	animatedSprite.isAnimated = true;
	(function (instance) {
		animatedSprite.onComplete = function() {
			console.log('complete');
			if(left.isDown || right.isDown) {
				instance.toNextState(State.WALK);
			} else {
				instance.toNextState(State.IDLE);
			}
		};
	})(this);
	animatedSprite.anchor.x = this.ax;
	animatedSprite.anchor.y = this.ay;
	animatedSprite.scale.x = this.sx;
	animatedSprite.scale.y = this.sy;
	this.sprites.push(animatedSprite);
	this.sprites.push(animatedSprite);

	for(s of this.sprites) {
		gameScene.addChild(s);
		s.visible = false;
	}

	this.sprites[this.state].visible = true;

	this.registerKeys(this);
}

Player.prototype.update = function(dt) {
	if(this.y < gameHeight) {
		this.vy += gravity;
	}

	this.x += this.vx * DirFactor[this.dir];
	this.y += this.vy;

	if(this.y > gameHeight){
		this.vy = 0;
		this.y = gameHeight;
		if(left.isDown || right.isDown) {
			this.toNextState(State.WALK);
		} else {
			this.toNextState(State.IDLE);
		}
	}

	this.next();

	this.sprites[this.state].x = this.x;
	this.sprites[this.state].y = this.y;
	this.sprites[this.state].scale.x = this.sx * (-DirFactor[this.dir]);

	// console.log(this.x+"/"+this.y);
}

Player.prototype.next = function() {
	var locked = this.stateLocked();
	this.dirChanged = false;
	if(this.nextDir != this.dir && !locked) {
		this.toNextDir(this.nextDir);
	}
	if(this.dirChanged || this.nextState != this.state && !locked) {
		this.toNextState(this.nextState)
	}
}

Player.prototype.toNextDir = function(nextDir) {
	this.dir = nextDir;
	this.dirChanged = true;
}

Player.prototype.toNextState = function(nextState) {
	// console.log('Next state: ' + nextState);
	switch(nextState) {
		case State.IDLE:
			this.vx = 0;
			break;
		case State.WALK:
			this.vx = this.speed;
			break;
		case State.JUMP:
			this.vy = -20;
			break;
		case State.ATK:
			// nextState = this.state;
			break;
		case State.SKL:
			// nextState = this.state;
			break;
		default:
		console.log('Unknown state code: ' + state);
	}
	this.sprites[this.state].visible = false;
	this.state = nextState;
	this.nextState = nextState;
	this.sprites[this.state].visible = true;
	if(this.sprites[this.state].isAnimated) {
		this.sprites[this.state].gotoAndPlay(0);
	}
}

Player.prototype.onGround = function() {
	return this.y == gameHeight - this.sprites[this.state].height / 2;
}

Player.prototype.stateLocked = function() {
	return this.state != State.IDLE && this.state != State.WALK;
}

Player.prototype.getWidth = function() {
	return this.sprites[this.state].width;
}

Player.prototype.getHeight = function() {
	return this.sprites[this.state].height;
}

Player.prototype.registerKeys = function(instance) {

	space.press = function() {
		instance.nextState = State.ATK;
	};
	left.press = function() {
		instance.nextDir = Dir.L;
		instance.nextState = State.WALK;
	};
	left.release = function() {
		if(instance.dir == Dir.L) {
			instance.nextState = State.IDLE;
		}
	};
	right.press = function() {
		instance.nextDir = Dir.R;
		instance.nextState = State.WALK;
	};
	right.release = function() {
		if(instance.dir == Dir.R) {
			instance.nextState = State.IDLE;
		}
	};
	up.press = function() {
		instance.nextState = State.JUMP;
	};
}