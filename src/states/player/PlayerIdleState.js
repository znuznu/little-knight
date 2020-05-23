import State from '../State.js';

export default class PlayerIdleState extends State {
  enter(scene, player) {
    player.resetDirection();
    player.body.setVelocity(0);
  }

  execute(scene, player) {
    let left = scene.keys.left.isDown;
    let right = scene.keys.right.isDown;
    let up = scene.keys.up.isDown;
    let down = scene.keys.down.isDown;
    let shift = scene.keys.shift.isDown;

    if (scene.input.mousePointer.primaryDown) {
      switch (player.getCurrentWeapon()) {
        case 'sword':
          player.actionStateMachine.transition('slash');
          break;
        case 'bow':
          player.actionStateMachine.transition('shoot');
          break;
        default:
          break;
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(shift)) {
      player.nextWeapon();
    }

    if (left || right || up || down) {
      player.actionStateMachine.transition('run');
      return;
    }
  }
}
