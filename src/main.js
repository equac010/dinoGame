import kaplay from "kaplay";
import "kaplay/global";


const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;


const k = kaplay({
	debug: true,
	background: [135, 206, 235,],
});


k.loadSprite("bunny", "sprites/bunny.png")
k.loadSprite("bunnyJump", "sprites/bunnyJ.png")
k.loadSprite("bunnyLose", "sprites/bunny-sad.gif")
     
k.scene("game", () => 
{
	k.setGravity(2000);


	const bunny = k.add([
	k.pos(200, 40),
	k.sprite("bunny"),
	k.body(),
	k.area(),
	]);

	const ground = k.add([
        rect(width(), FLOOR_HEIGHT),
        pos(0, height()),
        anchor("botleft"),
        area(),
        body({ isStatic: true }),
        color(45,129,19),
    ]);

	onKeyPress("space", () => {
		if (bunny.isGrounded()) {
			bunny.jump();
			k.sprite("bunnyJump");
		}
	});
	
	function spawnTree(){
		k.add([
			rect(44, rand(20, 64)),
			area(),
			pos(width(), height() - FLOOR_HEIGHT),
			anchor("botleft"),
			color(255, 180, 255),
			move(LEFT, SPEED),
			"tree",
		]);
		wait(rand(0.75, 2), spawnTree);
	}
	
	spawnTree();
	
	bunny.onCollide("tree", () => {
		go("lose", score);
		addKaboom(bunny.pos);
	});

	let score = 0;

    const scoreLabel = add([text(score), pos(24, 24)]);

    // increment score every frame
    k.onUpdate(() => {
        score++;
        scoreLabel.text = score;
    });

});

scene("lose", (score) => {
    k.add([
        sprite("bunnyLose"),
        pos(width() / 2, height() / 2- 120 ),
        scale(2),
        anchor("center"),
    ]);

    k.add([
        text(score),
        pos(width() / 2, height() / 2 + 120),
        scale(2),
        anchor("center"),
    ]);

	k.add([
        text("Press space to go again"),
        pos(width() / 2, height() / 2 + 200),
        scale(2),
        anchor("center"),
    ]);

    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));
});





k.go("game");