import State from '../State.js';
import eventsManager from '../../scenes/EventsManager.js';
import SmokeSmall from '../../sprites/effects/SmokeSmall.js';

export default class PlayerDeadState extends State {
  enter(scene, player) {
    player.setVisible(false);

    let smoke = new SmokeSmall({
      scene: scene,
      key: 'smoke-small',
      x: player.x,
      y: player.y
    });

    smoke.on('animationcomplete', _ => {
      scene.events.emit('player-death');
    }, this);
  }
}
