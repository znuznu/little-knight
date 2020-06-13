/**
 * The sword thrown by Depressum.
 */

export default class PursuitSword extends Phaser.GameObjects.Sprite {
  constructor(scene, master) {
    super(scene, 0, 0, 'atlas', 'sword-boss-01-simple');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.master = undefined;
    this.damage = 1;
    this.speed = 300;
    this.charge = 3;
    this.setDepth(3);
  }

  chase(target) {
    this.scene.physics.moveTo(this, target.body.center.x, target.body.center.y, this.speed);
    this.rotateToward(target);
  }

  collide() {
    this.charge -= 1;
    this.chase(this.master.target);
  }

  collidePlayer(player) {
    player.hurt(this.damage);
    this.charge = 0;
  }

  rotateToward(target) {
    // Adjust the angle.
    let angleRad = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    let angleDeg = Phaser.Math.RadToDeg(angleRad);
    this.angle = angleDeg;

    // Adjust the hitbox.
    let leftLimit = 135, rightLimit = 45;
    let top = this.angle > rightLimit && this.angle < leftLimit;
    let bottom = this.angle < -rightLimit && this.angle > -leftLimit;

    if (top || bottom) {
      this.body.setOffset(8, 0);
      this.body.setSize(10, 46);
    } else {
      this.body.setOffset(0, 8);
      this.body.setSize(46, 10);
    }
  }

  throw(master, target) {
    this.setVisible(true);
    this.setActive(true);
    this.body.checkCollision.none = false;
    this.master = master;
    this.x = this.master.x + 16;
    this.y = this.master.y + 16;
    this.charge = 3;
    this.chase(target);
  }

  update() {
    if (this.charge <= 0) {
      this.chase(this.master);
    }
  }
}
