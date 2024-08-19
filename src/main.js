import kaplay from "kaplay";
import "kaplay/global";


const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 500;


const k = kaplay({
	debug: true,
	background: [135, 206, 235],
});


k.loadSprite("bunny", "sprites/bunny.png");
k.loadSprite("bunnyJump", "sprites/bunnyJ.png");
k.loadSprite("bunnyLose", "sprites/bunny-sad.gif");
k.loadSprite("bunnyH", "sprites/cute_bunnny.jpg");
k.loadSprite("start", "sprites/start.webp");
k.loadSprite("sun", "sprites/sun.png");


k.loadSprite("sprite", "sprites/bunnySprite.png",{
    // The image contains 9 frames layed out horizontally, slice it into individual frames
    sliceX: 4,
	sliceY: 6,
    // Define animations
    anims: {
        "idle": {
            from: 11,
            to: 9,
            // Frame per second
            speed: 5,
            loop: true,
        },
        "jump": 11,
        // This animation only has 1 frame
    },
});



k.scene("start", () => {

    k.add([
        sprite("start"),
        pos(width() / 2, height() / 2- 120 ),
        scale(2),
        anchor("center"),
    ]);

	k.add([
        text("Welcome! Press space to start"),
        pos(width() / 2, height() / 2 + 300),
        scale(1.6),
        anchor("center"),
    ]);

	let highScore = 0;
    onKeyPress("space", () => go("game", highScore));
    onClick(() => go("game", highScore));
});

k.scene("game", (highScore) => 
{
	k.setGravity(1600);
	let score = 0;

	k.add([
		sprite("sun"),
		pos(width(), height()/6),
		scale(2),
		anchor("right"),
	])

	const bunny = k.add([
		k.pos(300,800),
		k.sprite("sprite"),
		scale(2),
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

	function spawnTree(){
		if(score<2000){		
			k.add([
			rect(44, rand(20, 64)),
			area(),
			pos(width(), height() - FLOOR_HEIGHT),
			anchor("botleft"),
			color(105,75,55),
			move(LEFT, SPEED),
			"tree",
		]);
		wait(rand(0.75, 2), spawnTree);
		}

		if(score>2000){
			k.add([
				rect(44, rand(50, 64)),
				area(),
				pos(width(), height() - FLOOR_HEIGHT),
				anchor("botleft"),
				color(0, 0, 128),
				move(LEFT, SPEED*1.05),
				"tree",
			]);
			wait(rand(0.6, 1.15), spawnTree);}
	}
	
	spawnTree();
	
	bunny.onCollide("tree", () => {
		go("lose", score, highScore);
		addKaboom(bunny.pos);
	});
    const scoreLabel = add([text(score), pos(24, 24)]);
    const highscoreLabel = add([text(highScore), pos(24, 60)]);


	onKeyDown(["down","s"], () => {
		bunny.move(0, SPEED);
	});


	bunny.play("idle");
    k.onUpdate(() => {
		if(score==2350){
		addKaboom(bunny.pos);
		}

		onKeyPress(["space", "up", "w"], () => {
			if (bunny.isGrounded()) {
				bunny.jump();
				bunny.play("jump");
			}
			else{
				bunny.play("idle");
			}
		});
        score++;
        scoreLabel.text = score;
		highscoreLabel.text = highScore;
    });

});

scene("lose", (score, highScore) => {
	if(score < highScore ){
		k.add([
			sprite("bunnyLose"),
			pos(width() / 2, height() / 2- 120 ),
			scale(2),
			anchor("center"),
		]);


    	k.add([
        	text(`Game Over! Your highscore: ${highScore}`),
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
	}
	else
	{
		highScore = score;
		k.add([
			sprite("bunnyH"),
			pos(width() / 2, height() / 2- 120 ),
			scale(0.2),
			anchor("center"),
		]);


		k.add([
        	text(`Game Over! Your highscore: ${highScore}`),
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
	

	}

    onKeyPress("space", () => go("game", highScore));
    onClick(() => go("game", highScore));
});

k.go("start");