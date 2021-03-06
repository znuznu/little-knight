import Enemy from '../Enemy.js';

export default class OrcSimple extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(19, 20);
    this.body.setOffset(7, 16);
    this.health = 3;
    this.meleeDamage = 1;
    this.speed = 180;

    this.animationState = {
      'idle': 'orc-simple-idle',
      'chase': 'orc-simple-run',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
