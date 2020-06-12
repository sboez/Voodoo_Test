import * as THREE from 'three';

export default class Character {
	constructor(load) {
		this.load = load;

		this.load.player.velocity = new THREE.Vector3();
	}

	/* Active jump animation to the first click, flip animation for other */
	setAnimation() {
		this.nbClick += 1;

		if (this.nbClick === 1) {
			this.JUMP = true;
			this.load.jumpAction.play();
			this.load.jumpAction.loop = THREE.LoopOnce;
		}
		else if (this.nbClick > 1 && this.JUMP) this.setFlip();
	}

	/* Set the ball in the player's right hand */
	setBall() {
		this.ball = this.load.getObjectByName("Ball");
		this.ball.position.set(0, 0, 0);

		this.rHand = this.load.player.children[1].skeleton.bones[28];
		this.rHand.add(this.ball);
	}
}