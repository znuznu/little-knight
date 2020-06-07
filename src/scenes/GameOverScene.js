import MusicsEventsManager from '../events/MusicsEventsManager.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameOverScene');
  }

  init(data) {
    this.dataSaved = data.dataSaved;
  }

  create() {
    MusicsEventsManager.emit('play-music', 'GameOver');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.cameras.main.fadeIn(5000);
    this.add.image(0, 0, 'background-game-over').setOrigin(0, 0);

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
        },
        moveControls: this.dataSaved.moveControls
      });
    }
  }
}
