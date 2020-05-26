import Character from './Character.js';
import StateMachine from '../../states/StateMachine.js';
import PlayerIdleState from '../../states/player/PlayerIdleState.js';
import PlayerRunState from '../../states/player/PlayerRunState.js';
import PlayerDashState from '../../states/player/PlayerDashState.js';
import PlayerNormalState from '../../states/player/PlayerNormalState.js';
import PlayerHurtState from '../../states/player/PlayerHurtState.js';
import PlayerSlashState from '../../states/player/PlayerSlashState.js';
import PlayerShootState from '../../states/player/PlayerShootState.js';
import PlayerDeadState from '../../states/player/PlayerDeadState.js';
import eventsManager from '../../scenes/EventsManager.js';

export default class Player extends Character {
  constructor(config, health, weapons, inventory) {
    super(config);
    this.body.setSize(15, 15);
    this.body.setOffset(5, 15);

    this.aimDirection = {
      up: 'up',
      down: 'down',
      right: 'right',
      left: 'left'
    };
    this.speed = 150;

    // General (frame dependant) time counter.
    this.timeAlive = 0;

    // Delta time since the last shot with the bow.
    this.lastShot = 0;

    this.dashDuration = 300;

    this.setData({
      'weapons': weapons,
      'inventory': inventory
    });
    this.setDepth(3);

    // A complete heart is 2 points, so 6 is 3 hearts.
    this.maximumHealth = 6;
    this.health = health;

    this.animationState = {
      'idle': 'player-idle',
      'run': 'player-run',
      'dash': 'player-dash',
      'slash': undefined,
      'shoot': undefined
    };

    this.actionStateMachine = new StateMachine('idle', {
      idle: new PlayerIdleState(),
      run: new PlayerRunState(),
      dash: new PlayerDashState(),
      slash: new PlayerSlashState(),
      shoot: new PlayerShootState()
    }, [this.scene, this]);

    this.healthStateMachine = new StateMachine('normal', {
      normal: new PlayerNormalState(),
      hurt: new PlayerHurtState(),
      dead: new PlayerDeadState()
    }, [this.scene, this]);

    this.healthStateMachine.update();
  }

  /* I dont like doing the step manually here. */
  hurt(enemy) {
    if (this.healthStateMachine.state == 'normal')
      this.healthStateMachine.transition('hurt', enemy);
  }

  nextWeapon() {
    let weapons = this.getData('weapons');
    let current = weapons.shift();

    if (!current) return;

    this.getData('weapons').push(current);

    // The crosshair is based on the weapon.
    if (this.getCurrentWeapon() == 'bow') {
      this.scene.crosshair.setFrame('crosshair-bow');
    } else {
      this.scene.crosshair.setFrame('crosshair-simple');
    }

    eventsManager.emit('update-weapons', this.getData('weapons'));
  }

  getCurrentWeapon() {
    return this.getData('weapons')[0];
  }

  grab(item) {
    switch (item) {
      case 'bow':
      case 'sword':
        this.scene.player.getData('weapons').push(item);
        this.scene.player.nextWeapon();
        break;
      case 'key-simple':
      case 'key-boss':
        this.storeInInventory(item);
        break;
      case 'potion-heal':
        this.drink(item);
        break;
    }
  }

  storeInInventory(item) {
    if (this.getData('inventory')[item]) {
      this.getData('inventory')[item] += 1;
    } else {
      this.getData('inventory')[item] = 1;
    }

    switch (item) {
      case 'key-simple':
        eventsManager.emit('update-keys', this.getData('inventory')['key-simple']);
        break;
      case 'key-boss':
        eventsManager.emit('update-key-boss', this.getData('inventory')['key-boss']);
        break;
    }
  }

  drink(item) {
    switch (item) {
      case 'potion-heal':
        this.health += 2;
        eventsManager.emit('update-health', this.health);
        break;
    }
  }

  updateView() {
    // Cool effect if the player look in the dash direction.
    if (this.actionStateMachine.state == 'dash') return;

    if (this.scene.crosshair.x > this.x) {
      this.view = 'right';
    } else {
      this.view = 'left';
    }
  }

  update(time, delta) {
    this.timeAlive += delta;
    this.lastShot += delta;
    this.updateView();
    this.actionStateMachine.update();
    this.updateAnimation();

    if (Phaser.Input.Keyboard.JustDown(this.scene.keys.shift)) {
      this.nextWeapon();
    }
  }
}
