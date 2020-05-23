import Enemy from '../Enemy.js';

export default class Lizard extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(20, 15);
    this.body.setOffset(5, 28);
    this.health = 3;
    this.meleeDamage = 2;
    this.speed = 120;

    this.animationState = {
      'idle': 'ice-lizard-idle',
      'chase': 'ice-lizard-run',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
