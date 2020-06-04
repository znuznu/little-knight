export default class Chest extends Phaser.GameObjects.Sprite {
  constructor(config, treasure) {
    super(config.scene, config.x, config.y, 'atlas', 'chest-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(0);

    // Not really pretty but okay for this project.
    this.itemsToFrame = {
      'bow': 'bow',
      'sword': 'sword',
      'bomb': 'bomb-0',
      'key-simple': 'key-simple',
      'key-boss': 'key-boss',
      'potion-heal': 'potion-red-0'
    };

    this.treasure = treasure;
    this.isOpen = false;
    this.body.setImmovable(true);

    this.scene.physics.add.collider(
      this,
      this.scene.player,
      this.open,
      null,
      this
    );

    this.scene.physics.add.collider(this.scene.enemyGroup, this);
  }

  open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.play('chest');

    this.on('animationcomplete', _ => {
      switch (this.treasure) {
        case 'sword':
        case 'bow':
        case 'bomb':
          this.scene.sound.playAudioSprite('sounds', 'chest_weapon');
          break;
        default:
          this.scene.sound.playAudioSprite('sounds', 'chest_default');
          break;
      }

      let item = this.scene.physics.add.sprite(
        this.x,
        this.y - 16,
        'atlas',
        this.itemsToFrame[this.treasure]
      );

      item.setDepth(3);

      this.scene.tweens.add({
        targets: item,
        alpha: 0,
        ease: 'Cubic.easeOut',
        duration: 3000,
        repeat: 0
      });

      this.scene.player.grab(this.treasure);
      this.treasure = null;
    }, this);

  }
}
