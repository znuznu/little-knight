export default class FireballSimple extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'fireball-arcanic-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.damage = 2;
    this.setDepth(3);

    this.audioSprites = [
      'fireball_1',
      'fireball_2'
    ];

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

    this.rotate();

    // Flip the fireball because of the evil face on it.
    if (this.angle >= 45 && this.angle <= 180 || this.angle >= -180 && this.angle <= -45) {
      this.setFlipY(true);
    } else {
      this.setFlipY(false);
    }

    // Avoid player getting hit by an inactive fireball.
    this.body.checkCollision.none = false;

    this.anims.stop();
    this.setActive(true);
    this.setVisible(true);
    this.play('fireball-arcanic', true);

    this.scene.sound.playAudioSprite(
      'sounds',
      this.audioSprites[~~(Math.random() * ~~(this.audioSprites.length))]
    );

    this.scene.sound.playAudioSprite('sounds', 'ghost', {volume: 0.1});

    // Random but at least 80.
    let speed = ~~(Math.random() * ~~(100)) + 80;
    this.scene.physics.moveTo(this, x, y, speed);
  }

  // Rotate toward the angle from this fireball.
  // To adjust.
  rotate() {
    // Adjust the hitbox.
    let leftLimit = 135, rightLimit = 45;
    let top = this.angle > rightLimit && this.angle < leftLimit;
    let down = this.angle < -rightLimit && this.angle > -leftLimit;

    if (top || down) {
      this.body.setSize(32, 64);
      this.body.setOffset(16, 0);
    } else {
      this.body.setSize(64, 32);
    }
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
