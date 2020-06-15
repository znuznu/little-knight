/**
 * Abstract class.
 *
 * Not the good way to handle dialogs, but okay for this project.
 */
export default class NonPlayableCharacter extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    this.isSpeaking = false;
    this.dialog = 'Default dialog.';

    config.scene.physics.add.overlap(
      this,
      this.scene.player,
      this.speak,
      undefined,
      this
    );
  }

  speak() {
    if (!this.isSpeaking) {
      this.isSpeaking = true;
      this.dialogDisplayed = this.scene.add.bitmapText(
        this.x, this.y + this.height * 2, 'bitty', this.dialog, 32
      ).setCenterAlign();

      this.dialogDisplayed.setDepth(12);
      this.dialogDisplayed.setOrigin(0.5, 0.5);

      this.scene.time.delayedCall(3000, _ => {
        this.dialogDisplayed.destroy();
        this.isSpeaking = false;
      });
    }
  }

  update() {
    if (this.y > this.scene.player.y) {
      this.setDepth(this.scene.player.depth + 1);
    } else {
      this.setDepth(this.scene.player.depth - 1);
    }
  }
}
