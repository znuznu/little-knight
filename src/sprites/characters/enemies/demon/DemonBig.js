import Enemy from '../Enemy.js';

export default class DemonBig extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(36, 26);
    this.body.setOffset(15, 40);
    this.health = 8;
    this.meleeDamage = 3;
    this.speed = 100;

    this.animationState = {
      'idle': 'demon-big-idle',
      'chase': 'demon-big-run',
      'hurt': undefined,
      'dead': 'smoke-big'
    };
  }
}
