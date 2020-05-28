import Character from '../sprites/characters/Character.js';
import Father from '../sprites/characters/npcs/Father.js';
import Player from '../sprites/characters/Player.js';
import Enemy from '../sprites/characters/enemies/Enemy.js';
import Lizard from '../sprites/characters/enemies/ice/Lizard.js';
import IceSad from '../sprites/characters/enemies/ice/IceSad.js';
import IceMask from '../sprites/characters/enemies/ice/IceMask.js';
import DemonBig from '../sprites/characters/enemies/demon/DemonBig.js';
import DemonBounce from '../sprites/characters/enemies/demon/DemonBounce.js';
import DemonSplit from '../sprites/characters/enemies/demon/DemonSplit.js';
import LeafSad from '../sprites/characters/enemies/leaf/LeafSad.js';
import LeafBig from '../sprites/characters/enemies/leaf/LeafBig.js';
import Rot from '../sprites/characters/enemies/undead/Rot.js';
import UndeadSimple from '../sprites/characters/enemies/undead/UndeadSimple.js';
import OrcSimple from '../sprites/characters/enemies/orc/OrcSimple.js';
import OrcMask from '../sprites/characters/enemies/orc/OrcMask.js';
import OrcBig from '../sprites/characters/enemies/orc/OrcBig.js';
import OrcTattoo from '../sprites/characters/enemies/orc/OrcTattoo.js';
import Mage from '../sprites/characters/enemies/mage/Mage.js';
import DesolationKnight from '../sprites/characters/enemies/boss/DesolationKnight.js';
import PlayerArrow from '../sprites/movesets/player/PlayerArrow.js';
import FireballSimple from '../sprites/movesets/enemies/FireballSimple.js';
import FireballArcanic from '../sprites/movesets/enemies/FireballArcanic.js';
import PursuitSword from '../sprites/movesets/enemies/PursuitSword.js';
import Chest from '../sprites/misc/Chest.js';
import Door from '../sprites/misc/Door.js';
import HUDEventsManager from '../events/HUDEventsManager.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('gameScene');
  }

  init(data) {
    this.createMap(data.level, data.floor);
    let player = data.player;

    if (player) {
      this.createPlayer(player.health, player.weapons, player.inventory);
    } else {
      this.scene.run('hudScene');
      this.scene.run('bossHudScene');
      this.createPlayer(6, [], {});
    }

    this.saveState(data.level, data.floor, this.player);

    // Clear the HUD in case we're restarting the level after a death.
    HUDEventsManager.emit('update-weapons', this.player.getData('weapons'));
    HUDEventsManager.emit('update-health', this.player.health);

    // There's never a key to take from a level to another.
    HUDEventsManager.emit('update-keys', 0);
    HUDEventsManager.emit('update-key-boss', 0);
  }

  create() {
    this.cameras.main.fadeIn(1000);
    this.createKeys();
    this.createCrosshair();
    this.createCamera();
    this.createGroups();
    this.createObjects();
    this.createEvents();
  }

  update(time, delta) {
    this.updatePlayer(time, delta);
    this.updateEnemies();
    this.updateCrosshair();
  }

  createKeys() {
    this.keys = this.input.keyboard.addKeys({
        up:     'Z',
        down:   'S',
        left:   'Q',
        right:  'D',
        space:  'SPACE',
        shift:  'SHIFT'
    });
  }

  createMap(level, floor) {
    let mapName = 'level-' + level + '-floor-' + floor;
    this.map = this.make.tilemap({ key: mapName });
    const tileset = this.map.addTilesetImage('tileset', 'tileset', 32, 32, 1, 2);
    this.above = this.map.createDynamicLayer('above', tileset, 0, 0);
    this.above.setDepth(10);

    this.void = this.map.createDynamicLayer('void', tileset, 0, 0);
    this.void.setCollisionByProperty({ collides: true });

    this.walkables = this.map.createDynamicLayer('walkable', tileset, 0, 0);

    this.blocks = this.map.createDynamicLayer('block', tileset, 0, 0);
    this.blocks.setCollisionByProperty({ collides: true });

    this.details = this.map.createDynamicLayer('detail', tileset, 0, 0);

    this.spikes = this.map.createDynamicLayer('spike', tileset, 0, 0);
    this.spikes.setCollisionByProperty({ collides: true });
  }

  createPlayer(health, inventory, weapons) {
    let spawnObject = this.map.getObjectLayer('player').objects[0];

    this.player = new Player({
      scene: this,
      key: 'player',
      x: spawnObject.x + 16,
      y: spawnObject.y - 16
    }, health, inventory, weapons);

    this.physics.add.collider(this.player, this.blocks);
    this.physics.add.collider(this.player, this.doors);
    this.physics.add.collider(this.player, this.void);
    this.physics.add.collider(
      this.player,
      this.spikes,
      _ => { this.player.hurt(80); }
    );

    // Ugly, should be inside the Player[Idle/Run]State
    // but dunno how to test only one time.
    this.input.on('pointerdown', pointer => {
      let state = this.player.actionStateMachine.state;
      if (!this.player.isDead() && (state === 'idle' || state === 'run')) {
        switch (this.player.getCurrentWeapon()) {
          case 'sword':
            this.player.actionStateMachine.transition('slash');
            break;
          case 'bow':
            this.player.actionStateMachine.transition('shoot');
            break;
          default:
            break;
        }
      }
   });
  }

  createCrosshair() {
    let crosshairFrame = 'crosshair-simple';

    if (this.player.getCurrentWeapon() == 'bow') {
      crosshairFrame = 'crosshair-bow';
    }

    this.crosshair = this.physics.add.sprite(
      this.player.x,
      this.player.y,
      'atlas',
      crosshairFrame
    );

    this.crosshair.setDepth(11);

    this.sys.canvas.addEventListener('mousedown', _ => {
      this.sys.input.mouse.requestPointerLock();
    });

    this.input.keyboard.on('keydown_q', _ => {
      if (this.sys.input.mouse.locked)
          this.sys.input.mouse.releasePointerLock();
    }, 0, this);

    this.input.on('pointermove', pointer => {
      if (this.input.mouse.locked) {
        this.crosshair.x += pointer.movementX;
        this.crosshair.y += pointer.movementY;
      }
    }, this);
  }

  createCamera() {
    this.cameras.main.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
    this.cameras.main.startFollow(this.player);
  }

  createGroups() {
    this.enemyGroup = this.add.group();
    this.doorsGroup = this.add.group({
      runChildUpdate: true
    });

    this.playerArrows = this.add.group({
      classType: PlayerArrow,
      maxSize: 5
    });

    this.transitionsGroup = this.add.group({
      classType: Phaser.GameObjects.Zone
    });

    this.dashShadowsGroup = this.add.group({
      maxSize: 5
    });

    this.fireballsSimpleGroup = this.add.group({
      classType: FireballSimple,
      maxSize: 30
    });

    this.fireballsArcanicGroup = this.add.group({
      classType: FireballArcanic,
      maxSize: 96
    });

    this.pursuitSwordGroup = this.add.group({
      classType: PursuitSword,
      runChildUpdate: true
    });

    // Player dash shadows.
    this.dashShadowsGroup.createMultiple({
      key: 'atlas',
      frame: 'little-knight-run-0',
      setXY: {
        x: this.player.x,
        y: this.player.y
      },
      quantity: 5
    });

     this.dashShadowsGroup.children.each(c => {
       c.setVisible(false);
       c.setActive(false);
     });

     // Player arrows.
     this.physics.add.collider(
      this.playerArrows,
      this.doorsGroup,
      (a, d) => { a.break(); }
    );

    this.physics.add.collider(
      this.playerArrows,
      this.blocks,
      (a, b) => { a.break(); }
    );

    this.physics.add.collider(
      this.playerArrows,
      this.spikes,
      (a, b) => { a.break(); }
    );

    this.physics.add.collider(
      this.playerArrows,
      this.enemyGroup,
      (a, e) => { a.enemyCollide(e) }
    );

    // Player.
    this.physics.add.collider(
      this.player,
      this.enemyGroup,
      (p, e) => { e.meleeAttack(p); }
    );

    // Fireballs.
    this.physics.add.collider(
      this.fireballsSimpleGroup,
      this.blocks,
      (fb, b) => { fb.explode(); }
    );

    this.physics.add.collider(
      this.fireballsArcanicGroup,
      this.blocks,
      (fba, b) => { fba.explode(); }
    );

    this.physics.add.collider(
      this.fireballsArcanicGroup,
      this.spikes,
      (fba, b) => { fba.explode(); }
    );

    // Pursuit sword.
    this.physics.add.collider(
      this.pursuitSwordGroup,
      this.player,
      (ps, p) => { ps.collidePlayer(p); }
    );

    this.physics.add.collider(
      this.pursuitSwordGroup,
      this.spikes,
      (ps, p) => { ps.collide(); }
    );

    // Enemies.
    this.physics.add.collider(this.enemyGroup, this.enemyGroup);
    this.physics.add.collider(this.enemyGroup, this.blocks);
    this.physics.add.collider(this.enemyGroup, this.void);

    // Transitions.
    this.physics.add.collider(
      this.transitionsGroup,
      this.player,
      (t, p) => {
        this.changeLevel(t.getData('level'), t.getData('floor'), this.player);
      }
    );
  }

  /*
   * Change level and pass player's arguments to the next scene.
   * I'm not passing the player itself because in this case his
   * scene from his states machines needs to be updated and it's
   * tricky.
   */
  changeLevel(level, floor, player) {
    this.scene.restart(
      {
        level: level,
        floor: floor,
        player: {
          health: player.health,
          inventory: player.getData('inventory'),
          weapons: player.getData('weapons')
        }
      }
    );
  }

  createObjects() {
    // Enemies.
    this.map.getObjectLayer('enemies').objects.forEach(enemy => {
      let enemyObject;
      enemy.x += 16;
      enemy.y -= 16;
      switch (enemy.type) {
        case 'desolation-knight':
          enemyObject = new DesolationKnight({
            scene: this,
            key: 'desolation-knight',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'ice-lizard':
          enemyObject = new Lizard({
            scene: this,
            key: 'lizard',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'ice-sad':
          enemyObject = new IceSad({
            scene: this,
            key: 'ice-sad',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'ice-mask':
          enemyObject = new IceMask({
            scene: this,
            key: 'ice-mask',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'demon-big':
          enemyObject = new DemonBig({
            scene: this,
            key: 'demon-big',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'demon-split':
          enemyObject = new DemonSplit({
            scene: this,
            key: 'demon-split',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'demon-bounce':
          enemyObject = new DemonBounce({
            scene: this,
            key: 'demon-bounce',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'orc-big':
          enemyObject = new OrcBig({
            scene: this,
            key: 'orc-big',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'orc-mask':
          enemyObject = new OrcMask({
            scene: this,
            key: 'orc-mask',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'orc-tattoo':
          enemyObject = new OrcTattoo({
            scene: this,
            key: 'orc-tattoo',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'orc-simple':
          enemyObject = new OrcSimple({
            scene: this,
            key: 'orc-simple',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'leaf-sad':
          enemyObject = new LeafSad({
            scene: this,
            key: 'leaf-sad',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'leaf-big':
          enemyObject = new LeafBig({
            scene: this,
            key: 'leaf-big',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'undead-simple':
          enemyObject = new UndeadSimple({
            scene: this,
            key: 'undead-simple',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'rot':
          enemyObject = new Rot({
            scene: this,
            key: 'rot',
            x: enemy.x,
            y: enemy.y
          });
          break;
        case 'mage':
          enemyObject = new Mage({
            scene: this,
            key: 'mage',
            x: enemy.x,
            y: enemy.y
          });
          break;
        default:
          console.error('Unknown enemy object type: ' + enemy.type);
          break;
      }
      this.enemyGroup.add(enemyObject);
    });

    // Chests.
    this.map.getObjectLayer('chests').objects.forEach(chest => {
      let chestObject = new Chest({
        scene: this,
        x: chest.x + 16,
        y: chest.y - 16
      }, chest.type);
    });

    // Doors.
    this.map.getObjectLayer('doors').objects.forEach(door => {
      let doorObject = new Door({
        scene: this,
        x: door.x,
        y: door.y
      }, door.type);
      this.doorsGroup.add(doorObject);
    });

    // Transitions between levels.
    this.map.getObjectLayer('transitions').objects.forEach(transition => {
      let transitionObject = new Phaser.GameObjects.Zone(
        this,
        transition.x + 16,
        transition.y - 16
      );
      let levelAndFloor = transition.type.split('-') ;
      transitionObject.setData({
        level: levelAndFloor[0],
        floor: levelAndFloor[1]
      });
      this.physics.world.enable(transitionObject);
      this.add.existing(transitionObject);
      this.transitionsGroup.add(transitionObject);
    });

    // NPCs.
    this.map.getObjectLayer('npcs').objects.forEach(npc => {
      let npcObject;
      switch (npc.type) {
        case 'father':
          npcObject = new Father({
            scene: this,
            key: 'father',
            x: npc.x + 16,
            y: npc.y - 16
          });
        break;
      }
    });
  }

  createEvents() {
    this.events.on('player-death', _ => {
      // If the player dies against a boss.
      HUDEventsManager.emit('hide-boss-stats');

      this.scene.start('endScene', {
        result: 'over',
        dataSaved: this.dataSaved
      });
    }, this);
  }

  updatePlayer(time, delta) {
    if (!this.player.isDead())
      this.player.update(time, delta);
  }

  updateEnemies() {
    this.enemyGroup.children.entries.forEach(enemy => {
      enemy.actionStateMachine.update();
      enemy.updateDepth();
      enemy.updateAnimation();
    });
  }

  /* Too much lines in here. */
  updateCrosshair() {
    // Crosshair movements.
    let screenWidth = this.game.config.width;
    let cameraLeft = this.cameras.main.scrollX;
    let cameraRight = cameraLeft + screenWidth;

    if (this.crosshair.x > cameraRight) {
      this.crosshair.x = cameraRight;
    } else if (this.crosshair.x < cameraLeft) {
      this.crosshair.x = cameraLeft;
    }

    let screenHeight = this.game.config.height;
    let cameraTop = this.cameras.main.scrollY;
    let cameraDown = cameraTop + screenHeight;

    if (this.crosshair.y > cameraDown) {
      this.crosshair.y = cameraDown;
    } else if (this.crosshair.y < cameraTop) {
      this.crosshair.y = cameraTop;
    }

    // Crosshair linked to the player velocity.
    this.crosshair.body.velocity.x = this.player.body.velocity.x;
    this.crosshair.body.velocity.y = this.player.body.velocity.y;
  }

  /*
   * Save-state of the player for this scene at the beginning of
   * the level. If he die we can simply restart the level with
   * this stats.
   */
  saveState(level, floor, player) {
    let weaponsCopy = [];
    player.getData('weapons').forEach(weapon => {
      weaponsCopy.push(weapon);
    });

    this.dataSaved = {
      level: level,
      floor: floor,
      player: {
        health: player.health,
        weapons: weaponsCopy
      }
    };
  }

  enableTilemapDebug() {
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.blocks.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });
  }
}
