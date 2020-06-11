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
}