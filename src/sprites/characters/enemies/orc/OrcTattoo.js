import Enemy from '../Enemy.js';
import StateMachine from '../../../../states/StateMachine.js';
import EnemyIdleState from '../../../../states/enemies/EnemyIdleState.js';
import EnemyChaseState from '../../../../states/enemies/EnemyChaseState.js';
import EnemyHurtState from '../../../../states/enemies/EnemyHurtState.js';
import EnemyDeadState from '../../../../states/enemies/EnemyDeadState.js';
import OrcTattooChaseState from '../../../../states/enemies/orc/OrcTattoo/OrcTattooChaseState.js';
import OrcTattooKnifeState from '../../../../states/enemies/orc/OrcTattoo/OrcTattooKnifeState.js';

export default class OrcTattoo extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(19, 15);
    this.body.setOffset(7, 16);
    this.health = 3;
    this.meleeDamage = 1;
    this.speed = 100;
    this.lastKnivesThrown = 0;

    this.actionStateMachine = new StateMachine('idle', {
        idle: new EnemyIdleState(),
        chase: new OrcTattooChaseState(),
        hurt: new EnemyHurtState(),
        dead: new EnemyDeadState(),
        knife: new OrcTattooKnifeState(),
      }, [config.scene, this]);

    this.animationState = {
      'idle': 'orc-tattoo-idle',
      'chase': 'orc-tattoo-run',
      'hurt': undefined,
      'dead': 'smoke-small',
      'knife': undefined
    };
  }
}
