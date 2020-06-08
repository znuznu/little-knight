/*
 * Explosion caused (for example) by bomb.
 */

export default class Explosion extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'smoke-big-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(6);
    this.damage = 4;
  }

  use(x, y) {
    this.body.checkCollision.none = false;
    this.setPosition(x, y);
    this.setVisible(true);
    this.setActive(true);

    let tiles = this.scene.map.getTilesWithinWorldXY(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height,
      undefined,
      this.scene.cameras.main,
      this.scene.blocks
    );

    tiles.forEach(tile => {
      if (tile.index == 84) {
        this.scene.map.removeTileAt(
          tile.x,
          tile.y - 1,
          false,
          false,
          this.scene.above
        );

        this.scene.map.removeTile(tile);

        let smokeSmall = this.scene.smokeSmallGroup.get();

        if (smokeSmall) {
          let x = (tile.x + 1) * 32 - 16;
          let y = (tile.y + 1) * 32 - 16;
          smokeSmall.use(x, y);
        }
      }
    });

    this.scene.sound.playAudioSprite('sounds', 'explosion_1');
    this.play('explosion', true);
    this.on('animationcomplete', _ => {
      this.hide();
    }, this);
  }

  hide() {
    this.body.checkCollision.none = true;
    this.setVisible(false);
    this.setActive(false);
  }
}
