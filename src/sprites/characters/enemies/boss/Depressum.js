import Enemy from '../Enemy.js';
import StateMachine from '../../../../states/StateMachine.js';
import DepressumIdleState from '../../../../states/enemies/boss/DepressumIdleState.js';
import DepressumTeleportState from '../../../../states/enemies/boss/DepressumTeleportState.js';
import DepressumCastFireballsState from '../../../../states/enemies/boss/DepressumCastFireballsState.js';
import DepressumNormalState from '../../../../states/enemies/boss/DepressumNormalState.js';
import DepressumHurtState from '../../../../states/enemies/boss/DepressumHurtState.js';
import DepressumDeadState from '../../../../states/enemies/boss/DepressumDeadState.js';
import DepressumWaitState from '../../../../states/enemies/boss/DepressumWaitState.js';
import EnemyHurtState from '../../../../states/enemies/EnemyHurtState.js';
import EnemyDeadState from '../../../../states/enemies/EnemyDeadState.js';

export default class Depressum extends Enemy {
  constructor(config) {
    super(config);
    this.body.setSize(36, 26);
    this.body.setOffset(15, 40);
    this.maximumHealth = 20;
    this.health = 20;
    this.meleeDamage = 3;
    this.speed = 100;
    this.aggroRadius = 3200;
    this.pursuitSword = undefined;

    // Tiles to open after the death of this boss.
    this.areaGuarded = {
      topLeft: {x: 38, y: 14},
      size: {w: 1, h: 5}
    };

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
      normal: new DepressumNormalState(),
      hurt: new DepressumHurtState(),
      dead: new DepressumDeadState()
    }, [config.scene, this]);

    this.healthStateMachine.update();

    this.actionStateMachine = new StateMachine('wait', {
      wait: new DepressumWaitState(),
      idle: new DepressumIdleState(),
      teleport: new DepressumTeleportState(),
      cast: new DepressumCastFireballsState()
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
   * Teleport the boss to a random position.
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
    this.pursuitSword = this.scene.pursuitSwordGroup.get();
    if (this.pursuitSword) {
      this.hasSword = false;
      this.pursuitSword.throw(this, this.target);
    }
  }

  takeBack(sword) {
    this.hasSword = true;
    sword.body.checkCollision.none = true;
    sword.setVisible(false);
    sword.setActive(false);
  }
}
