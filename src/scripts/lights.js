import * as THREE from 'three';

export default class Lights {
	constructor(scene, load) {
		this.scene = scene;
		this.load = load;

		this.setHem();
		this.setPoint();
	}

	setHem() {
		const hemlight = new THREE.HemisphereLight(0x404040, 0x404040, 0.6); 
		this.scene.add(hemlight);
	}

	/* Lights the garage */
	setPoint() {
		const pointLight = new THREE.PointLight(0xEBCE7C, 1, 10);
		pointLight.position.set(-7, 7, -10);
		this.scene.add(pointLight);
	}
}
