import Character from '../Character.js';
import StateMachine from '../../../states/StateMachine.js';
import EnemyIdleState from '../../../states/enemies/EnemyIdleState.js';
import EnemyChaseState from '../../../states/enemies/EnemyChaseState.js';
import EnemyHurtState from '../../../states/enemies/EnemyHurtState.js';
import EnemyDeadState from '../../../states/enemies/EnemyDeadState.js';

export default class Enemy extends Character {
  constructor(config) {
    super(config);
    config.scene.physics.world.enable(this);
    config.scene.add.existing(this);

    // Default character to chase.
    // We could imagine enemies chasing other enemies.
    this.target = config.scene.player;

    // Default distance in pixels.
    this.aggroRadius = 160;

    // Default enemy collision damage with the player.
    // Some enemies could do more or less than 1 hp, (whole number only).
    this.meleeDamage = 1;

    this.actionStateMachine = new StateMachine('idle', {
        idle: new EnemyIdleState(),
        chase: new EnemyChaseState(),
        hurt: new EnemyHurtState(),
        dead: new EnemyDeadState()
      }, [config.scene, this]);
  }

  // Attack from the enemy to the player.
  meleeAttack(player) {
    player.hurt(this);
  }

  // Attack taken from an enemy with a melee weapon of the player.
  meleeAttackTaken(damage) {
    this.hurt(damage);
  }

  // Attack taken from an enemy with an arrow of the player.
  arrowAttackTaken(damage) {
    this.hurt(damage);
  }

  // Take damage.
  hurt(damageTaken) {
    if (this.actionStateMachine.state != 'hurt') {
      this.health -= damageTaken;
      this.actionStateMachine.transition('hurt');
    }
  }

  /* Update enemy depth to appear in front or behind the player. */
  updateDepth() {
    if (this.y > this.target.y) {
      this.setDepth(this.target.depth + 1);
    } else {
      this.setDepth(this.target.depth - 1);
    }
  }
}
