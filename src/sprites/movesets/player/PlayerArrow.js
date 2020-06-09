export default class PlayerArrow extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'arrow-small');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.damage = 1;
    this.speed = 500;

    // Time between shots.
    this.loadTime = 400;

    this.duration = 0;
  }

  shoot(x, y) {
    if (this.scene.player.lastShot < this.loadTime) return;

    this.duration = 0;
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

    // We don't want enemies hit by an invisible arrow when inactive.
    this.body.checkCollision.none = false;
    // Active arrow doesn't need any animations.
    this.anims.stop();
    this.setFrame('arrow-small');
    this.setActive(true);
    this.setVisible(true);

    this.scene.physics.moveToObject(this, crosshair, this.speed);
  }

  enemyCollide(enemy) {
    enemy.arrowAttackTaken(this.damage);
    if (enemy.arrowProof) {
      this.break();
    } else {
      this.hide();
    }
  }

  break() {
    this.body.setVelocity(0);
    this.angle = 0;
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
    this.duration += delta;

    if (this.duration > 5000) {
      this.break();
    }
  }
}
