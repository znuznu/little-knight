import State from '../../State.js';
import eventsManager from '../../../scenes/EventsManager.js';

export default class DesolationKnightNormalState extends State {
  enter(scene, dk) {
    dk.clearTint();
  }
}
