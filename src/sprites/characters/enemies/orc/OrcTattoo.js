import Enemy from '../Enemy.js';

export default class OrcTattoo extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(19, 15);
    this.body.setOffset(7, 16);
    this.health = 3;
    this.meleeDamage = 1;
    this.speed = 180;

    this.animationState = {
      'idle': 'orc-tattoo-idle',
      'chase': 'orc-tattoo-run',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
