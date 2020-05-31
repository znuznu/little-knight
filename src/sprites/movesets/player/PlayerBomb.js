export default class PlayerBomb extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'bomb-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(3);
    this.damage = 4;
  }

  throw(x, y) {
    this.setPosition(x, y);
    this.setVisible(true);
    this.setActive(true);
    this.play('bomb');
    this.on('animationcomplete', _ => {
        this.explode();
    }, this);
  }

  explode() {
    this.hide();
    let explosion = this.scene.explosionsGroups.get();
    if (explosion) {
      explosion.use(this.x, this.y);
    }
  }

  hide() {
    this.setVisible(false);
    this.setActive(false);
  }

  update() {
    
  }
}
