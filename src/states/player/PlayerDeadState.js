import State from '../State.js';

export default class PlayerDeadState extends State {
  enter(scene, player) {
    player.clearTint();
    player.body.checkCollision.none = true;
    player.actionStateMachine.stop();
    player.play('smoke-small', true);
    player.on('animationcomplete', _ => {
      player.setVisible(false);
      scene.time.addEvent({
        delay: 1000,
        repeat: 0,
        callbackScope: this,
        callback: _ => {
          scene.events.emit('player-death');
        }
      });
    }, this);
  }
}
