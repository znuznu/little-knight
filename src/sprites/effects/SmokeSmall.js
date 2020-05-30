export default class SmokeSmall extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    this.setDepth(5);
    this.play('smoke-small');
    this.on('animationcomplete', _ => {
      this.destroy();
    }, this);
  }
}
