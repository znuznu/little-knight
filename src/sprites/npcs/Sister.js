import NonPlayableCharacter from './NonPlayableCharacter.js';

export default class Sister extends NonPlayableCharacter {
    constructor(config) {
      super(config);
      this.body.setSize(320, 320);
      this.body.setOffset(-128, -128);
      this.dialog = 'Little brother...\nYou came here to save me ? What a chad !';
      this.setFlipX(true);
      this.play('sister-idle', true);
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
          this.scene.events.emit('sister-saved');
          this.dialogDisplayed.destroy();
          this.isSpeaking = false;
        });
      }
    }
}
