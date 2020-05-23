import State from '../State.js';

export default class PlayerNormalState extends State {
  enter(scene, player) {
    player.clearTint();
  }
}
