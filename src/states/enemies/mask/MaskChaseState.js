import State from '../../State.js';

export default class MaskChaseState extends State {
  enter(scene, maskEnemy) {
    maskEnemy.aggroIcon.setAlpha(1);

    scene.time.delayedCall(1000, _ => {
      maskEnemy.aggroIcon.setAlpha(0);
    });

    this.execute(scene, maskEnemy);
  }

  execute(scene, maskEnemy) {
    if (maskEnemy.x > maskEnemy.target.x) {
      maskEnemy.view = 'left';
    } else {
      maskEnemy.view = 'right';
    }

    let ownTile = scene.map.worldToTileXY(
      maskEnemy.body.center.x, maskEnemy.body.center.y
    );

    let targetTile = scene.map.worldToTileXY(
      maskEnemy.target.body.center.x, maskEnemy.target.body.center.y
    );

    let distance = maskEnemy.distanceBetween(maskEnemy.target);

    if (distance > maskEnemy.aggroRadius * 3) {
      maskEnemy.actionStateMachine.transition('idle');
      return;
    } else if (distance > 80) {
      let targetTile = scene.map.getTileAtWorldXY(
        maskEnemy.target.body.center.x,
        maskEnemy.target.body.center.y,
        true, undefined, 'walkable'
      );

      let tilesAroundTarget = [
        scene.map.getTileAt(targetTile.x + 1, targetTile.y, true, 'walkable'),
        scene.map.getTileAt(targetTile.x, targetTile.y + 1, true, 'walkable'),
        scene.map.getTileAt(targetTile.x - 1, targetTile.y, true, 'walkable'),
        scene.map.getTileAt(targetTile.x, targetTile.y - 1, true, 'walkable')
      ];

      let tilesFiltered = tilesAroundTarget.filter(t => {
        return t.index > -1;
      });

      let randIndex = ~~(Math.random() * ~~(tilesFiltered.length));
      let randTile = tilesFiltered[randIndex];

      if (randTile) {
        maskEnemy.actionStateMachine.transition('teleport', randTile);
        return;
      }
    }

    maskEnemy.chaseTarget();
  }
}
