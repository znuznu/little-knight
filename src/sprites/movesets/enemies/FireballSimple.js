export default class FireballSimple extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'fireball-simple-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.damage = 2;
    this.speed = 150;
    this.body.setCircle(15, 0, 0);
    this.setDepth(3);

    this.duration = 0;

    this.audioSprites = [
      'fireball_1',
      'fireball_2'
    ];

    this.scene.physics.add.overlap(
      this,
      this.scene.player,
      (fb, p) => { fb.playerCollide(p); },
      null,
      this.scene
    );
  }

  cast() {
    let angleRad = Phaser.Math.Angle.Between(
      this.x,
      this.y,
      this.scene.player.x,
      this.scene.player.y
    );
    let angleDeg = Phaser.Math.RadToDeg(angleRad);
    this.angle = angleDeg;

    // Avoid player getting hit by an inactive fireball.
    this.body.checkCollision.none = false;

    this.anims.stop();
    this.setActive(true);
    this.setVisible(true);
    this.play('fireball-simple', true);

    this.scene.sound.playAudioSprite(
      'sounds',
      this.audioSprites[~~(Math.random() * ~~(this.audioSprites.length))]
    );

    this.scene.physics.moveToObject(this, this.scene.player, this.speed);
  }

  playerCollide(player) {
    player.hurt(this.damage);
    this.explode();
  }

  explode() {
    this.duration = 0;
    this.play('fireball-simple-explosion', true);
    this.once('animationcomplete', _ => {
      this.setActive(false);
      this.setVisible(false);
      this.body.checkCollision.none = true;
    });
  }

  update(time, delta) {
    // Avoid fireballs flying forever into the void of bits.
    // Using delta, not the "good" way (time better) but it's okay.
    this.duration += delta;

    if (this.duration > 10000) {
      this.explode();
    }
  }
}
