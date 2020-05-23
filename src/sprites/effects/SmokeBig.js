export default class SmokeBig extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    this.setDepth(3);
    this.play('smoke-big');
    this.on('animationcomplete', _ => {
      this.destroy();
    }, this);
  }
}
