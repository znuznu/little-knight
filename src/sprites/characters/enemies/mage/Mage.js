import Enemy from '../Enemy.js';
import StateMachine from '../../../../states/StateMachine.js';
import MageIdleState from '../../../../states/enemies/mage/MageIdleState.js';
import MageCastFireballState from '../../../../states/enemies/mage/MageCastFireballState.js';
import EnemyHurtState from '../../../../states/enemies/EnemyHurtState.js';
import EnemyDeadState from '../../../../states/enemies/EnemyDeadState.js';

export default class Mage extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(20, 14);
    this.body.setOffset(5, 20);
    this.health = 2;
    this.meleeDamage = 1;
    this.speed = 50;
    this.aggroRadius = 352;
    this.castLoadDuration = 2000;

    this.actionStateMachine = new StateMachine('idle', {
        idle: new MageIdleState(),
        castFireball: new MageCastFireballState(),
        hurt: new EnemyHurtState(),
        dead: new EnemyDeadState()
      }, [config.scene, this]);

    this.animationState = {
      'idle': 'mage',
      'castFireball': 'mage',
      'hurt': undefined,
      'dead': 'smoke-small'
    };
  }
}
