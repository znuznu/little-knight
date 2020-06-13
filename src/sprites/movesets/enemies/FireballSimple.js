export default class FireballSimple extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'fireball-simple-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.damage = 2;
    this.speed = 150;
    this.body.setCircle(15, 0, 0);
    this.setDepth(3);

    this.timeAlive = 0;

    this.audioSprites = [
      'fireball_1',
      'fireball_2'
    ];
  }

  cast(x, y, targetX, targetY) {
    let angleRad = Phaser.Math.Angle.Between(x, y, targetX, targetY);
    let angleDeg = Phaser.Math.RadToDeg(angleRad);
    this.angle = angleDeg;

    this.anims.stop();
    this.play('fireball-simple', true);

    this.show(true);

    this.scene.sound.playAudioSprite(
      'sounds',
      this.audioSprites[~~(Math.random() * ~~(this.audioSprites.length))]
    );

    this.setPosition(x, y);
    this.scene.physics.moveTo(this, targetX, targetY, this.speed);
  }

  playerCollide(player) {
    player.hurt(this.damage);
    this.explode();
  }

  explode() {
    this.timeAlive = 0;
    this.play('fireball-simple-explosion', true);
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
    // Avoid fireballs flying forever into the void of bits.
    // Using delta, not the "good" way (time better) but it's okay.
    this.timeAlive += delta;

    if (this.timeAlive > 10000) {
      this.explode();
    }
  }
}
