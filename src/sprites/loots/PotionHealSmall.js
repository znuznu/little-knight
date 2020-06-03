import Loot from './Loot.js';

export default class PotionHealSmall extends Loot {
  constructor(scene) {
    super(scene, 0, 0, 'atlas', 'potion-red-small-0');
    this.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.name = 'potion-heal-small';
    this.play('potion-heal-small', true);
  }
}
