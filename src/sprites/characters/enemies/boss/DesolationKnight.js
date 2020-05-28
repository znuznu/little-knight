import Enemy from '../Enemy.js';
import StateMachine from '../../../../states/StateMachine.js';
import DesolationKnightIdleState from '../../../../states/enemies/boss/DesolationKnightIdleState.js';
import DesolationKnightTeleportState from '../../../../states/enemies/boss/DesolationKnightTeleportState.js';
import DesolationKnightCastFireballsState from '../../../../states/enemies/boss/DesolationKnightCastFireballsState.js';
import DesolationKnightNormalState from '../../../../states/enemies/boss/DesolationKnightNormalState.js';
import DesolationKnightHurtState from '../../../../states/enemies/boss/DesolationKnightHurtState.js';
import DesolationKnightDeadState from '../../../../states/enemies/boss/DesolationKnightDeadState.js';
import DesolationKnightWaitState from '../../../../states/enemies/boss/DesolationKnightWaitState.js';
import EnemyHurtState from '../../../../states/enemies/EnemyHurtState.js';
import EnemyDeadState from '../../../../states/enemies/EnemyDeadState.js';

export default class DesolationKnight extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(36, 26);
    this.body.setOffset(15, 40);
    this.maximumHealth = 20;
    this.health = 20;
    this.meleeDamage = 3;
    this.speed = 100;
    this.aggroRadius = 3200;

    // Sword throw at the player.
    this.hasSword = true;

    // Cannot be damaged by arrow (phase 1).
    this.arrowProof = true;

    this.body.setImmovable(true);
    this.teleportationTiles = [
      {x: 25, y:  6}, {x: 19, y: 11}, {x: 25, y: 10},
      {x: 31, y: 11}, {x: 14, y: 17}, {x: 19, y: 17},
      {x: 31, y: 17}, {x: 36, y: 17}, {x: 19, y: 23},
      {x: 25, y: 23}, {x: 31, y: 23}, {x: 25, y: 28}
    ];

    this.healthStateMachine = new StateMachine('normal', {
      normal: new DesolationKnightNormalState(),
      hurt: new DesolationKnightHurtState(),
      dead: new DesolationKnightDeadState()
    }, [config.scene, this]);

    this.healthStateMachine.update();

    this.actionStateMachine = new StateMachine('wait', {
      wait: new DesolationKnightWaitState(),
      idle: new DesolationKnightIdleState(),
      teleport: new DesolationKnightTeleportState(),
      cast: new DesolationKnightCastFireballsState()
    }, [config.scene, this]);

    this.animationState = {
      'wait': 'boss-01-idle',
      'idle': 'boss-01-idle',
      'cast': 'boss-01-idle',
      'teleport': 'boss-01-idle',
      'hurt': undefined,
      'dead': 'smoke-big'
    };

    this.scene.physics.add.overlap(
      this,
      this.scene.pursuitSwordGroup,
      (dk, s) => {
        if (s.charge <= 0)
          this.takeBack(s);
      },
      null,
      this.scene
    );
  }

  /*
   * Teleport the Desolation Knight to a random position.
   * The positions are part of a set of 8 positions.
   */
  teleport() {
    let randIndex = ~~(Math.random() * ~~(this.teleportationTiles.length));
    let randTile = this.teleportationTiles[randIndex];
    this.setX((randTile.x - 1) * 32);
    this.setY((randTile.y - 1) * 32);
  }

  hurt(damage) {
    if (this.healthStateMachine.state === 'normal') {
      this.healthStateMachine.transition('hurt', damage);
    }
  }

  throwPursuitSword() {
    let pursuitSword = this.scene.pursuitSwordGroup.get();
    if (pursuitSword) {
      pursuitSword.setVisible(true);
      pursuitSword.setActive(true);
      pursuitSword.body.checkCollision.none = false;
      pursuitSword.master = this;
      pursuitSword.x = this.x + 16;
      pursuitSword.y = this.y + 16;
      pursuitSword.charge = 3;
      pursuitSword.chase(this.target);
      this.hasSword = false;
    }
  }

  takeBack(sword) {
    this.hasSword = true;
    sword.body.checkCollision.none = true;
    sword.setVisible(false);
    sword.setActive(false);
  }
}
