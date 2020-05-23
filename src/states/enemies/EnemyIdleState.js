import State from '../State.js';

export default class EnemyIdleState extends State {
  enter(scene, enemy) {
    enemy.resetDirection();
    enemy.body.setVelocity(0);
  }

  execute(scene, enemy) {
    if (enemy.distanceBetween(enemy.target) < enemy.aggroRadius) {
      enemy.actionStateMachine.transition('chase');
    }
  }
}
