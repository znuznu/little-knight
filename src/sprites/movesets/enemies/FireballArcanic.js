export default class FireballSimple extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'fireball-arcanic-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.damage = 2;
    this.body.setCircle(15, 0, 0);
    this.setDepth(3);

    this.play('fireball-arcanic', true);

    this.audioSprites = [
      'fireball_1',
      'fireball_2'
    ];
  }

  cast(x, y, targetX, targetY) {
    this.setPosition(x, y);

    let angleRad = Phaser.Math.Angle.Between(x, y, targetX, targetY);
    let angleDeg = Phaser.Math.RadToDeg(angleRad);
    this.angle = angleDeg;

    this.updateAngle();

    this.anims.stop();
    this.play('fireball-arcanic', true);

    this.show(true);

    this.scene.sound.playAudioSprite(
      'sounds',
      this.audioSprites[~~(Math.random() * ~~(this.audioSprites.length))]
    );

    this.scene.sound.playAudioSprite('sounds', 'ghost', {volume: 0.1});

    // Random but at least 80.
    let speed = ~~(Math.random() * ~~(100)) + 80;
    this.scene.physics.moveTo(this, targetX, targetY, speed);
  }

  // Adjust the Y axis of the sprite depending on the angle.
  updateAngle() {
    if (this.angle >= 90 && this.angle <= 179 || this.angle >= -180 && this.angle <= -90) {
      this.setFlipY(true);
    } else {
      this.setFlipY(false);
    }
  }

  playerCollide(player) {
    player.hurt(this.damage);
    this.explode();
  }

  show(isActive) {
    this.setVisible(isActive);
    this.setActive(isActive);
    this.body.checkCollision.none = !isActive;
  }

  explode() {
    this.play('fireball-arcanic-explosion', true);
    this.once('animationcomplete', _ => {
      this.show(false);
    });
  }
}
