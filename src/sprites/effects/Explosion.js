/*
 * Explosion caused (for example) by bomb.
 */

export default class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'smoke-big-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(6);
    this.damage = 4;
    this.body.setSize(50, 50);
  }

  use(x, y) {
    this.body.checkCollision.none = false;
    this.setPosition(x, y);
    this.setVisible(true);
    this.setActive(true);
    
    this.scene.sound.playAudioSprite('sounds', 'explosion_1');
    this.play('explosion');
    this.on('animationcomplete', _ => {
      this.hide();
    }, this);
  }

  hide() {
    this.body.checkCollision.none = true;
    this.setVisible(false);
    this.setActive(false);
  }
}
