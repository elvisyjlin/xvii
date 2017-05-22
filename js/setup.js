function setup() {
	var pusheen = new PIXI.Sprite(resources.pusheen.texture);

	pusheen.scale.x = 0.2;
	pusheen.scale.y = 0.2;

	pusheen.x = app.renderer.width / 2;
	pusheen.y = app.renderer.height / 2;

	pusheen.anchor.x = 0.5;
	pusheen.anchor.y = 0.5;

	app.stage.addChild(pusheen);

	app.ticker.add(function() {
		pusheen.rotation += 0.01;
	});
}