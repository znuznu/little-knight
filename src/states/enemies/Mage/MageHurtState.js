import State from '../../State.js';

export default class MageHurtState extends State {
  enter(scene, mage) {
    let randIndex = ~~(Math.random() * ~~(2)) + 1;
    scene.sound.playAudioSprite('sounds', 'hit_' + randIndex);
    const direction = new Phaser.Math.Vector2(
      mage.x - scene.player.x,
      mage.y - scene.player.y
    ).normalize().scale(mage.knockback);

    mage.body.setVelocity(direction.x, direction.y);

    mage.setTint(0xb20000);
    scene.time.delayedCall(600, _ => {
      if (mage.isDead()) {
        mage.actionStateMachine.transition('dead');
      } else {
        mage.clearTint(),
        mage.actionStateMachine.transition('cast');
      }
    });
  }
}
