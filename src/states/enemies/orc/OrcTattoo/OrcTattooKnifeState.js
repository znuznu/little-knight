import State from '../../../State.js';

export default class OrcTattoKnifeState extends State {
  enter(scene, orc) {
    orc.body.reset(orc.x, orc.y);
    orc.lastKnivesThrown = scene.time.now;

    if (orc.x > orc.target.x) {
      orc.view = 'left';
    } else {
      orc.view = 'right';
    }

    let knife = scene.knivesGroup.get();

    if (knife) {
      knife.throw(orc.x, orc.y, orc.target.x, orc.target.y);
    }

    orc.actionStateMachine.transition('chase');
  }
}
