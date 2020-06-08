import State from '../State.js';

export default class PlayerDeadState extends State {
  enter(scene, player) {
    scene.cameras.main.stopFollow();
    scene.crosshair.setVisible(false);
    
    player.clearTint();
    player.actionStateMachine.stop();
    player.healthStateMachine.stop();
    player.body.setImmovable(true);

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
