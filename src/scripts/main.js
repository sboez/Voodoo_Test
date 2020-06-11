import Scene from './scene';
import Lights from './lights';
import Load from './load.js';
import * as THREE from 'three';

class App {
	constructor() {
		this.scene = null;
		this.lights = null;
		this.load = null;

		this.JUMP = false;

		this.delta = 0;

		this.letsPlay();
	}

	async letsPlay() {
		this.scene = new Scene();
		this.load = new Load(this.scene);

		await this.load.loadPlayground('assets/models/playground.glb');
		await this.load.loadPlayerJumping('assets/models/player_jumping.fbx');
		this.load.player.velocity = new THREE.Vector3();

		this.init();
		this.animate();
	}

	init() {
		this.lights = new Lights(this.scene);

		document.body.appendChild(this.scene.renderer.domElement);
		window.addEventListener('resize', this.onWindowResize.bind(this), false);

		window.addEventListener('click', this.setAnimationJump.bind(this), {once: true});
		window.addEventListener('mousedown', this.tuck);

		/* Get position between player and hoop */
		this.distance = Math.sqrt(Math.pow((this.load.player.position.z - this.getByName("HoopCloth").position.z - 0.5), 2));
	}

	getByName(name) {
		return this.load.playground.children.find((object) => object.name === name);
	}

	tuck() {
		console.log("tuck");
	}

	setAnimationJump() {
		this.JUMP = true;
		this.load.jumpAction.play();
		this.load.jumpAction.setLoop(THREE.LoopOnce);
		this.load.jumpAction.clampWhenFinished = true;
	}

	setJump() {
		/* Simulate a jump when knees are bent, pause animation when raised arms */
		if(this.JUMP && this.load.mixer.time > 2.2) {
			if (this.load.mixer.time > 2.4) this.load.jumpAction.paused = true;
			this.load.player.velocity.y += 0.002;
			this.load.player.position.z -= this.distance / 100;
		}
		if (this.load.player.position.y > 3) {
			this.JUMP = false;
			this.load.player.velocity.y -= 0.005;
			this.load.player.position.z -= this.distance / 100;
		}
		if (!this.JUMP && this.load.player.position.y <= 0.1) this.load.player.position.y = 0;
	}

	onWindowResize() {
		this.scene.camera.aspect = window.innerWidth / window.innerHeight;
		this.scene.camera.updateProjectionMatrix();
		this.scene.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.scene.controls.update();

		this.delta = this.scene.clock.getDelta();

		if (this.load.mixer) this.load.mixer.update(this.delta);

		this.load.player.position.add(this.load.player.velocity);
		this.setJump();

		this.scene.renderer.render(this.scene, this.scene.camera);
	}
}

new App();
