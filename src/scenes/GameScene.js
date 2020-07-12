/**
 * Main levels scene.
 *
 * There's only one scene to handle each level.
 *
 */

import Character from '../sprites/characters/Character.js';
import Father from '../sprites/npcs/Father.js';
import Sister from '../sprites/npcs/Sister.js';
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
import Depressum from '../sprites/characters/enemies/boss/Depressum.js';
import PlayerArrow from '../sprites/movesets/player/PlayerArrow.js';
import PlayerBomb from '../sprites/movesets/player/PlayerBomb.js';
import PlayerSlash from '../sprites/movesets/player/PlayerSlash.js';
import FireballSimple from '../sprites/movesets/enemies/FireballSimple.js';
import FireballArcanic from '../sprites/movesets/enemies/FireballArcanic.js';
import Knife from '../sprites/movesets/enemies/Knife.js';
import Boomerang from '../sprites/movesets/enemies/Boomerang.js';
import PursuitSword from '../sprites/movesets/enemies/PursuitSword.js';
import Chest from '../sprites/misc/Chest.js';
import Door from '../sprites/misc/Door.js';
import Explosion from '../sprites/effects/Explosion.js';
import SmokeSmall from '../sprites/effects/SmokeSmall.js';
import Loot from '../sprites/loots/Loot.js';
import PotionHealSmall from '../sprites/loots/PotionHealSmall.js';
import AnimatedTiles from 'phaser-animated-tiles/dist/AnimatedTiles.min.js';
import HUDEventsManager from '../events/HUDEventsManager.js';
import MusicsEventsManager from '../events/MusicsEventsManager.js';
import Node from '../algorithms/pathfinder/Node.js';
import AStar from '../algorithms/pathfinder/AStar.js';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('gameScene');
  }

  init(data) {
    this.floor = data.floor;
    this.moveControls = data.moveControls;
    this.createMap(data.level, data.floor);
    let player = data.player;

    if (player) {
      this.createPlayer(player.health, player.weapons, player.inventory);
    } else {
      this.scene.run('hudScene');
      this.createPlayer(6, [], {});
    }

    this.saveState(data.level, data.floor, this.player, this.moveControls);

    // Clear the HUD in case we're restarting the level after a death.
    HUDEventsManager.emit('update-weapons', this.player.getData('weapons'));
    HUDEventsManager.emit('update-health', this.player.health);

    // There's never a key to take from a level to another.
    HUDEventsManager.emit('update-keys', 0);
    HUDEventsManager.emit('update-key-boss', 0);
  }

  preload() {
    this.load.scenePlugin(
      'animatedTiles',
      AnimatedTiles,
      'animatedTiles',
      'animatedTiles'
    );
   }

  create() {
    this.cameras.main.fadeIn(1000);
    this.createKeys();
    this.createCrosshair();
    this.createCamera();
    this.createGroups();
    this.createPathfinder();
    this.createObjects();
    this.createEvents();
    this.createSound();
    this.createAnimatedTiles();
    this.createMusic();
    this.createFloorTitle();
  }

  update(time, delta) {
    this.updatePlayer(time, delta);
    this.updateCrosshair();
  }

  createKeys() {
    this.keys = this.input.keyboard.addKeys({
        up:    this.moveControls[0],
        down:  this.moveControls[2],
        left:  this.moveControls[1],
        right: this.moveControls[3],
        space: 'SPACE',
        shift: 'SHIFT'
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
    this.blocks.setDepth(2);

    this.details = this.map.createDynamicLayer('detail', tileset, 0, 0);
    this.details.setDepth(3);

    this.spikes = this.map.createDynamicLayer('spike', tileset, 0, 0);
    this.spikes.setCollisionByProperty({ collides: true });
  }

  createPlayer(health, inventory, weapons) {
    this.time.addEvent({
      delay: 300,
      repeat: -1,
      callbackScope: this,
      callback: _ => {
        if (this.player.actionStateMachine.state === 'run') {
          let randIndex = ~~(Math.random() * 8) + 1;
          this.sound.playAudioSprite('sounds', 'stepstone_' + randIndex);
        }
      }
    });

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
    // but dunno how to test only "just" one time.
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
          case 'bomb':
            this.player.actionStateMachine.transition('bomb');
            break;
          default:
            break;
        }
      }
   });
  }

  createCrosshair() {
    let crosshairFrame = 'crosshair-';
    let currentWeapon = this.player.getCurrentWeapon();

    this.crosshair = this.physics.add.sprite(
      this.player.x,
      this.player.y,
      'atlas',
      'crosshair-simple'
    );

    this.events.emit('update-crosshair-frame', currentWeapon);

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
    this.enemyGroup = this.add.group({
      runChildUpdate: true
    });

    this.npcsGroup = this.add.group({
      runChildUpdate: true
    });

    this.doorsGroup = this.add.group({
      runChildUpdate: true
    });

    this.transitionsGroup = this.add.group({
      classType: Phaser.GameObjects.Zone
    });

    this.dashShadowsGroup = this.add.group({
      maxSize: 5
    });

    this.knivesGroup = this.add.group({
      classType: Knife,
      maxSize: 32,
      runChildUpdate: true
    });

    this.fireballsSimpleGroup = this.add.group({
      classType: FireballSimple,
      maxSize: 16,
      runChildUpdate: true
    });

    this.fireballsArcanicGroup = this.add.group({
      classType: FireballArcanic,
      maxSize: 96
    });

    this.pursuitSwordGroup = this.add.group({
      classType: PursuitSword,
      runChildUpdate: true
    });

    this.boomerangsGroup = this.add.group({
      classType: Boomerang,
      maxSize: 16,
      runChildUpdate: true
    });

    this.playerArrows = this.add.group({
      classType: PlayerArrow,
      maxSize: 5,
      runChildUpdate: true
    });

    this.playerBombsGroup = this.add.group({
      classType: PlayerBomb,
      maxSize: 3,
      runChildUpdate: true
    });

    this.playerSlashsGroup = this.add.group({
      classType: PlayerSlash,
      maxSize: 16
    });

    this.explosionsGroups = this.add.group({
      classType: Explosion,
      maxSize: 3
    });

    this.potionHealSmallGroup = this.add.group({
      classType: PotionHealSmall,
      maxSize: 16
    });

    this.smokeSmallGroup = this.add.group({
      classType: SmokeSmall,
      maxSize: 99
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
      (a, e) => { a.enemyCollide(e); }
    );

    this.physics.add.collider(
      this.playerArrows,
      this.fireballsArcanicGroup,
      (pa, fa) => {
        fa.explode();
        pa.show(false);
      }
    );

    // Player slashs (sword).
    this.physics.add.overlap(
      this.playerSlashsGroup,
      this.enemyGroup,
      (s, e) => { e.meleeAttackTaken(s.damage); },
      null,
      this
    );

    this.physics.add.overlap(
      this.playerSlashsGroup,
      this.knivesGroup,
      (s, k) => { k.deflects(); },
      null,
      this
    );

    // Player.
    this.physics.add.collider(
      this.player,
      this.enemyGroup,
      (p, e) => { e.meleeAttack(p); }
    );

    // Knives.
    this.physics.add.collider(
      this.knivesGroup,
      this.blocks,
      (k, b) => { k.break(); }
    );

    this.physics.add.overlap(
      this.knivesGroup,
      this.player,
      (k, p) => { k.playerCollide(p); }
    );

    // Boomerangs.
    this.physics.add.collider(
      this.boomerangsGroup,
      this.blocks,
      (bo, bl) => { bo.blocksCollide(); }
    );

    this.physics.add.overlap(
      this.boomerangsGroup,
      this.player,
      (bo, p) => { bo.playerCollide(p); }
    );

    // Fireballs.
    this.physics.add.collider(
      this.fireballsSimpleGroup,
      this.blocks,
      (fb, b) => { fb.explode(); }
    );

    this.physics.add.overlap(
      this.fireballsSimpleGroup,
      this.player,
      (fb, p) => { fb.playerCollide(p); }
    );

    this.physics.add.overlap(
      this.fireballsArcanicGroup,
      this.player,
      (fa, p) => { fa.playerCollide(p); }
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
    this.physics.add.overlap(
      this.transitionsGroup,
      this.player,
      (t, p) => {
        if (!p.isDead() && p.actionStateMachine.state !== 'dash') {
          this.changeLevel(
            t.getData('level'),
            t.getData('floor'),
            this.player,
            this.moveControls
          );
        }
      }
    );

    this.physics.add.collider(this.playerBombsGroup, this.blocks);
    this.physics.add.collider(this.playerBombsGroup, this.spikes);
    this.physics.add.collider(this.playerBombsGroup, this.void);
    this.physics.add.collider(this.playerBombsGroup, this.doorsGroup);

    // Explosions.
    this.physics.add.overlap(
      this.explosionsGroups,
      this.player,
      (e, p) => { p.hurt(e.damage); }
    );

    this.physics.add.overlap(
      this.explosionsGroups,
      this.enemyGroup,
      (e, eg) => { eg.bombDamageTaken(e.damage); }
    );

    // Loots.
    this.physics.add.overlap(
      this.potionHealSmallGroup,
      this.player,
      (ps, p) => { ps.use(); }
    );
  }

  createPathfinder() {
    let walkableLayerDatas = this.map.getLayer('walkable').data;
    let blockLayerDatas = this.map.getLayer('block').data;

    let datas = [];

    let row, col;

    for (row = 0; row < walkableLayerDatas.length; row++) {
      if (!datas[row])
        datas.push([]);

      for (col = 0; col < walkableLayerDatas[0].length; col++) {
        let isWalkable = walkableLayerDatas[row][col].index !== -1;
        let isFree = blockLayerDatas[row][col].index === -1;

        if (isWalkable && isFree) {
          datas[row].push(0);
        } else {
          datas[row].push(1);
        }
      }
    }

    let aStarConfig = {
      datas: datas,
      block: element => element,
      topology: 8
    };

    this.aStar = new AStar(aStarConfig);

    let grid = [
      [0, 1, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 1],
      [0, 1, 1, 1, 0, 0]
    ];

    // The config object used to initialize the A* Class.
    // The testing block function is simple.
    let config = {
      datas: grid,
      block: n => n === 1
    };

    let aaaaaa = new AStar(config);

    // r stands for row, c for col.
    let start = {r: 0, c: 0};
    let end = {r: 0, c: 2};

    let result = aaaaaa.search(start, end);

    //  {
    //    status: 'Found',
    //    path: (8) [...]
    //  }
    console.dir(result);

    result.path.forEach(n => {
      grid[n.r][n.c] = 9;
    });

    //  [
    //    [9, 1, 9, 9, 0, 0],
    //    [9, 1, 1, 9, 1, 0],
    //    [9, 9, 9, 9, 0, 0],
    //    [0, 0, 0, 1, 0, 1],
    //    [0, 1, 1, 1, 0, 0]
    //  ]
    console.dir(grid);
  }

  /*
   * Change level and pass player's arguments to the next scene.
   * I'm not passing the player itself because in this case his
   * scene from his states machines needs to be updated and it
   * gets tricky.
   *
   */
  changeLevel(level, floor, player, moveControls) {
    HUDEventsManager.emit('update-minimap', undefined);

    this.scene.restart(
      {
        level: level,
        floor: floor,
        player: {
          health: player.health,
          inventory: player.getData('inventory'),
          weapons: player.getData('weapons')
        },
        moveControls: moveControls
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
        case 'depressum':
          enemyObject = new Depressum({
            scene: this,
            key: 'depressum',
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
        case 'sister':
          npcObject = new Sister({
            scene: this,
            key: 'sister',
            x: npc.x + 16,
            y: npc.y - 16
          });
          break;
      }

      this.npcsGroup.add(npcObject);
    });
  }

  createEvents() {
    this.events.on('player-death', _ => {
      // If the player died against a boss.
      HUDEventsManager.emit('show-boss-stats', false);

      // Clear the map.
      HUDEventsManager.emit('update-minimap', undefined);

      this.scene.start('gameOverScene', {
        dataSaved: this.dataSaved
      });
    }, this);

    this.events.on('sister-saved', _ => {
      this.scene.setVisible(false, 'hudScene');
      this.scene.start('victoryScene');
    }, this);

    this.events.on('replace-tiles', (area, layer, index) => {
      this.map.fill(
        index,
        area.topLeft.x,
        area.topLeft.y,
        area.size.w,
        area.size.h,
        false,
        layer);
    }, this);

    // I find it better to put this here instead of the HUDScene,
    // I like to see the crosshair as a "living" entity.
    this.events.on('update-crosshair-frame', weapon => {
      let crosshairFrame = 'crosshair-';
      switch (weapon) {
        case 'sword':
        case 'bow':
        case 'bomb':
          crosshairFrame += weapon;
          break;
        default:
          crosshairFrame += 'simple';
          break;
      }

      this.crosshair.setFrame(crosshairFrame);
    });
  }

  createSound() {
    this.sound.volume = 0.1;
  }

  createMusic() {
    MusicsEventsManager.emit('play-music', 'Level-1');
  }

  createFloorTitle() {
    let cameraWorld = this.cameras.main.getWorldPoint(
      this.cameras.main.x,
      this.cameras.main.y
    );
    this.floorTitle = this.add.bitmapText(
      cameraWorld.x + this.game.config.width / 2,
      cameraWorld.y + this.game.config.height / 4,
      'bitty',
      'Floor ' + this.floor,
      64
    ).setCenterAlign();

    this.floorTitle.setDepth(12);
    this.floorTitle.setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: this.floorTitle,
      alpha: 0,
      ease: 'Cubic.easeIn',
      duration: 3000,
      repeat: 0,
      onComplete: _ => { this.floorTitle.setVisible(false); }
    });
  }

  updatePlayer(time, delta) {
    if (!this.player.isDead())
      this.player.update(time, delta);
  }

  // Crosshair movements.
  updateCrosshair() {
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

  // AnimatedTiles plugin by nkholski.
  // (See https://github.com/nkholski/phaser3-es6-webpack)
  createAnimatedTiles() {
    this.sys.animatedTiles.init(this.map);
  }

  // Not used.
  createFog() {
    let fog = this.add.rectangle(
      this.cameras.main.x,
      this.cameras.main.y,
      this.game.config.width,
      this.game.config.height,
      0x0000000,
      0.7
    ).setOrigin(0, 0);
    fog.setDepth(11);
  }

  /**
   * Save-state of the player for this scene at the beginning of
   * the level. If he die we can simply restart the level with
   * this stats.
   */
  saveState(level, floor, player, moveControls) {
    // Trap floor.
    if (floor == 666) return;

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
      },
      moveControls: moveControls
    };
  }

  enableTilemapDebug() {
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    this.blocks.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });

    this.void.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(255, 51, 91, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255)
    });
  }
}
