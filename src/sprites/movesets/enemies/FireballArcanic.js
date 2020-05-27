export default class FireballSimple extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'fireball-arcanic-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.damage = 2;
    this.setDepth(3);

    this.scene.physics.add.overlap(
      this,
      this.scene.player,
      (fa, p) => { fa.playerCollide(p); },
      null,
      this.scene
    );
  }

  cast(x, y) {
    let angleRad = Phaser.Math.Angle.Between(this.x, this.y, x, y);
    let angleDeg = Phaser.Math.RadToDeg(angleRad);
    this.angle = angleDeg;

    // Avoid player getting hit by an inactive fireball.
    this.body.checkCollision.none = false;

    this.anims.stop();
    this.setActive(true);
    this.setVisible(true);
    this.play('fireball-arcanic', true);

    // Random but at least 80.
    let speed = ~~(Math.random() * ~~(100)) + 80;
    this.scene.physics.moveTo(this, x, y, speed);
  }

  playerCollide(player) {
    player.hurt(this.damage);
    this.explode();
  }

  explode() {
    this.play('fireball-arcanic-explosion', true);
    this.once('animationcomplete', _ => {
      this.setActive(false);
      this.setVisible(false);
      this.body.checkCollision.none = true;
    });
  }
}
