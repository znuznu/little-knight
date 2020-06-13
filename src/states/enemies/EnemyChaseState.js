import State from '../State.js';

export default class EnemyChaseState extends State {
  enter(scene, enemy) {
    enemy.aggroIcon.setAlpha(1);

    scene.time.delayedCall(1000, _ => {
      enemy.aggroIcon.setAlpha(0);
    });

    this.execute(scene, enemy);
  }

  execute(scene, enemy) {
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
    }

    if (enemy.x > enemy.target.x) {
      enemy.view = 'left';
    } else {
      enemy.view = 'right';
    }

    scene.physics.moveToObject(enemy, enemy.target, enemy.speed);
  }
}
