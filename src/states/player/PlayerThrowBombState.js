/*
 * State of the player throwing bomb.
 * The distance of bomb is related to the player velocity.
 */

import State from '../State.js';
import PlayerBomb from '../../sprites/movesets/player/PlayerBomb.js';

export default class PlayerThrowBombState extends State {
  enter(scene, player) {
    let bomb = scene.playerBombsGroup.get();
    if (bomb) {
      bomb.throw(player.x, player.y);
    } else {
      player.actionStateMachine.transition('idle');
    }

    scene.time.delayedCall(100, _ => {
      player.actionStateMachine.transition('idle');
    });
  }
}
