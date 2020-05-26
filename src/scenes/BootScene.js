export default class BootScene extends Phaser.Scene {
  constructor() {
    super('bootScene');
  }

  preload() {
    this.load.image('background-menu', 'assets/images/backgrounds/background-menu.png');
    this.load.image('background-instructions', 'assets/images/backgrounds/background-instructions.png');
    this.load.image('background-game-victory', 'assets/images/backgrounds/background-game-victory.png');
    this.load.image('background-game-over', 'assets/images/backgrounds/background-game-over.png');
    this.load.image('press-space', 'assets/images/backgrounds/background-space.png');
    this.load.image('tileset', 'assets/images/tilesets/tileset-extruded.png');

    this.load.tilemapTiledJSON('map', 'assets/tilemaps/map.json');
    this.load.tilemapTiledJSON('level-1-floor-1', 'assets/tilemaps/level-1-floor-1.json');
    this.load.tilemapTiledJSON('level-1-floor-2', 'assets/tilemaps/level-1-floor-2.json');
    this.load.tilemapTiledJSON('level-1-floor-3', 'assets/tilemaps/level-1-floor-3.json');
    this.load.tilemapTiledJSON('level-1-floor-4', 'assets/tilemaps/level-1-floor-4.json');
    this.load.tilemapTiledJSON('level-1-floor-666', 'assets/tilemaps/level-1-floor-666.json');

    this.load.atlas(
      'atlas',
      'assets/images/atlas/atlas.png',
      'assets/images/atlas/atlas.json',
    );
  }

  create() {
    this.add.text(20, 20, 'Loading...');
    this.createAnimations();
    this.scene.start('menuScene');
  }

  createAnimations() {
    /* Player */
    this.anims.create({
      key: 'player-menu-flex',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'little-knight-idle-',
          suffix: '',
          start: 0,
          end: 5,
          zeroPad: 0
        }
      ),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'little-knight-idle-',
          suffix: '',
          start: 0,
          end: 5,
          zeroPad: 0
        }
      ),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'player-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'little-knight-run-',
          suffix: '',
          start: 0,
          end: 5,
          zeroPad: 0
        }
      ),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'player-dash',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'little-knight-run-',
          suffix: '',
          start: 0,
          end: 5,
          zeroPad: 0
        }
      ),
      frameRate: 5,
      repeat: -1
    });

    /* Movesets (player & enemies) */

    this.anims.create({
      key: 'slash-effect',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'slash-effect-',
          suffix: '',
          start: 0,
          end: 2,
          zeroPad: 0
        }
      ),
      duration: 300,
      repeat: 0
    });

    this.anims.create({
      key: 'arrow-break',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'arrow-break-',
          suffix: '',
          start: 0,
          end: 1,
          zeroPad: 0
        }
      ),
      repeat: 0,
      duration: 150
    });

    this.anims.create({
      key: 'fireball-simple',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'fireball-simple-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'fireball-simple-explosion',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'fireball-simple-explosion-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 8,
      repeat: 0
    });

    /* Enemies */

    this.anims.create({
      key: 'demon-big-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'demon-big-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'demon-big-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'demon-big-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'demon-split-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'demon-split-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'demon-split-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'demon-split-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'demon-bounce-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'demon-bounce-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'demon-bounce-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'demon-bounce-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'orc-mask-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'orc-mask-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'orc-mask-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'orc-mask-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'orc-simple-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'orc-simple-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'orc-simple-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'orc-simple-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'orc-tattoo-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'orc-tattoo-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'orc-tattoo-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'orc-tattoo-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'orc-big-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'orc-big-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'orc-big-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'orc-big-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'ice-sad',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'ice-sad-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'ice-mask-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'ice-mask-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'ice-mask-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'ice-mask-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'ice-lizard-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'ice-lizard-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'ice-lizard-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'ice-lizard-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'undead-simple-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'undead-simple-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'undead-simple-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'undead-simple-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'rot',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'rot-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'leaf-sad',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'leaf-sad-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'leaf-big-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'leaf-big-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'leaf-big-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'leaf-big-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'mage',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'mage-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'boss-01-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'boss-01-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'boss-01-run',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'boss-01-run-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'sword-boss-01',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'sword-boss-01-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 5,
      repeat: -1
    });

    /* Chest */
    this.anims.create({
      key: 'chest',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'chest-',
          suffix: '',
          start: 0,
          end: 2,
          zeroPad: 0
        }
      ),
      frameRate: 10,
      repeat: 0
    });

    /* Smokes */
    this.anims.create({
      key: 'smoke-small',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'smoke-small-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'smoke-big',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'smoke-big-',
          suffix: '',
          start: 1,
          end: 4,
          zeroPad: 0
        }
      ),
      frameRate: 10,
      repeat: 0
    });

    /* NPCs */
    this.anims.create({
      key: 'paladin-agony',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'paladin-agony-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 3,
      repeat: -1
    });

    this.anims.create({
      key: 'sister-idle',
      frames: this.anims.generateFrameNames(
        'atlas', {
          prefix: 'sister-idle-',
          suffix: '',
          start: 0,
          end: 3,
          zeroPad: 0
        }
      ),
      frameRate: 3,
      repeat: -1
    });
  }
}
