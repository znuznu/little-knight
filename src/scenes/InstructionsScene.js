export default class InstructionsScene extends Phaser.Scene {
  constructor() {
    super('instructionsScene');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.add.image(0, 0, 'background-instructions').setOrigin(0, 0);
    let pressSpace = this.add.image(this.game.config.width / 2, 400, 'press-space');

    this.tweens.add({
      targets: pressSpace,
      alpha: 0,
      ease: 'Cubic.easeOut',
      duration: 2000,
      repeat: -1,
      yoyo: true
    });
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.start('gameScene', {
          level: '1',
          floor: '1',
          player: undefined
        }
      );
    }
  }
}
