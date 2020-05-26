/*
 * State of the player attacking with a bow.
 */

import State from '../State.js';
import PlayerArrow from '../../sprites/movesets/player/PlayerArrow.js';

export default class PlayerShootState extends State {
  enter(scene, player) {
    player.shotLoad = 0;

    let arrow = scene.playerArrows.get();
    if (arrow) {
      arrow.shoot();
    } else {
      player.actionStateMachine.transition('idle');
    }

    scene.time.delayedCall(100, _ => {
      player.actionStateMachine.transition('idle');
    });
  }
}
