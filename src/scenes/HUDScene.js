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
    this.createBossName();
    this.createBossHealth();
    this.hideBossStats();
  }

  createEventsListener() {
    HUDEventsManager.on('update-health', this.updateHealth, this);
    HUDEventsManager.on('update-weapons', this.updateWeapons, this);
    HUDEventsManager.on('update-keys', this.updateKeys, this);
    HUDEventsManager.on('update-key-boss', this.updateKeyBoss, this);
    HUDEventsManager.on('update-boss-health', this.updateBossHealth, this);
    HUDEventsManager.on('update-boss-name', this.updateBossName, this);
    HUDEventsManager.on('show-boss-stats', this.showBossStats, this);
    HUDEventsManager.on('hide-boss-stats', this.hideBossStats, this);
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

    this.weapons = this.add.group();
    this.weapons.createMultiple({
      key: 'atlas',
      frame: 'items-container',
      setXY: {
        x: 32,
        y: 74,
        stepY: 42
      },
      quantity: 2
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
    this.keyBoss = this.add.sprite(64, 74, 'atlas', 'key-boss');
    this.keyBoss.setVisible(false);
  }

  createBossName() {
    this.bossName = this.add.text(
      128,
      384,
      'Default',
      { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' }
    ).setOrigin(0, 0);
  }

  createBossHealth() {
    this.maximumHealthBar = this.add.rectangle(
      128, 416, 544, 32, 0x222222
    ).setOrigin(0, 0);

    this.borderTop = this.add.rectangle(
      this.maximumHealthBar.x,
      this.maximumHealthBar.y - 2,
      this.maximumHealthBar.width, 2, 0xffffff
    ).setOrigin(0, 0);

    this.borderDown = this.add.rectangle(
      this.maximumHealthBar.x,
      this.maximumHealthBar.y + this.maximumHealthBar.height,
      this.maximumHealthBar.width, 2, 0xffffff
    ).setOrigin(0, 0);

    this.borderRight = this.add.rectangle(
      this.maximumHealthBar.x - 2 ,
      this.maximumHealthBar.y,
      2, this.maximumHealthBar.height, 0xffffff
    ).setOrigin(0, 0);

    this.borderLeft = this.add.rectangle(
      this.maximumHealthBar.x + this.maximumHealthBar.width,
      this.maximumHealthBar.y,
      2, this.maximumHealthBar.height, 0xffffff
    ).setOrigin(0, 0);

    this.currentHealthBar = this.add.rectangle(
      this.maximumHealthBar.x + 2,
      this.maximumHealthBar.y + 2,
      0, this.maximumHealthBar.height - 4, 0xa40000
    ).setOrigin(0, 0);
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
    this.currentHealthBar.setSize(
      widthPercentage - 4,
      this.maximumHealthBar.height - 4
    );
  }

  showBossStats() {
    this.maximumHealthBar.setVisible(true);
    this.currentHealthBar.setVisible(true);
    this.borderTop.setVisible(true);
    this.borderDown.setVisible(true);
    this.borderRight.setVisible(true);
    this.borderLeft.setVisible(true);
    this.bossName.setVisible(true);
  }

  hideBossStats() {
    this.maximumHealthBar.setVisible(false);
    this.currentHealthBar.setVisible(false);
    this.borderTop.setVisible(false);
    this.borderDown.setVisible(false);
    this.borderRight.setVisible(false);
    this.borderLeft.setVisible(false);
    this.bossName.setVisible(false);
  }
}
