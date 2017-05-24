var Dir		= { L:0, R:1 };
var State	= { IDLE: 0, WALK: 1, JUMP: 2,	ATK: 3, SKL: 4 };
var Speed	= [ -10, 10 ];

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
	this.ay = 0.5;
	this.sx = 0.2;
	this.sy = 0.2;
	this.vx = 0;
	this.vy = 0;
	this.dir = Dir.L;
	this.nextDir = Dir.L;
	this.state = State.IDLE;
	this.nextState = State.IDLE;
	this.dirChanged = false;

	this.sprite = new Sprite(resources[pusheen_url].texture);
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.sprite.anchor.x = this.ax;
	this.sprite.anchor.y = this.ax;
	this.sprite.scale.x = this.sx;
	this.sprite.scale.y = this.sy;

	this.registerKeys(this);
}

Player.prototype.update = function(dt) {
	if(this.y < gameHeight - this.sprite.height / 2) {
		this.vy += gravity;
	}

	this.x += this.vx;
	this.y += this.vy;

	if(this.y > gameHeight - this.sprite.height / 2){
		this.vy = 0;
		this.y = gameHeight - this.sprite.height / 2;
		if(left.isDown || right.isDown) {
			this.toNextState(State.WALK);
		} else {
			this.toNextState(State.IDLE);
		}
	}

	this.next();

	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.sprite.scale.x = this.sx;
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
	this.sx = -this.sx;
	this.dirChanged = true;
}

Player.prototype.toNextState = function(nextState) {
	console.log('Next state: ' + nextState);
	switch(nextState) {
		case State.IDLE:
			this.vx = 0;
			break;
		case State.WALK:
			this.vx = Speed[this.dir];
			break;
		case State.JUMP:
			this.vy = -20;
			break;
		case State.ATK:
			nextState = this.state;
			break;
		case State.SKL:
			nextState = this.state;
			break;
		default:
		console.log('Unknown state code: ' + state);
	}
	this.state = nextState;
	this.nextState = nextState;
}

Player.prototype.onGround = function() {
	return this.y == gameHeight - this.sprite.height / 2;
}

Player.prototype.stateLocked = function() {
	return this.state != State.IDLE && this.state != State.WALK;
}

Player.prototype.getWidth = function() {
	return this.sprite.width;
}

Player.prototype.getHeight = function() {
	return this.sprite.height;
}

Player.prototype.registerKeys = function(instance) {

	space.press = function() {
		instance.nextState = State.ATK;
	}
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