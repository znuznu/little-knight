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

import PlayerArrow from '../sprites/movesets/PlayerArrow.js';
import Chest from '../sprites/misc/Chest.js';
import Door from '../sprites/misc/Door.js';
import eventsManager from './EventsManager.js';

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
      this.createPlayer(6, ['sword'], {});
    }
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
    this.walkables = this.map.createDynamicLayer('walkable', tileset, 0, 0);
    this.details = this.map.createDynamicLayer('detail', tileset, 0, 0);
    this.blocks = this.map.createDynamicLayer('block', tileset, 0, 0);
    this.void = this.map.createDynamicLayer('void', tileset, 0, 0);
    this.above = this.map.createDynamicLayer('above', tileset, 0, 0);
    this.above.setDepth(10);
    this.blocks.setCollisionByProperty({ collides: true });
    this.void.setCollisionByProperty({ collides: true });
  }

  createPlayer(health, inventory, weapons) {
    let spawnObject = this.map.getObjectLayer('player').objects[0];

    this.player = new Player({
      scene: this,
      key: 'player',
      x: spawnObject.x,
      y: spawnObject.y
    }, health, inventory, weapons);

    this.physics.add.collider(this.player, this.blocks);
    this.physics.add.collider(this.player, this.doors);
    this.physics.add.collider(this.player, this.void);

    // Ugly, should be inside the Player[Idle/Run]State but dunno
    // how to test only one time.
    this.input.on('pointerdown', pointer => {
      let state = this.player.actionStateMachine.state;
      console.log(this.player.body);
      if (state === 'idle' || state === 'run') {
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
    this.crosshair = this.physics.add.sprite(
      this.player.x,
      this.player.y,
      'atlas',
      'crosshair-simple'
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
    this.doorsGroup = this.add.group();
    this.playerArrows = this.add.group({
      classType: PlayerArrow,
      maxSize: 5
    });
    this.transitionsGroup = this.add.group({
      classType: Phaser.GameObjects.Zone
    });

    this.physics.add.collider(
      this.playerArrows,
      this.doorsGroup,
      (a, d) => { a.blocksCollide(); }
    );

    this.physics.add.collider(
      this.playerArrows,
      this.blocks,
      (a, b) => { a.blocksCollide(); }
    );

    this.physics.add.collider(
      this.playerArrows,
      this.enemyGroup,
      (a, e) => { a.enemyCollide(e) }
    );

    this.physics.add.collider(
      this.player,
      this.enemyGroup,
      (p, e) => { e.meleeAttack(p); }
    );

    this.physics.add.collider(this.enemyGroup, this.enemyGroup);
    this.physics.add.collider(this.enemyGroup, this.blocks);
    this.physics.add.collider(
      this.transitionsGroup,
      this.player,
      (t, p) => {
        this.changeLevel(t.getData('level'), t.getData('floor'), this.player);
      }
    );
  }

  /* Change level and pass player's arguments to the next scene.
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
    // Enemies, awful.
    this.map.getObjectLayer('enemies').objects.forEach(enemy => {
      let enemyObject;
      enemy.x += 16;
      enemy.y -= 16;
      switch (enemy.type) {
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
      this.scene.start('endScene', {result: 'over'});
    }, this);
  }

  updatePlayer(time, delta) {
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

  enableTilemapDebug() {
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.blocks.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });
  }
}
