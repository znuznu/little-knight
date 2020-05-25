import eventsManager from './EventsManager.js';

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
  }

  createEventsListener() {
    eventsManager.on('update-health', this.updateHealth, this);
    eventsManager.on('update-weapons', this.updateWeapons, this);
    eventsManager.on('update-keys', this.updateKeys, this);
    eventsManager.on('update-key-boss', this.updateKeyBoss, this);
  }

  createHealth() {
    this.health = this.add.group({
			classType: Phaser.GameObjects.Image
		});

    // I'm sure there's a better way, like using createMultiple().
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

  updateWeapons(weapons) {
    this.weapons.children.each((weapon, index) => {
      switch (weapons[index]) {
        case 'bow':
          weapon.setFrame('bow-and-arrow');
          break;
        case 'sword':
          weapon.setFrame('sword');
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
}
