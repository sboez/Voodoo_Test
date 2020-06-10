import Scene from './scene';
import Lights from './lights';
import Load from './load.js';

class App {
	constructor() {
		this.scene = null;
		this.lights = null;
		this.load = null;

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
		this.lights = new Lights(this.scene);
		document.body.appendChild(this.scene.renderer.domElement);
		window.addEventListener('resize', this.onWindowResize.bind(this), false);
	}

	onWindowResize() {
		this.scene.camera.aspect = window.innerWidth / window.innerHeight;
		this.scene.camera.updateProjectionMatrix();
		this.scene.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.scene.controls.update();

		const delta = this.scene.clock.getDelta();

		if (this.load.mixer) this.load.mixer.update(delta);

		this.scene.renderer.render(this.scene, this.scene.camera);
	}
}

new App();
