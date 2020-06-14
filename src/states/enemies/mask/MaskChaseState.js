import State from '../../State.js';

export default class MaskChaseState extends State {
  enter(scene, enemy) {
    enemy.aggroIcon.setAlpha(1);

    scene.time.delayedCall(1000, _ => {
      enemy.aggroIcon.setAlpha(0);
    });

    this.execute(scene, enemy);
  }

  execute(scene, enemy) {
    if (enemy.x > enemy.target.x) {
      enemy.view = 'left';
    } else {
      enemy.view = 'right';
    }

    let ownTile = scene.map.worldToTileXY(
      enemy.body.center.x, enemy.body.center.y
    );

    let targetTile = scene.map.worldToTileXY(
      enemy.target.body.center.x, enemy.target.body.center.y
    );

    let distance = enemy.distanceBetween(enemy.target);

    if (distance > enemy.aggroRadius * 3) {
      enemy.actionStateMachine.transition('idle');
      return;
    } else if (distance > 80) {
      let targetTile = scene.map.getTileAtWorldXY(
        enemy.target.body.center.x,
        enemy.target.body.center.y,
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

      enemy.actionStateMachine.transition('teleport', randTile);
      return;
    }

    scene.physics.moveToObject(enemy, enemy.target, enemy.speed);
  }
}
