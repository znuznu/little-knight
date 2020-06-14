/**
 * First real scene.
 *
 * I'm using background images for all the menu scenes. This is not the way it
 * must be made but I wanted to try lots of Phaser 3 features and background is
 * one of them.
 *
 */

import MusicsEventsManager from '../events/MusicsEventsManager.js';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('menuScene');
  }

  create() {
    this.scene.launch('musicsScene');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.add.image(0, 0, 'background-menu').setOrigin(0, 0);
    let pressSpace = this.add.image(this.game.config.width / 2, 400, 'press-space');
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
      this.sound.playAudioSprite('sounds', 'confirm_1', {volume: 0.2});
      this.scene.start('instructionsScene');
    }
  }
}
