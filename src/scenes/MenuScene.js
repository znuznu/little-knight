export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('menuScene');
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.add.image(0, 0, 'background-menu').setOrigin(0, 0);
    let pressSpace = this.add.image(this.game.config.width/2, 400, 'press-space');
    this.tweens.add({
      targets: pressSpace,
      alpha: 0,
      ease: 'Cubic.easeOut',
      duration: 2000,
      repeat: -1,
      yoyo: true
    });

    this.knight = this.physics.add.sprite(148, 120, 'atlas', 'little-knight-idle-0');
    this.knight.setScale(5)
    this.knight.play('player-menu-flex', true);
  }

  update() {
    if (this.cursors.space.isDown) {
      this.scene.start('instructionsScene');
    }
  }
}
