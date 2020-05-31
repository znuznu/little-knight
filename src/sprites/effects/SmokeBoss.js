export default class SmokeBoss extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.add.existing(this);
    this.setDepth(5);
    this.setTint(0x2a2a2a, 0);
    this.setScale(4);
    this.play('smoke-boss');
    this.on('animationcomplete', _ => {
      this.destroy();
    }, this);
  }
}
