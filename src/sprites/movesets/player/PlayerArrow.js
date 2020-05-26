export default class PlayerArrow extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'arrow-small');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.damage = 1;
    this.speed = 500;

    // Time between shots.
    this.loadTime = 400;
  }

  shoot() {
    //this.setFrame('arrow-small');

    if (this.scene.player.lastShot < this.loadTime) return;

    this.scene.player.lastShot = 0;

    this.x = this.scene.player.body.x;
    this.y = this.scene.player.body.y;

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

    this.setActive(true);
    this.setVisible(true);

    this.scene.physics.moveToObject(this, crosshair, this.speed);
  }

  enemyCollide(enemy) {
    enemy.arrowAttackTaken(this.damage);
    this.setActive(false);
    this.setVisible(false);
  }

  blocksCollide() {
    this.setActive(false);
    this.setVisible(false);
  }
}
