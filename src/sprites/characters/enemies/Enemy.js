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
    // Some enemies could do more than 1 hp, (whole number only).
    this.meleeDamage = 1;

    this.knockback = 100;

    // Some enemies might be invulnerable against arrow.
    this.arrowProof = false;

    // Loots from this enemy with the rate (%).
    this.loots = [
      {name: 'potion-red-small', rate: 10}
    ];

    // The tile chased at the moment.
    this.tileChased = undefined;

    // Aggro exclamation.
    this.aggroIcon = this.scene.add.bitmapText(
      this.x, this.y - 32, 'bitty', '!', 32
    ).setOrigin(0.5, 0.5);
    this.aggroIcon.setDepth(12);
    this.aggroIcon.setAlpha(0);

    // Default state machine for enemies, they simply chase
    // the player when he's at range and might be hurt/die.
    this.actionStateMachine = new StateMachine('idle', {
        idle: new EnemyIdleState(),
        chase: new EnemyChaseState(),
        hurt: new EnemyHurtState(),
        dead: new EnemyDeadState()
      }, [config.scene, this]);
  }

  // Attack from the enemy to the player.
  meleeAttack(player) {
    player.hurt(this.meleeDamage);
  }

  // Attack taken from an enemy with a melee weapon of the player.
  meleeAttackTaken(damage) {
    this.hurt(damage);
  }

  // Damage caused by a bomb.
  bombDamageTaken(damage) {
    this.hurt(damage);
  }

  // Attack taken from an enemy with an arrow of the player.
  arrowAttackTaken(damage) {
    if (!this.arrowProof)
      this.hurt(damage);
  }

  // Take damage.
  hurt(damageTaken) {
    if (this.actionStateMachine.state != 'hurt') {
      this.health -= damageTaken;
      this.actionStateMachine.transition('hurt');
    }
  }

  // Called everytime an enemy dies.
  loot() {
    this.loots.forEach(item => {
      let rng = ~~(Math.random() * ~~(100)) + 1;
      if (rng <= item.rate) {
        let i;
        switch (item.name) {
          case 'potion-red-small':
            i = this.scene.potionHealSmallGroup.get();
            break;
        }

        if (i) {
          i.appear(this.x, this.y);
        }
      }
    });
  }

  // Whether this Enemy is colliding with a wall.
  isTouching() {
    let up = this.body.onCeiling();
    let down = this.body.onFloor();
    let side = this.body.onWall();

    return up || down || side;
  }

  chaseTarget() {
    let ownTile = this.tileOn;

    let targetTile = this.target.tileOn;

    if (ownTile === targetTile) {
      this.scene.physics.moveToObject(this, this.target, this.speed);
      return;
    }

    // Process A* if the target tile has changed.
    if (this.tileChased !== targetTile) {
      let aStarResult = this.scene.aStar.search(
        {r: ownTile.y, c: ownTile.x},
        {r: targetTile.y, c: targetTile.x},
      );

      this.tileChased = undefined;
      this.tilePath = [];

      if (aStarResult.status === 'Found') {
        this.tileChased = targetTile;
        aStarResult.path.forEach(node => {
          let nodeTile = this.scene.map.getLayer('walkable').data[node.r][node.c];
          this.tilePath.push(nodeTile);

          // Uncomment to show the path.
          /*
          nodeTile.tint = 0xfec9ff;
          this.scene.time.delayedCall(100, _ => {
            nodeTile.tint = 0xffffff;
          });
          */
        });
      } else {
        this.tileChased = undefined;
        this.tilePath = [];
        return;
      }
    }

    // Small hack to avoid problems with moveTo().
    let tileCenterX = this.tilePath[0].getCenterX() - this.body.offset.x / 2;
    let tileCenterY = this.tilePath[0].getCenterY() - this.body.offset.y / 2;
    let bodyCenterX = this.x;
    let bodyCenterY = this.y;

    let distance = Phaser.Math.Distance.Between(
      tileCenterX, tileCenterY,
      bodyCenterX, bodyCenterY
    );

    if (distance <= 4) {
      this.tilePath.shift();
    }

    let nextTile = this.tilePath[0];

    this.scene.physics.moveTo(
      this,
      nextTile.getCenterX() - this.body.offset.x / 2,
      nextTile.getCenterY() - this.body.offset.y / 2,
      this.speed
    );
  }

  // Update enemy depth to appear in front or behind the player.
  updateDepth() {
    if (this.y > this.target.y) {
      this.setDepth(this.target.depth + 1);
    } else {
      this.setDepth(this.target.depth - 1);
    }
  }

  update() {
    super.update();
    this.aggroIcon.setPosition(this.x, this.y - 32);
    this.updateDepth();
  }
}
