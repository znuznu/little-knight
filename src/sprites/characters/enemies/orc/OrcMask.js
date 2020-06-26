import Enemy from '../Enemy.js';
import StateMachine from '../../../../states/StateMachine.js';
import EnemyIdleState from '../../../../states/enemies/EnemyIdleState.js';
import EnemyChaseState from '../../../../states/enemies/EnemyChaseState.js';
import EnemyHurtState from '../../../../states/enemies/EnemyHurtState.js';
import EnemyDeadState from '../../../../states/enemies/EnemyDeadState.js';
import MaskTeleportState from '../../../../states/enemies/mask/MaskTeleportState.js';
import MaskChaseState from '../../../../states/enemies/mask/MaskChaseState.js';

export default class OrcMask extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(19, 21);
    this.body.setOffset(7, 16);
    this.health = 1;
    this.meleeDamage = 1;
    this.speed = 100;

    this.actionStateMachine = new StateMachine('idle', {
        idle: new EnemyIdleState(),
        hurt: new EnemyHurtState(),
        dead: new EnemyDeadState(),
        chase: new MaskChaseState(),
        teleport: new MaskTeleportState(),
      }, [config.scene, this]);

    this.animationState = {
      'idle': 'orc-mask-idle',
      'chase': 'orc-mask-run',
      'hurt': undefined,
      'dead': 'smoke-small',
      'teleport': 'orc-mask-idle'
    };
  }

  teleport(tile) {
    this.setPosition(tile.pixelX + 16, tile.pixelY + 16);
  }
}
