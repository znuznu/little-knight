import State from '../State.js';

export default class EnemyChaseState extends State {
  enter(scene, enemy) {
    this.execute(scene, enemy);
  }

  execute(scene, enemy) {
    let ownTile = scene.map.worldToTileXY(enemy.body.center.x, enemy.body.center.y);
    let targetTile = scene.map.worldToTileXY(enemy.target.body.center.x, enemy.target.body.center.y);

    if (enemy.distanceBetween(enemy.target) > enemy.aggroRadius) {
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
