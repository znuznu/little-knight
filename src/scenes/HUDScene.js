/**
 * The player HUD scene.
 *
 * Note: The crosshair isn't here.
 *
 */

import HUDEventsManager from '../events/HUDEventsManager.js';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super('hudScene');
  }

  create() {
    this.cameras.main.fadeIn(1000);
    this.createEventsListener();
    this.createHealth();
    this.createWeapons();
    this.createKeys();
    this.createKeyBoss();
    this.createBossStats();
    this.createMinimap();
  }

  createEventsListener() {
    HUDEventsManager.on('update-health', this.updateHealth, this);
    HUDEventsManager.on('update-weapons', this.updateWeapons, this);
    HUDEventsManager.on('update-keys', this.updateKeys, this);
    HUDEventsManager.on('update-key-boss', this.updateKeyBoss, this);
    HUDEventsManager.on('update-boss-health', this.updateBossHealth, this);
    HUDEventsManager.on('update-boss-name', this.updateBossName, this);
    HUDEventsManager.on('update-minimap', this.updateMinimap, this);
    HUDEventsManager.on('show-boss-stats', this.showBossStats, this);
  }

  createHealth() {
    this.health = this.add.group({
			classType: Phaser.GameObjects.Image
		});

    // Better to pass a player as argument with his hearts.
    for (let hearts = 1; hearts <= 3; hearts++) {
      this.health.add(
        this.add.sprite(32 * hearts, 32, 'atlas', 'heart-0')
      );
    }
  }

  createWeapons() {
    this.add.sprite(32, 64 + 10, 'atlas', 'items-container');
    this.add.sprite(32, 96 + 20, 'atlas', 'items-container');
    this.add.sprite(32, 128 + 30, 'atlas', 'items-container');

    this.weapons = this.add.group();
    this.weapons.createMultiple({
      key: 'atlas',
      frame: 'items-container',
      setXY: {
        x: 32,
        y: 74,
        stepY: 42
      },
      quantity: 3
    });
  }

  createKeys() {
    this.keys = this.add.group({
  		classType: Phaser.GameObjects.Image
    });

    this.keys.createMultiple({
      key: 'atlas',
      frame: 'key-simple',
      setXY: {
        x: 32,
        y: 454,
        stepX: 42
      },
      quantity: 5
    });

    this.keys.children.each(c => {
      c.setVisible(false);
      c.setActive(false);
    });
  }

  createKeyBoss() {
    this.keyBoss = this.add.sprite(64, 116, 'atlas', 'key-boss');
    this.keyBoss.setVisible(false);
  }

  createBossStats() {
    this.createBossName();
    this.createBossHealth();
    this.showBossStats(false);
  }

  createBossName() {
    this.bossName = this.add.bitmapText(
      128, 380, 'bitty', 'Default', 32
    ).setOrigin(0, 0);

    this.bossName.setTint(0xfdf7ed);
  }

  createBossHealth() {
    this.maximumHealthBar = this.add.rectangle(
      128, 416, 544, 32, 0x222222
    ).setOrigin(0, 0);

    this.borderTop = this.add.rectangle(
      this.maximumHealthBar.x,
      this.maximumHealthBar.y - 2,
      this.maximumHealthBar.width, 2, 0xfdf7ed
    ).setOrigin(0, 0);

    this.borderDown = this.add.rectangle(
      this.maximumHealthBar.x,
      this.maximumHealthBar.y + this.maximumHealthBar.height,
      this.maximumHealthBar.width, 2, 0xfdf7ed
    ).setOrigin(0, 0);

    this.borderRight = this.add.rectangle(
      this.maximumHealthBar.x - 2 ,
      this.maximumHealthBar.y,
      2, this.maximumHealthBar.height, 0xfdf7ed
    ).setOrigin(0, 0);

    this.borderLeft = this.add.rectangle(
      this.maximumHealthBar.x + this.maximumHealthBar.width,
      this.maximumHealthBar.y,
      2, this.maximumHealthBar.height, 0xfdf7ed
    ).setOrigin(0, 0);

    this.currentHealthBarTop = this.add.rectangle(
      this.maximumHealthBar.x + 2,
      this.maximumHealthBar.y + 2,
      0, 21, 0xb30000
    ).setOrigin(0, 0);

    this.currentHealthBarDown = this.add.rectangle(
      this.maximumHealthBar.x + 2,
      this.currentHealthBarTop.y + 21,
      0, 7, 0x800000
    ).setOrigin(0, 0);
  }

  createMinimap() {
    this.map = this.add.sprite(64, 74, 'atlas', 'map');
    this.map.setVisible(false);

    // The container.
    this.minimap = undefined;
    this.mmTopBar = undefined;
    this.mmBottomBar = undefined;
    this.mmLeftBar = undefined;
    this.mmRightBar = undefined;

    // Datas from the minimap.
    this.mmData = undefined;
  }

  updateWeapons(weapons) {
    this.weapons.children.each((weapon, index) => {
      switch (weapons[index]) {
        case 'bow':
          weapon.setFrame('bow-and-arrow');
          break;
        case 'sword':
          weapon.setFrame('sword');
          break;
        case 'bomb':
          weapon.setFrame('bomb-0');
          break;
        default:
          weapon.setFrame('items-container');
          break;
      }
    });
  }

  updateHealth(health) {
    let completeHearts = ~~(health / 2);
    let halfHearts = 0;

    if (health % 2 != 0)
      halfHearts += 1;

    this.health.children.each(heart => {
      if (completeHearts > 0) {
        completeHearts -= 1;
        heart.setFrame('heart-0');
      } else if (halfHearts > 0) {
        halfHearts -= 1;
        heart.setFrame('heart-1');
      } else {
        heart.setFrame('heart-2');
      }
    });
  }

  updateKeys(n) {
    this.keys.children.each((key, index) => {
      if (index < n) {
        key.setVisible(true);
        key.setActive(true);
      } else {
        key.setVisible(false);
        key.setActive(false);
      }
    });
  }

  // There's only one boss key at a time.
  updateKeyBoss(n) {
    if (n)
      this.keyBoss.setVisible(true);
    else
      this.keyBoss.setVisible(false);
  }

  updateBossName(name) {
    this.bossName.setText(name);
  }

  updateBossHealth(maximum, current) {
    let percentage = 100 * current / maximum;
    let widthPercentage = percentage * (this.maximumHealthBar.width / 100);

    if (widthPercentage == 0)
      widthPercentage = 4;

    this.currentHealthBarTop.setSize(
      widthPercentage - 4,
      21
    );

    this.currentHealthBarDown.setSize(
      widthPercentage - 4,
      7
    );
  }

  showBossStats(isVisible) {
    this.maximumHealthBar.setVisible(isVisible);
    this.currentHealthBarTop.setVisible(isVisible);
    this.currentHealthBarDown.setVisible(isVisible);
    this.borderTop.setVisible(isVisible);
    this.borderDown.setVisible(isVisible);
    this.borderRight.setVisible(isVisible);
    this.borderLeft.setVisible(isVisible);
    this.bossName.setVisible(isVisible);
  }

  updateMinimap(map) {
    // Clear the map in any case.
    this.clearMinimap();

    if (!map) {
      this.showMinimap(false);
      return;
    }

    let layer = map.getLayer('walkable').data;

    let x = (this.sys.game.config.width - 32);
    let y = (this.sys.game.config.height - 32);

    let rows = layer.length;
    let cols = layer[0].length;

    this.mmSize = {
      w: cols,
      h: rows
    };

    this.minimap = this.add.rectangle(
      x, y, this.mmSize.w, this.mmSize.h, 0x222222, 0.5
    ).setOrigin(1, 1);

    this.mmTopBar = this.add.rectangle(
      x, y - this.mmSize.h, this.mmSize.w, 2, 0xfdf7ed
    ).setOrigin(1, 1);

    this.mmBottomBar = this.add.rectangle(
      x, y + 2, this.mmSize.w, 2, 0xfdf7ed
    ).setOrigin(1, 1);

    this.mmLeftBar = this.add.rectangle(
      x - this.mmSize.w, y, 2, this.mmSize.h, 0xfdf7ed
    ).setOrigin(1, 1);

    this.mmRightBar = this.add.rectangle(
      x + 2, y, 2, this.mmSize.h, 0xfdf7ed
    ).setOrigin(1, 1);

    // Datas from the minimap.
    this.mmData = this.add.graphics();
    this.mmData.setPosition(
      this.minimap.x - this.mmSize.w,
      this.minimap.y - this.mmSize.h
    );
    this.mmData.fillStyle(0xffffff, 1);

    this.showMinimap(true);

    // Datas from the minimap.
    this.mmData = this.add.graphics();
    this.mmData.setPosition(
      this.minimap.x - this.mmSize.w,
      this.minimap.y - this.mmSize.h
    );
    this.mmData.fillStyle(0xffffff, 1);

    let row, col;

    for (row = 0; row < rows; row++)
    for (col = 0; col < cols; col++) {
      let tile = layer[row][col];
      if (tile.index !== -1) {
        this.mmData.fillPoint(col, row);
      }
    }

    map.getObjectLayer('chests').objects.forEach(chest => {
      let tile = map.getTileAtWorldXY(chest.x + 16, chest.y - 16, true);

      switch (chest.type) {
        case 'key-simple':
        case 'key-boss':
          this.mmData.fillStyle(0xee8e2e, 1);
          break;
        case 'potion-heal':
          this.mmData.fillStyle(0xda4e38, 1);
          break;
        case 'sword':
        case 'bow':
        case 'bomb':
          this.mmData.fillStyle(0x9b56cc, 1);
          break;
        case 'map':
          this.mmData.fillStyle(0x5698cc, 1);
          break;
        default:
          break;
      }

      // The fillPoint with an odd value is blurry.
      this.mmData.fillRect(tile.x - 1, tile.y - 1, 3, 3);
    });

    map.getObjectLayer('transitions').objects.forEach(transition => {
      let tile = map.getTileAtWorldXY(transition.x + 16, transition.y - 16, true);
      this.mmData.fillStyle(0x4ba747, 1);
      this.mmData.fillRect(tile.x - 1, tile.y - 1, 3, 3);
    });
  }

  showMinimap(isVisible) {
    if (!this.minimap) return;
    this.minimap.setVisible(isVisible);
    this.mmTopBar.setVisible(isVisible);
    this.mmBottomBar.setVisible(isVisible);
    this.mmRightBar.setVisible(isVisible);
    this.mmLeftBar.setVisible(isVisible);
    this.map.setVisible(isVisible);
  }

  clearMinimap() {
    // There's only one map per level so we don't need a pool.
    if (this.minimap) {
      this.minimap.destroy();
      this.mmTopBar.destroy();
      this.mmBottomBar.destroy();
      this.mmLeftBar.destroy();
      this.mmRightBar.destroy();
      this.mmData.destroy();
    }
  }
}
