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
				this.model = gltf.scene;
				this.model.traverse((object) => {
					if (object.isMesh) {
						object.castShadow = true;
						object.receiveShadow = false;
					}
				});

				this.scene.add(this.model);
				resolve(this.model);
			});
		});
	}

	loadPlayerJumping(path) {
		return new Promise((resolve) => {
			const loader = new FBXLoader();
			loader.load(path, object => {
				this.mixer = new THREE.AnimationMixer(object);
				this.jumpAction = this.mixer.clipAction(object.animations[0]);

				object.rotation.y = Math.PI;
				object.position.z = 8;

				object.traverse((child) => {
					if (child.isMesh) {
						child.castShadow = true;
						child.receiveShadow = false;
					}
				});

				this.scene.add(object)
				resolve(object);
			});
		});
	}
}
