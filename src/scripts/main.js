import Scene from './scene';
import Lights from './lights';
import Load from './load.js';
import Character from './character.js';

class App {
	constructor() {
		this.scene = null;
		this.lights = null;
		this.load = null;
		this.character = null;
		this.distance = null;

		this.delta = 0;
		this.time = 0;

		this.letsPlay();
	}

	async letsPlay() {
		this.scene = new Scene();
		this.load = new Load(this.scene);

		await Promise.all([
			this.load.loadPlayground('assets/models/playground.glb'),
			this.load.loadPlayer('assets/models/player.glb')
		]);

		this.init();
		this.animate();
	}

	init() {
		this.character = new Character(this.load, this.scene);
		this.lights = new Lights(this.scene, this.load);

		document.body.appendChild(this.scene.renderer.domElement);

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		window.addEventListener('click', () => this.character.setJumpAnimation());

		/* Get position between player and hoop */
		this.distance = Math.sqrt(Math.pow((this.load.player.position.z - this.load.playground.getObjectByName("HoopCloth").position.z), 2.1));
	}

	onWindowResize() {
		this.scene.camera.aspect = window.innerWidth / window.innerHeight;
		this.scene.camera.updateProjectionMatrix();
		this.scene.renderer.setSize(window.innerWidth, window.innerHeight);
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

		this.character.setJump(this.time, this.delta, this.distance);
		this.setGhostBall();

		this.scene.renderer.render(this.scene, this.scene.camera);
	}
}

window.app = new App();
