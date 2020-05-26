export default class Character extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.alive = true;
    this.view = 'right';
    this.speed = 100;
    this.direction = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.setDepth(1);
    this.health = 1;
    this.animationState = {};
    this.actionStateMachine = {};
  }

  resetDirection() {
    Object.keys(this.direction).forEach(d => {
    	this.direction[d] = false;
    });
  }

  hit(damage) {
    this.health -= damage;
    if (this.health < 0) this.health = 0;
  }

  isDead() {
    return this.health <= 0;
  }

  distanceBetween(other) {
    return Phaser.Math.Distance.Between(this.x, this.y, other.x, other.y);
  }

  updateAnimation() {
    (this.view == 'left') ? this.setFlipX(true) : this.setFlipX(false);

    let anim = this.animationState[this.actionStateMachine.state];
    if (anim) {
      this.play(anim, true);
    }
  }
}
