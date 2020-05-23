import Enemy from '../Enemy.js';

export default class IceSad extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(18, 16);
    this.body.setOffset(6, 15);
    this.health = 1;
    this.meleeDamage = 1;
    this.speed = 200;

    this.animationState = {
      'idle': 'ice-sad',
      'chase': 'ice-sad',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
