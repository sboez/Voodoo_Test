import * as THREE from 'three';

export default class Character {
	constructor(load) {
		this.load = load;

		this.load.player.velocity = new THREE.Vector3();
	}

	setIdleAnimation() {
		this.load.action.play();
		if (!this.END && this.load.action.time >= 8.2) this.load.action.time = 0;
	}

	/* Active jump animation to the first click, flip animation for other
		Open store at the first click when jump is finished */
	setJumpAnimation() {
		this.nbClick += 1;

		if (this.nbClick === 1) {
			this.JUMP = true;
			this.load.action.time = 8.45;
		}
		else if (this.nbClick > 1 && this.JUMP) this.setFlip();
		else if (this.nbClick > 1 && !this.JUMP) window.open("https://apps.apple.com/fr/app/flip-dunk/id1459811607");
	}

	/* Finish player animation */
	setEndJump() {
		this.load.action.paused = false;

		this.load.player.position.z = 1.3;
		this.load.player.rotation.x = 0;

		if (this.load.player.position.y <= 0) this.load.player.position.y = 0;
	}

	/* Set the ball in the player's right hand */
	setBall() {
		this.ball = this.load.playground.getObjectByName("Ball");
		this.ball.position.set(0, 0, 0);

		this.rHand = this.load.player.getObjectByName("hand_r");
		this.rHand.add(this.ball);
	}
}