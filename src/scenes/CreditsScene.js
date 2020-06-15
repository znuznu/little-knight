/**
 * Credits scene.
 *
 * Thanks guys !
 *
 */

export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super('creditsScene');
  }

  create() {
    this.cameras.main.fadeIn(2000);
    let art = {
      title: 'Art',
      names: [
        '0x72',
        'o_lobster',
        'superdark',
        'alexs-assets'
      ]
    };

    let musics = {
      title: 'Musics',
      names: [
        'Tim Beek',
        'cactusdude'
      ]
    };

    let sounds = {
      title: 'Sounds',
      names: [
        'aristicdude',
        'qubodup',
        'timothyadan',
        'ogrebane',
        'obsydianx'
      ]
    };

    let fonts = {
      title: 'Fonts',
      names: [
        'Bitty',
        'by MashArcade',
        'Harmonic',
        'by Monkopus'
      ]
    };

    let types = [
      art,
      musics,
      sounds,
      fonts
    ]

    let width = this.game.config.width;
    let height = this.game.config.height;

    this.add.bitmapText(
      width / 2,
      32, 'bitty', 'Special thanks', 64
    ).setOrigin(0.5, 0.5);

    let x = 100;

    types.forEach(type => {
      this.add.bitmapText(
        x,
        120, 'bitty', type.title, 64
      ).setOrigin(0.5, 0.5);

      this.showNames(x, type.names);

      x += 200;
    });

    this.cursors = this.input.keyboard.createCursorKeys();
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

  showNames(x, names) {
    names.forEach((name, index) => {
      this.add.bitmapText(
        x,
        160 + 32 * index, 'bitty', name, 32
      ).setOrigin(0.5, 0.5);
    });
  }

  update() {
    if (this.cursors.space.isDown) {
      this.sound.playAudioSprite('sounds', 'confirm_1', {volume: 0.2});
      this.scene.start('menuScene');
    }
  }
}
