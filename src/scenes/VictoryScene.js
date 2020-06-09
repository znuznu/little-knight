/*
 * Ending scene (victory).
 *
 * Happy music.
 *
 */

import MusicsEventsManager from '../events/MusicsEventsManager.js';

export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super('victoryScene');
  }

  create() {
    MusicsEventsManager.emit('play-music', 'Victory');
    this.cameras.main.fadeIn(5000);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.add.image(0, 0, 'background-game-victory').setOrigin(0, 0);

    let pressSpace = this.add.image(this.game.config.width/2, 440, 'press-space');
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
      this.scene.start('menuScene');
    }
  }
}
