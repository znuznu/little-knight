import State from '../../../State.js';

export default class LizardBoomerangState extends State {
  enter(scene, lizard) {
    lizard.throwBoomerang();
    lizard.actionStateMachine.transition('chase');
  }
}
