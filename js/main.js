var stage = new Container();

var renderer = autoDetectRenderer(
	gameWidth, gameHeight,
	{antialias: false, transparent: false}
);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;

document.body.appendChild(renderer.view);

renderer.render(stage);

function resize() {
	renderer.resize(window.innerWidth, window.innerHeight);
	console.log("Renderer Size: " + renderer.width + "px x " + renderer.height + "px");
	if(gameScene != null && gameOverScene != null) {
		var rendererScale = 1;
		if(renderer.width / renderer.height > 16 / 9) {
			rendererScale = renderer.height / gameHeight;
		} else {
			rendererScale = renderer.width / gameWidth;
		}
		gameScene.scale.set(rendererScale);
		gameOverScene.scale.set(rendererScale);
	}
}

window.onresize = function (event){ resize(); }

var pusheen_url = "https://pbs.twimg.com/profile_images/848395594590814208/_TtPuzHs.jpg";
var capguy_url = "https://cdn.codeandweb.com/blog/2014/11/05/animate-sprites-in-css-with-texturepacker/capguy-walk.png"

loader
	.add([
		"img/pusheen.jpg",
		pusheen_url,
		//"img/capguy-walk.json",
		"img/capguy-walk.png",
		capguy_url
	])
	.on("progress", loadProgressHandler)
	.load(setup);

function loadProgressHandler(loader, resource) {

  //Display the file `url` currently being loaded
  console.log("loading: " + resource.url); 

  //Display the precentage of files currently loaded
  console.log("progress: " + loader.progress + "%"); 

  //If you gave your files names as the first argument 
  //of the `add` method, you can access them like this
  //console.log("loading: " + resource.name);
}

var timestamp_prev = null;
var gameScene, gameOverScene, message, pusheen, capguy;

//Capture the keyboard arrow keys
var space =keyboard(32),
	left = keyboard(37),
	up = keyboard(38),
	right = keyboard(39),
	down = keyboard(40);

function setup() {
	gameScene = new Container();
	stage.addChild(gameScene);

	gameOverScene = new Container();
	stage.addChild(gameOverScene);

	resize();

	message = new Text(
		"Hello, Pixi.js!",
		{fontFamily: "Arial", fontSize: 64, fill: "white"}
	);
	message.position.set(300, 300);
	gameOverScene.addChild(message);

	var rect = new Graphics();
	rect.beginFill(0x333333);
	rect.lineStyle(5, 0xFF0000);
	rect.drawRect(0, 0, gameWidth, gameHeight);
	gameScene.addChild(rect);

	player = new Player();
	gameScene.addChild(player.sprite);

	var capguyTexture = Texture.fromImage("img/capguy-walk.png");
	var frames = [];
	for(var i = 0; i < 8; i++) {
		var rectangle = new Rectangle(i * 184, 0, 184, 325);
		var frame = new Texture(capguyTexture, rectangle);
		frames.push(frame);
	}
	capguy = new AnimatedSprite(frames);
	capguy.animationSpeed = 0.1;
	capguy.play();
	gameScene.addChild(capguy);

	space.press = function() {
		// Todo
	}
	left.press = function() {
		if(player.onGround()) {
			player.nextState(State.WALK_L);
		}
	};
	left.release = function() {
		if(player.onGround() && player.state == State.WALK_L) {
			player.nextState(State.IDLE_L);
		}
	};
	right.press = function() {
		if(player.onGround()) {
			player.nextState(State.WALK_R);
		}
	};
	right.release = function() {
		if(player.onGround() && player.state == State.WALK_R) {
			player.nextState(State.IDLE_R);
		}
	};
	up.press = function() {
		if(player.onGround()) {
			if(player.state % 2 == State.L) {
				player.nextState(State.JUMP_L);
			} else {
				player.nextState(State.JUMP_R);
			}
		}
	}

	//Start the game loop
	gameLoop();
}

function gameLoop(timestamp) {

	var dt;

	if(timestamp_prev == null) timestamp_prev = timestamp;

	dt = timestamp - timestamp_prev;
	timestamp_prev = timestamp;
	// console.log(dt);

	//Loop this function at 60 frames per second
	requestAnimationFrame(gameLoop);

	//Update the current game state
	state(dt);

	//Render the stage to see the animation
	renderer.render(stage);
}

function state(dt) {
	player.update(dt);

	if(player.x + player.getWidth() >= gameWidth ||
		player.x <= 0) {
		end();
	}
}

function end() {
	message.text = "Game Over!";
	gameScene.visible = false;
	gameOverScene.visible = true;
}