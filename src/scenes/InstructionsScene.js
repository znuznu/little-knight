import MusicsEventsManager from '../events/MusicsEventsManager.js';

export default class InstructionsScene extends Phaser.Scene {
  constructor() {
    super('instructionsScene');
  }

  create() {
    MusicsEventsManager.emit('prout');
    this.cursors = this.input.keyboard.createCursorKeys();

    // Default is AZERTY (queue).
    this.controls = ['ZQSD', 'WASD'];

    this.keys = this.input.keyboard.addKeys({
        space:  'SPACE',
        shift:  'SHIFT'
    });

    // Background.
    this.background = this.add.image(0, 0, 'background-instructions-zqsd').setOrigin(0, 0);

    // "Press SPACE ...". Could have been a bitmapText.
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

  switchMoveControls() {
    let current = this.controls.shift();
    this.controls.push(current);

    if (this.controls[0] === 'ZQSD')
      this.background.setTexture('background-instructions-zqsd');
    else
      this.background.setTexture('background-instructions-wasd');
  }

  update() {
    if (this.keys.space.isDown) {
      this.sound.playAudioSprite('sounds', 'confirm_2');
      this.scene.start('gameScene', {
          level: '0',
          floor: '0',
          player: undefined,
          moveControls: this.controls[0]
        }
      );
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.shift)) {
      this.sound.playAudioSprite('sounds', 'switch');
      this.switchMoveControls();
    }
  }
}
