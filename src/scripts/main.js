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
		this.nbClick = 0;

		this.letsPlay();
	}

	async letsPlay() {
		this.scene = new Scene();
		this.load = new Load(this.scene);

		await this.load.loadPlayground('assets/models/playground.glb');
		await this.load.loadPlayer('assets/models/player.glb');

		this.init();
		this.animate();
	}

	init() {
		this.character = new Character(this.load);
		this.lights = new Lights(this.scene, this.load);

		this.character.setBall();

		document.body.appendChild(this.scene.renderer.domElement);

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		window.addEventListener('click', this.character.setJumpAnimation.bind(this));

		/* Get position between player and hoop */
		this.distance = Math.sqrt(Math.pow((this.load.player.position.z - this.load.playground.getObjectByName("HoopCloth").position.z), 2.1));
	}

	onWindowResize() {
		this.scene.camera.aspect = window.innerWidth / window.innerHeight;
		this.scene.camera.updateProjectionMatrix();
		this.scene.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	/* Active flip animation */
	setFlip() {
		console.log("flip");
	}

	setJump() {
		/* To synchronize click event with player forward rotation */
		if (!this.JUMP && this.load.player.position.z > 7) {
			this.character.setIdleAnimation();
			this.dt = 0;
		}
		else this.dt += this.delta;

		if (this.JUMP) this.load.action.play();

		/* Simulate a jump when knees are bent, pause animation when raised arms and forward rotation */
		if (this.load.action.time > 9.4) {
			this.load.player.velocity.y += 0.002;
			this.load.player.rotation.x = this.dt * -0.2;
			this.load.player.position.z -= this.distance / 100;
			if (this.load.action.time > 9.7) this.load.action.paused = true;
			if (this.load.player.position.y > 2) {
				this.JUMP = false;
				this.load.player.velocity.y -= 0.005;
				this.load.player.position.z -= this.distance / 100;
			}
		}

		/* When player is near to the basket */
		if (this.load.player.position.z <= 1.3) {
			if (this.load.action.time >= 11) this.load.action.stop();
			this.setBounce();
			this.character.setEndJump();
		}
	}

	/* Bouncing ball after dunk */
	setBounce() {
		this.scene.attach(this.character.ball);
		this.character.ball.rotation.x = this.time * 4 / (1 + (this.time * 0.1));
		this.character.ball.position.y = 0.1 + (Math.abs(Math.sin(this.time * 3)) * 2) / (1 + (this.time * 0.1));
		this.character.ball.position.z = 0;
	}

	/* Bounce the "ghost ball" to make creepy ambiance */
	setGhostBall() {
		this.ghostBall = this.load.playground.getObjectByName("Ghost");
		this.ghostBall.rotation.x = this.time * 4;
		this.ghostBall.position.y = 0.1 + Math.abs(Math.sin(this.time * 3)) * 2;
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
