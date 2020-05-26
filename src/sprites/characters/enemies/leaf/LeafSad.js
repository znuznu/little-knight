import Enemy from '../Enemy.js';

export default class LeafSad extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(18, 16);
    this.body.setOffset(6, 15);
    this.health = 1;
    this.meleeDamage = 1;
    this.speed = 160;

    this.animationState = {
      'idle': 'leaf-sad',
      'chase': 'leaf-sad',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
