import kaplay from "kaplay";
import "kaplay/global";

const k = kaplay({
	debug: true,
	background: [135, 206, 235,],
});


k.loadSprite("bunny", "sprites/bunny.png")

k.scene("game", () => 
{
	k.setGravity(1600);


	const bunny = k.add([
	k.pos(80, 40),
	k.sprite("bunny"),
	k.body(),
	k.area(),
	]);

	onKeyPress("space", () => {
    if (bunny.isGrounded()) {
        bunny.jump();
    }
	});


	const ground = k.add([
    rect(width(), 48),
    pos(0, height() - 48),
    outline(4),
    area(),
    body({ isStatic: true }),
    color(255, 255, 255),
	]);

}
)