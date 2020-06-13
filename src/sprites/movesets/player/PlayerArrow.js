export default class PlayerArrow extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'arrow-small');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.damage = 1;
    this.speed = 500;

    // Time between shots.
    this.recoveryTime = 400;

    this.aliveTime = 0;
  }

  shoot(x, y) {
    if (this.scene.player.lastShot < this.recoveryTime) return;

    this.aliveTime = 0;
    this.scene.player.lastShot = 0;

    this.setPosition(x, y);

    this.scene.sound.playAudioSprite('sounds', 'arrow_2');

    let crosshair = this.scene.crosshair;
    let angleRad = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      crosshair.x,
      crosshair.y
    );

    let angleDeg = Phaser.Math.RadToDeg(angleRad);
    this.angle = angleDeg;
    let leftLimit = 135, rightLimit = 45;
    let top = this.angle > rightLimit && this.angle < leftLimit;
    let bottom = this.angle < -rightLimit && this.angle > -leftLimit;

    if (top || bottom) {
      this.body.setOffset(10, 0);
      this.body.setSize(8, 32);
    } else {
      this.body.setOffset(0, 10);
      this.body.setSize(32, 8);
    }

    // Active arrow doesn't need any animations.
    this.anims.stop();
    this.setFrame('arrow-small');

    this.show(true);

    this.scene.physics.moveToObject(this, crosshair, this.speed);
  }

  enemyCollide(enemy) {
    enemy.arrowAttackTaken(this.damage);
    if (enemy.arrowProof) {
      this.break();
    } else {
      this.show(false);
    }
  }

  break() {
    this.body.setVelocity(0);
    this.angle = 0;
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
    this.aliveTime += delta;

    if (this.aliveTime > 5000) {
      this.break();
    }
  }
}
