import * as THREE from 'three';

export default class Character {
	constructor(load) {
		this.load = load;

		this.load.player.velocity = new THREE.Vector3();
	}

	setIdleAnimation() {
		if (this.load.jumpAction.time >= 8.2) this.load.jumpAction.time = 0;
	}

	/* Active jump animation to the first click, flip animation for other */
	setJumpAnimation() {
		this.nbClick += 1;

		if (this.nbClick === 1) {
			this.JUMP = true;
			this.load.jumpAction.time = 8.45;
		}
		else if (this.nbClick > 1 && this.JUMP) this.setFlip();
		else if (this.nbClick > 1 && !this.JUMP) window.open("https://apps.apple.com/fr/app/flip-dunk/id1459811607");
	}

	/* Set the ball in the player's right hand */
	setBall() {
		this.ball = this.load.getObjectByName("Ball");
		this.ball.position.set(0, 0, 0);

		this.rHand = this.load.player.children[0].children[4].children[0].children[0].children[0].children[2].children[0].children[0].children[0];
		this.rHand.add(this.ball);
	}

	getObjectByName(name) {
		return this.load.playground.children.find((object) => object.name === name);
	}
}