import State from '../../State.js';

export default class DesolationKnightIdleState extends State {
  enter(scene, dk) {
    if (dk.hasSword) {
      dk.throwPursuitSword();
    }

    if (dk.x > dk.target.x) {
      dk.view = 'left';
    } else {
      dk.view = 'right';
    }

    if (dk.distanceBetween(dk.target) <= 200) {
      dk.actionStateMachine.transition('teleport');
    } else {
      dk.actionStateMachine.transition('cast');
    }

    // Death first time -> phase 2
  }
}
