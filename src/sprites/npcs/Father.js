import NonPlayableCharacter from './NonPlayableCharacter.js';

export default class Father extends NonPlayableCharacter {
    constructor(config) {
      super(config);
      this.body.setSize(40, 80);
      this.body.setOffset(0, 20);
      this.dialog = 'Son, I\'m dying... He kidnapped your sister...\nHe took her bow and my sword...\nFind them and save her... Be careful...';
      this.play('paladin-agony', true);
    }
}
