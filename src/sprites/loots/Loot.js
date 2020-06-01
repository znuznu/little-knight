/* Items dropped by enemies at their death that can
 * be grab by the player. Disappear after 10 seconds.
 */

export default class Loot extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'smoke-small-1');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(2);
  }

  appear(x, y) {
    this.body.checkCollision.none = false;
    this.setPosition(x, y);
    this.setVisible(true);
    this.setActive(true);
    
  }

  hide() {
    this.body.checkCollision.none = true;
    this.setVisible(false);
    this.setActive(false);
  }
}
