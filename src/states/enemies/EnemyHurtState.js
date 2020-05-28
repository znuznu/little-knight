import State from '../State.js';

export default class EnemyHurtState extends State {
  enter(scene, enemy) {
    const direction = new Phaser.Math.Vector2(
      enemy.x - scene.player.x,
      enemy.y - scene.player.y
    ).normalize().scale(200);

    enemy.body.setVelocity(direction.x, direction.y);

    enemy.setTint(0xb20000);
    scene.time.delayedCall(600, _ => {
      if (enemy.isDead()) {
        enemy.actionStateMachine.transition('dead');
      } else {
        enemy.clearTint(),
        enemy.actionStateMachine.transition('idle');
      }
    });
  }
}
