import * as THREE from 'three';

export default class Lights {
	constructor(scene) {
		this.scene = scene;

		this.setAmbient();
	}

	setAmbient() {
		const hemlight = new THREE.HemisphereLight(0x404040, 0x404040, 1); 
		this.scene.add(hemlight);
	}
}
