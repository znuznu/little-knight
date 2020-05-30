import State from '../../State.js';
import HUDEventsManager from '../../../events/HUDEventsManager.js';

export default class DepressumHurtState extends State {
  enter(scene, dk, damage) {
    dk.hit(damage);
    dk.setTint(0xb20000);
    HUDEventsManager.emit('update-boss-health', dk.maximumHealth, dk.health);
    scene.time.delayedCall(1000, _ => {
      if (dk.isDead()) {
        dk.healthStateMachine.transition('dead');
      } else {
        dk.healthStateMachine.transition('normal');
      }
    });
  }
}
