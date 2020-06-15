/**
 * Things related to the player taking damage.
 * Like his sprite getting red or the camera shaking.
 *
 */

import State from '../State.js';
import HUDEventsManager from '../../events/HUDEventsManager.js';

export default class PlayerHurtState extends State {
  enter(scene, player, damage) {
    scene.sound.playAudioSprite('sounds', 'hit_3');
    player.hit(damage);
    player.setTint(0xb20000);
    scene.cameras.main.shake(500, 0.02);

    HUDEventsManager.emit('update-health', player.health);

    if (player.isDead()) {
      player.healthStateMachine.transition('dead');
    }

    scene.time.delayedCall(1000, _ => {
      player.healthStateMachine.transition('normal');
    });
  }
}
