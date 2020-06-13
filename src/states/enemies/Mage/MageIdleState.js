import State from '../../State.js';

export default class MageIdleState extends State {
  enter(scene, mage) {}

  execute(scene, mage) {
    if (mage.distanceBetween(mage.target) < mage.aggroRadius) {
      mage.actionStateMachine.transition('cast');
    }
  }
}
