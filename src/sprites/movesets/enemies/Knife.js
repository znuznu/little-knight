export default class Knife extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'large-knife');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(3);
    this.damage = 1;
    this.speed = 200;
    this.activeTime = 0;
  }

  throw(x, y, directionX, directionY) {
    this.activeTime = 0;
    this.setPosition(x, y);
    let angleRad = Phaser.Math.Angle.Between(x, y, directionX, directionY);
    let angleDeg = Phaser.Math.RadToDeg(angleRad);
    this.angle = angleDeg;

    // Avoid player getting hit by an inactive knife.
    this.body.checkCollision.none = false;

    this.anims.stop();
    this.setFrame('large-knife');
    this.setActive(true);
    this.setVisible(true);

    this.scene.physics.moveTo(this, directionX, directionY, this.speed);
  }

  playerCollide(player) {
    player.hurt(this.damage);
    this.break();
  }

  break() {
    this.activeTime = 0;
    this.play('smoke-small', true);
    this.once('animationcomplete', _ => {
      this.hide();
    });
  }

  hide() {
    this.setActive(false);
    this.setVisible(false);
    this.body.checkCollision.none = true;
  }

  update(time, delta) {
    this.activeTime += delta;

    if (this.activeTime > 10000) {
      this.break();
    }
  }
}
