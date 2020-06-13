import State from '../../State.js';

export default class MageCastFireballState extends State {
  enter(scene, mage) {
    if (mage.x > mage.target.x) {
      mage.view = 'left';
    } else {
      mage.view = 'right';
    }

    let fireball = scene.fireballsSimpleGroup.get();

    if (fireball) {
      fireball.cast(mage.x, mage.y, mage.target.x, mage.target.y);
    }

    scene.time.delayedCall(mage.castLoadDuration, _ => {
      mage.actionStateMachine.transition('idle');
    });
  }
}
