import * as THREE from 'three';

export default class Character {
	constructor(load) {
		this.load = load;

		this.load.player.velocity = new THREE.Vector3();
	}

	setAnimationJump() {
		this.JUMP = true;
		this.load.jumpAction.play();
	}

	/* Set the ball in the player's right hand */
	setBall() {
		this.ball = this.load.getObjectByName("Ball");
		this.ball.position.set(0, 0, 0);

		this.rHand = this.load.player.children[1].skeleton.bones[28];
		let grabOffset = new THREE.Vector3(0, 0, 0);
		this.rHand.add(this.ball);
	}
}