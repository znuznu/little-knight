import HUDEventsManager from '../../events/HUDEventsManager.js';

export default class Door extends Phaser.GameObjects.Sprite {
  constructor(config, type) {
    super(config.scene, config.x, config.y, 'atlas', 'door-' + type + '-closed');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(0);
    this.type = type;

    this.isOpen = false;
    this.body.setImmovable(true);

    this.playerCollider = this.scene.physics.add.collider(
      this,
      this.scene.player,
      this.open,
      null,
      this
    );

    this.enemyCollider = this.scene.physics.add.collider(
      this.scene.enemyGroup,
      this
    );
  }

  open() {
    if (this.isOpen) return;
    let keyType = 'key-' + this.type;

    if (this.scene.player.getData('inventory')[keyType] > 0) {
      this.scene.sound.playAudioSprite('sounds', 'door_open_1');
      this.scene.player.getData('inventory')[keyType] -= 1;
      this.isOpen = true;
      this.setFrame('door-' + this.type + '-open');
      this.removeColliders();
      this.setDepth(this.scene.player.depth + 1);

      let type = t => {
        if (t == 'simple')
         return 'update-keys';
        else
          return 'update-key-boss';
      }

      HUDEventsManager.emit(
        type(this.type),
        this.scene.player.getData('inventory')[keyType]
      );
    }
  }

  removeColliders() {
    this.scene.physics.world.removeCollider(this.playerCollider);
    this.scene.physics.world.removeCollider(this.enemyCollider);
  }

  // Funny code. Doors shouldn't be Sprite but it's easier.
  update() {
    if (this.y > this.scene.player.y) {
      this.setDepth(this.scene.player.depth + 1);
    } else {
      this.setDepth(this.scene.player.depth - 1);
    }
  }
}
