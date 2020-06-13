import State from '../../../State.js';
import SmokeSmall from '../../../../sprites/effects/SmokeSmall.js';

export default class LizardDeadState extends State {
  enter(scene, lizard) {
    let smoke;

    let smokeSmall = scene.smokeSmallGroup.get();
    if (smokeSmall) {
      smokeSmall.use(lizard.x, lizard.y);
    }

    lizard.loot();

    if (lizard.boomerang)
      lizard.boomerang.liberate();
      
    lizard.destroy();
  }
}
