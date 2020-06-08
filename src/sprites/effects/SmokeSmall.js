export default class SmokeSmall extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'smoke-small-0');
    this.scene.add.existing(this);
    this.setDepth(5);
  }

  use(x, y) {
    this.setPosition(x, y);
    this.setVisible(true);
    this.setActive(true);
    this.play('smoke-small', true);
    this.once('animationcomplete', _ => {
      this.hide();
    }, this);
  }

  hide() {
    this.setVisible(false);
    this.setActive(false);
  }
}
