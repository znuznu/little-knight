export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('endScene');
  }

  init(data) {
    this.result = data.result;
    this.dataSaved = data.dataSaved;
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    let background = 'background-game-victory';

    if (this.result == 'over') {
      this.cameras.main.fadeIn(5000);
      background = 'background-game-over';
    }

    this.add.image(0, 0, background).setOrigin(0, 0);

    let pressSpace = this.add.image(this.game.config.width/2, 400, 'press-space');
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
        level: this.dataSaved.level,
        floor: this.dataSaved.floor,
        player: {
          health: this.dataSaved.player.health,
          inventory: [],
          weapons: this.dataSaved.player.weapons
        }
      });
    }
  }
}
