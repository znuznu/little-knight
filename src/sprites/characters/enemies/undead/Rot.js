import Enemy from '../Enemy.js';

export default class Rot extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(18, 16);
    this.body.setOffset(6, 15);
    this.health = 1;
    this.meleeDamage = 1;
    this.speed = 50;
    this.aggroRadius = 80;

    this.animationState = {
      'idle': 'rot',
      'chase': 'rot',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
