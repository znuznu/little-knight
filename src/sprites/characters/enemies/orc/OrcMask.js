import Enemy from '../Enemy.js';

export default class OrcMask extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(19, 15);
    this.body.setOffset(7, 16);
    this.health = 5;
    this.meleeDamage = 1;
    this.speed = 200;

    this.animationState = {
      'idle': 'orc-mask-idle',
      'chase': 'orc-mask-run',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
