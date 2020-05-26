export default class PlayerSlash extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);
    config.scene.physics.add.overlap(
      this,
      config.scene.enemyGroup,
      (s, e) => { e.meleeAttackTaken(2); },
      null,
      config.scene
    );
    
    this.setDepth(3);
    this.play('slash-effect');
    this.on('animationcomplete', _ => {
      this.destroy();
    }, this);
  }
}
