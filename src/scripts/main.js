import Scene from './scene';
import Lights from './lights';

class App {
	constructor() {
		this.scene = null;
		this.lights = null;

		this.letsPlay();
	}

	async letsPlay() {
		this.scene = new Scene();

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
		this.scene.renderer.render(this.scene, this.scene.camera);
	}
}

new App();
