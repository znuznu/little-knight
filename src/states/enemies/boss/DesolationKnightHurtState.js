import State from '../../State.js';
import eventsManager from '../../../scenes/EventsManager.js';

export default class DesolationKnightHurtState extends State {
  enter(scene, dk, damage) {
    dk.hit(damage);
    dk.setTint(0xb20000);
    //eventsManager.emit('update-health', player.health);
    scene.time.delayedCall(1000, _ => {
      if (dk.isDead()) {
        dk.healthStateMachine.transition('dead');
      } else {
        dk.healthStateMachine.transition('normal');
      }
    });
  }
}
