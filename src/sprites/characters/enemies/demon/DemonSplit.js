import Enemy from '../Enemy.js';

export default class DemonSplit extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(20, 15);
    this.body.setOffset(5, 28);
    this.health = 2;
    this.meleeDamage = 1;
    this.speed = 100;

    this.animationState = {
      'idle': 'demon-split-idle',
      'chase': 'demon-split-run',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
