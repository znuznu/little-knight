import State from '../../State.js';
import HUDEventsManager from '../../../events/HUDEventsManager.js';
import MusicsEventsManager from '../../../events/MusicsEventsManager.js';

export default class DepressumWaitState extends State {
  enter(scene, dk) {
    dk.view = 'left';
  }

  execute(scene, dk) {
    if (dk.distanceBetween(dk.target) <= 320) {
      MusicsEventsManager.emit('play-music', 'DepressumLoop');
      HUDEventsManager.emit('show-boss-stats', true);
      HUDEventsManager.emit(
        'update-boss-name',
        'Depressum, relentless knight of Desolation'
      );
      HUDEventsManager.emit('update-boss-health', dk.maximumHealth, dk.health);
      dk.actionStateMachine.transition('idle');
    }
  }
}
