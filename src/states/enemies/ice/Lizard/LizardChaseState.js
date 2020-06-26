import State from '../../../State.js';

export default class LizardChaseState extends State {
  enter(scene, lizard) {
    lizard.aggroIcon.setAlpha(1);

    scene.time.delayedCall(1000, _ => {
      lizard.aggroIcon.setAlpha(0);
    });

    this.execute(scene, lizard);
  }

  execute(scene, lizard) {
    let ownTile = scene.map.worldToTileXY(
      lizard.body.center.x, lizard.body.center.y
    );

    let targetTile = scene.map.worldToTileXY(
      lizard.target.body.center.x, lizard.target.body.center.y
    );

    let distance = lizard.distanceBetween(lizard.target);

    // Avoid too much recursion.
    let totalFree = scene.boomerangsGroup.getTotalFree() > 0;

    if (distance > lizard.aggroRadius * 3) {
      lizard.actionStateMachine.transition('idle');
      return;
    } else if (distance > 128 && lizard.hasBoomerang && totalFree) {
      lizard.actionStateMachine.transition('boomerang');
      return;
    }

    if (lizard.x > lizard.target.x) {
      lizard.view = 'left';
    } else {
      lizard.view = 'right';
    }

    lizard.chaseTarget();
  }
}
