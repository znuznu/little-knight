import Enemy from '../Enemy.js';

export default class IceMask extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(20, 15);
    this.body.setOffset(10, 20);
    this.health = 3;
    this.meleeDamage = 2;
    this.speed = 150;

    this.animationState = {
      'idle': 'ice-mask-idle',
      'chase': 'ice-mask-run',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
