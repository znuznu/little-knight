/*
 * Abstract class.
 *
 * Enemies and Player extends this class.
 */

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

    // Updated when the Character moves.
    this.tileOn = undefined;

    this.setDepth(4);
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

  getTileOn() {
    return this.scene.map.getTileAtWorldXY(
      this.body.center.x,
      this.body.center.y,
      true,
      this.scene.cameras.main,
      this.scene.walkables
    );
  }

  update(time, delta) {
    if (!this.tileOn) {
      this.tileOn = this.getTileOn();
    }

    if (~~this.body.velocity.x !== 0 || ~~this.body.velocity.y !== 0) {
      if (this.getTileOn().index !== -1) {
        this.tileOn = this.getTileOn();
      } else {
        let previousX = this.tileOn.getCenterX() - this.body.offset.x / 2;
        let previousY = this.tileOn.getCenterY() - this.body.offset.y / 2;
        this.setPosition(previousX, previousY);
      }
    }

    this.actionStateMachine.update();
    this.updateAnimation();
  }
}
