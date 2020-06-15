import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';

export default class Load {
	constructor(scene) {
		this.scene = scene;
	}

	loadPlayground(path) {
		return new Promise((resolve) => {
			const loader = new GLTFLoader();
			loader.load(path, gltf => {
				this.playground = gltf.scene;
				this.playground.traverse((object) => {
					if (object.isMesh) {
						object.castShadow = true;
						object.receiveShadow = false;
					}
				});

				this.scene.add(this.playground);
				resolve(this.playground);
			});
		});
	}

	loadPlayer(path) {
		return new Promise((resolve) => {
			const loader = new GLTFLoader();
			loader.load(path, gltf => {
				this.player = gltf.scene;

				this.mixer = new THREE.AnimationMixer(this.player);
				this.jumpAction = this.mixer.clipAction(gltf.animations[0]);

				this.jumpAction.play();

				this.player.rotation.y = Math.PI;
				this.player.position.z = 8;

				this.player.traverse((object) => {
					if (object.isMesh) {
						object.castShadow = true;
						object.receiveShadow = false;
					}
				});

				this.player.add(this.scene.camera);
				this.scene.add(this.player);
				resolve(this.player);
			});
		});
	}

	getObjectByName(name) {
		return this.playground.children.find((object) => object.name === name);
	}
}
