import Scene from './scene';
import Lights from './lights';
import Load from './load.js';
import Character from './character.js';
import * as THREE from 'three';

class App {
	constructor() {
		this.scene = null;
		this.lights = null;
		this.load = null;
		this.character = null;

		this.JUMP = false;
		this.delta = 0;
		this.time = 0;
		this.dt = this.time;

		this.letsPlay();
	}

	async letsPlay() {
		this.scene = new Scene();
		this.load = new Load(this.scene);

		await this.load.loadPlayground('assets/models/playground.glb');
		await this.load.loadPlayerJumping('assets/models/player_jumping.fbx');

		this.init();
		this.animate();
	}

	init() {
		this.character = new Character(this.load);
		this.lights = new Lights(this.scene, this.load);

		this.character.setBall();

		document.body.appendChild(this.scene.renderer.domElement);

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		window.addEventListener('click', this.character.setAnimationJump.bind(this), {once: true});
		window.addEventListener('mousedown', this.flip);

		/* Get position between player and hoop */
		this.distance = Math.sqrt(Math.pow((this.load.player.position.z - this.getObjectByName("HoopCloth").position.z), 2));

	}

	flip() {
		console.log("flip");
	}

	onWindowResize() {
		this.scene.camera.aspect = window.innerWidth / window.innerHeight;
		this.scene.camera.updateProjectionMatrix();
		this.scene.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	setJump() {
		/* To synchornize click event with player forward rotation */
		if (!this.JUMP) this.dt = 0;
		else this.dt += this.delta;

		/* Simulate a jump when knees are bent, pause animation when raised arms and forward rotation */
		if(this.JUMP && this.load.jumpAction.time > 1.05) {
			if (this.load.jumpAction.time > 1.5) this.load.jumpAction.paused = true;
			this.load.player.velocity.y += 0.002;
			this.load.player.rotation.x = this.dt * -0.2;
			this.load.player.position.z -= this.distance / 100;
		}
		if (this.load.player.position.y > 2) {;
			this.JUMP = false;
			this.load.player.velocity.y -= 0.005;
			this.load.player.position.z -= this.distance / 100;
		}

		/* Simulate hook when player is near to the hoop */
		if (!this.JUMP && this.load.player.position.z <= 1.3 && this.load.player.position.y >= 1.1 
			&& this.load.player.position.y <= 2) {
			this.load.player.position.z = 1.3;
			this.load.player.position.y = 1.6;
		}
	}

	/* Bounce the "ghost ball" alone to make creepy ambiance */
	setGhostBall() {
		this.ghostBall = this.getObjectByName("Ghost");
		this.ghostBall.rotation.x = this.time * 4;
		this.ghostBall.position.y = 0.5 + Math.abs(Math.sin(this.time * 3)) * 2;
	}

	getObjectByName(name) {
		return this.load.playground.children.find((object) => object.name === name);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.scene.controls.update();

		this.delta = this.scene.clock.getDelta();
		this.time += this.delta;

		if (this.load.mixer) this.load.mixer.update(this.delta);

		this.load.player.position.add(this.load.player.velocity);

		this.setJump();
		this.setGhostBall();

		this.scene.renderer.render(this.scene, this.scene.camera);
	}
}

new App();
