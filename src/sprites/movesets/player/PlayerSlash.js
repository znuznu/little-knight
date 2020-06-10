export default class PlayerSlash extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'slash-effect-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(12);
    this.damage = 2;

    // Recovery time, in ms.
    this.recovery = 200;

    this.directionToAngle = {
      'north': -1.57,
      'south': 1.57,
      'east': 0,
      'west': -3.14,
      'north-west': -2.35,
      'north-east': -0.785,
      'south-west': 2.35,
      'south-east': 0.785
    };
  }

  use(x, y, direction) {
    this.rotation = this.directionToAngle[direction];
    this.setPosition(x, y);
    this.setVisible(true);
    this.setActive(true);
    this.body.checkCollision.none = false;
    this.play('slash-effect');
    this.on('animationcomplete', _ => {
      this.hide();
    }, this);
  }

  hide() {
    this.setVisible(false);
    this.setActive(false);
    this.body.checkCollision.none = true;
  }
}
