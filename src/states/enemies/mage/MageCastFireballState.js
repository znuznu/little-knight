import State from '../../State.js';
import FireballSimple from '../../../sprites/movesets/enemies/FireballSimple.js';

export default class MageCastFireballState extends State {
  enter(scene, mage) {
    if (mage.x > mage.target.x) {
      mage.view = 'left';
    } else {
      mage.view = 'right';
    }

    let fireball = scene.fireballsSimpleGroup.get();

    if (fireball) {
      fireball.setX(mage.x);
      fireball.setY(mage.y);
      fireball.cast();
    }

    scene.time.delayedCall(mage.castLoadDuration, _ => {
      mage.actionStateMachine.transition('idle');
    });
  }
}
