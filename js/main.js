let app = new Application({
    width: 1366, 
    height: 768
});

document.body.appendChild(app.view);

scaleToWindow(app.view);
window.addEventListener("resize", function(event){ 
    scaleToWindow(app.view);
});

var canvas = document.getElementsByTagName("canvas")[0];
function fullscreen(){
    var el = document.getElementsByTagName("canvas")[0];
    if(el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
    }
    else {
        el.mozRequestFullScreen();
    }            
}
canvas.addEventListener("click",fullscreen)

let state, world;

loader
    .add("pusheen", "img/pusheen.jpg")
    .add("pusheen2", "img/pusheen2.jpg")
    .on("progress", loadProgressHandler)
    .load(setup);

function loadProgressHandler(loader, resource) {
    console.log("loading: " + resource.url);
    console.log("progress: " + loader.progress + "%");
}

function setup() {
    console.log("setup");

    let pusheen = new Player(
        {Idle: [resources.pusheen.texture, resources.pusheen2.texture], 
         Walk: [resources.pusheen.texture, resources.pusheen.texture, resources.pusheen.texture], 
         Run: [resources.pusheen.texture, resources.pusheen.texture, resources.pusheen.texture], 
         Jump: [resources.pusheen.texture, resources.pusheen.texture, resources.pusheen.texture], 
         Punch: [resources.pusheen.texture, resources.pusheen.texture, resources.pusheen.texture]}, 
        {left: 37, up: 38, right: 39, down: 40}
    );
    pusheen.scale.set(0.1);
    pusheen.position.set(app.view.width/2, app.view.height/2);

    world = new World(app.view.width*3, app.view.height, app.view.width, app.view.height, 600);
    world.setStage(app.stage);
    world.debug();
    world.addPlayer(pusheen);

    state = play;

    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    state(delta);
}

function play(delta) {
    world.update(delta);
}