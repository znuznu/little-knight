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
    
    if (Phaser.Input.Keyboard.JustDown(shift)) {
      player.nextWeapon();
    }

    if (left || right || up || down) {
      player.actionStateMachine.transition('run');
      return;
    }
  }
}
