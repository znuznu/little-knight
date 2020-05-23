import Enemy from '../Enemy.js';

export default class OrcBig extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(36, 26);
    this.body.setOffset(15, 40);
    this.health = 10;
    this.meleeDamage = 3;
    this.speed = 100;

    this.animationState = {
      'idle': 'orc-big-idle',
      'chase': 'orc-big-run',
      'hurt': undefined,
      'dead': 'smoke-big'
    };
  }
}
