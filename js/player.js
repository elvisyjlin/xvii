var State = {L:0, R:1, IDLE_L: 2, IDLE_R: 3, WALK_L: 4, WALK_R: 5, JUMP_L: 6, JUMP_R: 7};

function Player() {
	this.State = {IDLE_L: 0, IDLE_R: 1, WALK_L: 2, WALK_R: 3};
	this.x = gameWidth / 2;
	this.y = gameHeight / 2;
	this.ax = 0.5;
	this.ay = 0.5;
	this.sx = 0.2;
	this.sy = 0.2;
	this.vx = 0;
	this.vy = 0;
	this.state = this.State.IDLE_R;

	this.sprite = new Sprite(resources[pusheen_url].texture);
	this.sprite.x = this.x;
	this.sprite.y = this.y;
	this.sprite.anchor.x = this.ax;
	this.sprite.anchor.y = this.ax;
	this.sprite.scale.x = this.sx;
	this.sprite.scale.y = this.sy;
}

Player.prototype.update = function(dt) {
	if(this.y < gameHeight - this.sprite.height / 2) {
		this.vy += gravity;
	} else if(this.y > gameHeight - this.sprite.height / 2){
		this.vy = 0;
		this.y = gameHeight - this.sprite.height / 2;
		if(this.vx < 0 && left.isDown) {
			this.nextState(State.WALK_L);
		} else if(this.vx > 0 && right.isDown) {
			this.nextState(State.WALK_R);
		} else if(this.state % 2 == State.L) {
			this.nextState(State.IDLE_L);
		} else {
			this.nextState(State.IDLE_R);
		}
	}
	this.x += this.vx;
	this.y += this.vy;
	this.sprite.x = this.x;
	this.sprite.y = this.y;
}

Player.prototype.nextState = function(state) {
	console.log('Next state: ' + state);
	this.state = state;
	switch(state) {
		case State.IDLE_L:
			this.vx = 0;
			break;
		case State.IDLE_R:
			this.vx = 0;
			break;
		case State.WALK_L:
			this.vx = -3;
			break;
		case State.WALK_R:
			this.vx = 3;
			break;
		case State.JUMP_L:
			this.vy = -10;
			break;
		case State.JUMP_R:
			this.vy = -10;
			break;
		default:
			console.log('Unknown state code: ' + state);
	}
}

Player.prototype.onGround = function() {
	return this.y == gameHeight - this.sprite.height / 2;
}

Player.prototype.getWidth = function() {
	return this.sprite.width;
}

Player.prototype.getHeight = function() {
	return this.sprite.height;
}