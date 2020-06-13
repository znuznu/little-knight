export default class Knife extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'large-knife');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(3);
    this.damage = 1;
    this.speed = 250;
    this.activeTime = 0;
  }

  throw(x, y, directionX, directionY) {
    this.activeTime = 0;
    this.setPosition(x, y);
    let angleRad = Phaser.Math.Angle.Between(x, y, directionX, directionY);
    let angleDeg = Phaser.Math.RadToDeg(angleRad);
    this.angle = angleDeg;

    this.anims.stop();
    this.setFrame('large-knife');
    this.show(true);
    this.scene.physics.moveTo(this, directionX, directionY, this.speed);
  }

  playerCollide(player) {
    player.hurt(this.damage);
    this.break();
  }

  deflects() {
    this.scene.physics.moveTo(
      this,
      -this.body.velocity.x,
      -this.body.velocity.y,
      this.speed * 1.5
    );

    if (this.angle < 0)
      this.angle += 180;
    else
      this.angle -= 180;
  }

  break() {
    this.activeTime = 0;
    this.play('smoke-small', true);
    this.once('animationcomplete', _ => {
      this.show(false);
    });
  }

  show(isActive) {
    this.setVisible(isActive);
    this.setActive(isActive);
    this.body.checkCollision.none = !isActive;
  }

  update(time, delta) {
    this.activeTime += delta;

    if (this.activeTime > 10000) {
      this.break();
    }
  }
}
