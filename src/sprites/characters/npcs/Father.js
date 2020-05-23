import Character from '../Character.js';

export default class Father extends Character {
    constructor(config) {
      super(config);
      this.body.setSize(40, 40);
      this.body.setOffset(0, 20);
      this.play('paladin-agony', true);
    }
}
