import State from '../State.js';

export default class EnemyIdleState extends State {
  enter(scene, enemy) {
    enemy.tileChased = undefined;
    enemy.resetDirection();
    enemy.body.reset(enemy.x, enemy.y);
  }

  execute(scene, enemy) {
    if (enemy.distanceBetween(enemy.target) < enemy.aggroRadius) {
      enemy.actionStateMachine.transition('chase');
    }
  }
}
