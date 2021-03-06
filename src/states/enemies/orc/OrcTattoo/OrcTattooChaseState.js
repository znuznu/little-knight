import State from '../../../State.js';

export default class OrcTattooChaseState extends State {
  enter(scene, orc) {
    orc.aggroIcon.setAlpha(1);

    scene.time.delayedCall(1000, _ => {
      orc.aggroIcon.setAlpha(0);
    });

    this.execute(scene, orc);
  }

  execute(scene, orc) {
    let ownTile = scene.map.worldToTileXY(
      orc.body.center.x, orc.body.center.y
    );

    let targetTile = scene.map.worldToTileXY(
      orc.target.body.center.x, orc.target.body.center.y
    );

    let distance = orc.distanceBetween(orc.target);
    let ellapsedTime = scene.time.now - orc.lastKnivesThrown > 1000;

    if (distance > orc.aggroRadius * 3) {
      orc.actionStateMachine.transition('idle');
      return;
    } else if (distance > 64 && ellapsedTime) {
      orc.actionStateMachine.transition('knife');
      return;
    }

    if (orc.x > orc.target.x) {
      orc.view = 'left';
    } else {
      orc.view = 'right';
    }

    orc.chaseTarget();
  }
}
