import Enemy from '../Enemy.js';

export default class DemonBounce extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(20, 20);
    this.body.setOffset(5, 14);
    this.health = 2;
    this.meleeDamage = 1;
    this.speed = 150;

    this.animationState = {
      'idle': 'demon-bounce-idle',
      'chase': 'demon-bounce-run',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
