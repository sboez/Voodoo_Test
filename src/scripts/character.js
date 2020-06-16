import * as THREE from 'three';

export default class Character {
	constructor(load, scene) {
		this.load = load;
		this.scene = scene;

		this.nbClick = 0;
		this.ball = null;
		this.rHand = null;
		this.JUMP = false;

		this.JUMP_ACTION_TIME = 8.45;
		this.BENT_KNEES_TIME = 9.4;
		this.RAISED_ARMS_TIME = 9.7;
		this.END_ACTION_TIME = 11;

		this.load.player.velocity = new THREE.Vector3();
		this.setBall();
	}

	/* Set the ball in the player's right hand */
	setBall() {
		this.ball = this.load.playground.getObjectByName("Ball");
		this.ball.position.set(0.05, 0.15, 0);

		this.rHand = this.load.player.getObjectByName("hand_r");
		this.rHand.add(this.ball);
	}

	setIdleAnimation() {
		this.load.action.play();
		if (!this.END && this.load.action.time >= 8.2) this.load.action.time = 0;
	}

	/* Active jump animation to the first click, flip animation for other
		Open store at the first click when jump is finished */
	setJumpAnimation() {
		this.nbClick += 1;

		if (this.nbClick === 1) {
			this.JUMP = true;
			this.load.action.time = this.JUMP_ACTION_TIME;
		}
		else if (this.nbClick > 1 && this.JUMP) this.setFlip();
		else if (this.nbClick > 1 && !this.JUMP) window.open("https://apps.apple.com/fr/app/flip-dunk/id1459811607");
	}

	setJump(time, delta, distance) {
		/* To synchronize click event with player forward rotation */
		if (!this.JUMP && this.load.player.position.z > 7) {
			this.setIdleAnimation();
			this.dt = 0;
		}
		else this.dt += delta;

		if (this.JUMP) this.load.action.play();

		/* Simulate a jump when knees are bent, pause animation when raised arms and forward rotation */
		if (this.load.action.time > this.BENT_KNEES_TIME) {
			this.load.player.velocity.y += 0.002;
			this.load.player.rotation.x = this.dt * -0.2;
			this.load.player.position.z -= distance / 100;
			if (this.load.action.time > this.RAISED_ARMS_TIME) this.load.action.paused = true;
			if (this.load.player.position.y > 1) {
				this.JUMP = false;
				this.load.player.velocity.y -= 0.005;
				this.load.player.position.z -= distance / 100;
			}
		}

		/* When player is near to the basket */
		if (this.load.player.position.z <= 0.8) {
			if (this.load.action.time >= this.END_ACTION_TIME) this.load.action.stop();
			this.setBounce(time);
			this.setDunkPos();
		}
	}

	/* Bouncing ball after dunk */
	setBounce(time) {
		this.scene.attach(this.ball);
		this.ball.rotation.x = time * 4 / (1 + (time * 0.1));
		this.ball.position.y = 0.1 + (Math.abs(Math.sin(time * 3)) * 2) / (1 + (time * 0.1));
		this.ball.position.z = 0;
	}

	/* Simulate dunk position */
	setDunkPos() {
		this.load.player.velocity.y = 0;
		this.load.player.position.z = 0.8;
		this.load.player.rotation.x = -0.4;
	}

	/* Active flip animation */
	setFlip() {
		console.log("flip");
	}
}