import Enemy from '../Enemy.js';
import StateMachine from '../../../../states/StateMachine.js';
import EnemyIdleState from '../../../../states/enemies/EnemyIdleState.js';
import EnemyDeadState from '../../../../states/enemies/EnemyDeadState.js';
import EnemyHurtState from '../../../../states/enemies/EnemyHurtState.js';
import LizardChaseState from '../../../../states/enemies/ice/Lizard/LizardChaseState.js';
import LizardBoomerangState from '../../../../states/enemies/ice/Lizard/LizardBoomerangState.js';
import LizardDeadState from '../../../../states/enemies/ice/Lizard/LizardDeadState.js';

export default class Lizard extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(20, 15);
    this.body.setOffset(5, 28);
    this.health = 3;
    this.meleeDamage = 2;
    this.speed = 120;
    this.hasBoomerang = true;
    this.boomerang = undefined;

    this.actionStateMachine = new StateMachine('idle', {
        idle: new EnemyIdleState(),
        hurt: new EnemyHurtState(),
        dead: new LizardDeadState(),
        chase: new LizardChaseState(),
        boomerang: new LizardBoomerangState(),
      }, [config.scene, this]);

    this.animationState = {
      'idle': 'ice-lizard-idle',
      'chase': 'ice-lizard-run',
      'hurt': undefined,
      'dead': 'smoke-small',
      'boomerang': 'ice-lizard-idle'
    };
  }

  throwBoomerang() {
    let boomerang = this.scene.boomerangsGroup.get();
    if (boomerang) {
      this.boomerang = boomerang;
      this.hasBoomerang = false;
      boomerang.setOwner(this);
      boomerang.throw(
        this.x, this.y,
        this.target.body.center.x, this.target.body.center.y
      );
    }
  }
}
