import Enemy from '../Enemy.js';

export default class Mage extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(20, 14);
    this.body.setOffset(5, 20);
    this.health = 2;
    this.meleeDamage = 1;
    this.speed = 50;

    this.animationState = {
      'idle': 'mage',
      'chase': 'mage',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
