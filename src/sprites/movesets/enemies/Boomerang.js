/**
 * The sword thrown by Depressum.
 */

export default class Boomerang extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'boomerang');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.owner = undefined;
    this.damage = 1;
    this.speed = 250;
    this.charge = 1;
    this.setDepth(3);
  }

  chase(targetX, targetY) {
    this.scene.physics.moveTo(this, targetX, targetY, this.speed);
  }

  throw(x, y, targetX, targetY) {
    this.setPosition(x, y);
    this.show(true);
    this.charge = 1;
    this.chase(targetX, targetY);
  }

  playerCollide(player) {
    player.hurt(this.damage);
    this.reduceCharge();
  }

  blocksCollide() {
    this.reduceCharge();
  }

  ownerCollide() {
    if (!this.charge) {
      this.owner.hasBoomerang = true;
      this.liberate();
    }
  }

  reduceCharge() {
    if (this.charge != 0)
      this.charge -= 1;
  }

  setOwner(owner) {
    this.owner = owner;
    this.overlapMaster = this.scene.physics.add.overlap(
      this,
      this.owner,
      (b, m) => { b.ownerCollide(); }
    );
  }

  // The owner might be dead.
  liberate() {
    this.owner.boomerang = undefined;
    this.owner = undefined;
    this.charge = 1
    this.overlapMaster.destroy();
    this.show(false);
  }

  show(isActive) {
    this.setActive(isActive);
    this.setVisible(isActive);
    this.body.checkCollision.none = !isActive;
  }

  update(time, delta) {
    if (!this.lastRotation) {
      this.lastRotation = time;
    }

    if (this.charge < 1) {
      this.chase(this.owner.body.center.x, this.owner.body.center.y);
    }

    if (time - this.lastRotation >= 30) {
      this.angle += 30;
      this.lastRotation = time;
    }
  }
}
