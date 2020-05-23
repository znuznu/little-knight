import State from '../State.js';

export default class PlayerDashState extends State {
  enter(scene, player) {
    if (player.direction.up) {
      player.body.setVelocityY(-player.speed*2);
    } else if (player.direction.down) {
      player.body.setVelocityY(player.speed*2);
    }

    if (player.direction.left) {
      player.view = 'left';
      player.body.setVelocityX(-player.speed*2);
    } else if (player.direction.right) {
      player.view = 'right';
      player.body.setVelocityX(player.speed*2);
    }

    player.setAlpha(0.5);

    scene.time.delayedCall(300, _ => {
      player.setAlpha(1);
      player.actionStateMachine.transition('idle');
    });
  }
}
