//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite;

//Create a container object called the `stage`
var stage = new Container();

//Create the renderer
var renderer = autoDetectRenderer(
  1920, 1080,
  {antialias: false, transparent: false}
);
renderer.view.style.position = "absolute";
renderer.view.style.display = "block";
renderer.autoResize = true;
renderer.resize(window.innerWidth, window.innerHeight);
console.log("Renderer Size: " + renderer.width + "px x " + renderer.height + "px");

//Add the canvas to the HTML document
document.body.appendChild(renderer.view);

var pusheen_url = "https://pbs.twimg.com/profile_images/848395594590814208/_TtPuzHs.jpg";

//Tell the `renderer` to `render` the `stage`
renderer.render(stage);

loader
	.add([
		"img/pusheen.jpg",
		pusheen_url,
		"img/capguy-walk.json"
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

var gameScene, gameOverScene, pusheen;

function setup() {
	gameScene = new Container();
	stage.addChild(gameScene);

	gameOverScene = new Container();
	stage.addChild(gameOverScene);

	pusheen = new Sprite(resources[pusheen_url].texture);
	pusheen.x = renderer.width / 2;
	pusheen.y = renderer.height / 2;
	pusheen.anchor.x = 0.5;
	pusheen.anchor.y = 0.5;
	pusheen.scale.x = 0.2;
	pusheen.scale.y = 0.2;
	pusheen.vx = 0;
	pusheen.vy = 0;
	gameScene.addChild(pusheen);

	var frames = [];
	for(var i=0; i<8; i++) {
		frames.push(PIXI.Texture.fromFrame('capguy-walk-000' + i + '.png'))
	}
	var anim = new PIXI.extras.AnimatedSprite(frames);
	anim.animationSpeed = 0.5;
	anim.play();
	stage.addChild(anim);

	//Capture the keyboard arrow keys
	var space =keyboard(32),
		left = keyboard(37),
		up = keyboard(38),
		right = keyboard(39),
		down = keyboard(40);

	space.press = function() {
		gameScene.width = 100;
		console.log(gameScene.width);
	}
	left.press = function() {
		pusheen.vx = -1;
	};
	left.release = function() {
		pusheen.vx = 0;
	};
	up.press = function() {
		pusheen.vy = -1;
	};
	up.release = function() {
		pusheen.vy = 0;
	};
	right.press = function() {
		pusheen.vx = 1;
	};
	right.release = function() {
		pusheen.vx = 0;
	};
	down.press = function() {
		pusheen.vy = 1;
	};
	down.release = function() {
		pusheen.vy = 0;
	};
}

function gameLoop() {

	//Loop this function at 60 frames per second
	requestAnimationFrame(gameLoop);

	//Update the current game state
	state();

	//Render the stage to see the animation
	renderer.render(stage);
}

function state() {
	pusheen.rotation += 0.01;
	pusheen.x += pusheen.vx;
	pusheen.y += pusheen.vy;
}

function end() {
	gameScene.visible = false;
	gameOverScene.visible = true;
}

//Start the game loop
gameLoop();