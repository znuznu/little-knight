import State from '../State.js';

export default class PlayerRunState extends State {
  enter(scene, player) {
    this.execute(scene, player);
  }

  execute(scene, player) {
    let left = scene.keys.left.isDown;
    let right = scene.keys.right.isDown;
    let up = scene.keys.up.isDown;
    let down = scene.keys.down.isDown;
    let space = Phaser.Input.Keyboard.JustDown(scene.keys.space);

    player.body.setVelocity(0);
    player.resetDirection();

    if (!(left || right || up || down)) {
      player.actionStateMachine.transition('idle');
      return;
    }

    if (left) {
      player.direction.left = true;
    } else if (right) {
      player.direction.right = true;
    }

    if (up) {
      player.direction.up = true;
    } else if (down) {
      player.direction.down = true;
    }

    if (space) {
      player.actionStateMachine.transition('dash');
      return;
    }

    if (left) {
      player.body.setVelocityX(-player.speed);
    } else if (right) {
      player.body.setVelocityX(player.speed);
    }

    if (up) {
      player.body.setVelocityY(-player.speed);
    } else if (down) {
      player.body.setVelocityY(player.speed);
    }
  }
}
