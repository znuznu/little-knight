import Enemy from '../Enemy.js';

export default class UndeadSimple extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(19, 15);
    this.body.setOffset(7, 16);
    this.health = 1;
    this.meleeDamage = 1;
    this.speed = 100;

    this.animationState = {
      'idle': 'undead-simple-idle',
      'chase': 'undead-simple-run',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
