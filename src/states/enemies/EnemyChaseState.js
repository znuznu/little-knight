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

    enemy.chaseTarget();
  }
}
