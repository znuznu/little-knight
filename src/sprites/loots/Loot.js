/*
 * Abstract class.
 *
 * Items dropped by enemies at their death that can be grabbed by the player.
 * Disappear after 10 seconds by default.
 */

export default class Loot extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'smoke-small-1');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(2);
    this.name = 'default';
  }

  use() {
    this.scene.player.grab(this.name);
    this.hide();
  }

  appear(x, y) {
    this.body.checkCollision.none = false;
    this.setPosition(x, y);
    this.setVisible(true);
    this.setActive(true);

    this.scene.time.delayedCall(10000, _ => {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        ease: 'Cubic.easeOut',
        duration: 1000,
        repeat: 0,
        onComplete: _ => {
          this.hide();
          this.setAlpha(1);
        }
      });
    });
  }

  hide() {
    this.body.checkCollision.none = true;
    this.setVisible(false);
    this.setActive(false);
  }
}
