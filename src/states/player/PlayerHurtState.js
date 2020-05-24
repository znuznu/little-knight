import State from '../State.js';
import eventsManager from '../../scenes/EventsManager.js';

/* Things related to the player taking damage.
 * Like his sprite getting red or the camera shaking.
 */

export default class PlayerHurtState extends State {
  enter(scene, player, enemy) {
    player.hitBy(enemy.meleeDamage);
    player.setTint(0xb20000);
    scene.cameras.main.shake(500, 0.02);

    eventsManager.emit('update-health', player.health);

    scene.time.delayedCall(1000, _ => {
      if (player.isDead())
        player.healthStateMachine.transition('dead');
      else
        player.healthStateMachine.transition('normal');
    });
  }
}
