import State from '../../State.js';
import FireballSimple from '../../../sprites/movesets/enemies/FireballSimple.js';

export default class MageCastFireballState extends State {
  enter(scene, mage) {
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
