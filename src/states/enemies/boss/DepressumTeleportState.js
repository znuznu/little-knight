import State from '../../State.js';

export default class DepressumTeleportState extends State {
  enter(scene, dk) {
    scene.tweens.add({
      targets: dk,
      alpha: 0,
      ease: 'Cubic.easeIn',
      duration: 1000,
      repeat: 0,
      onComplete: _ => {
        dk.teleport();
        scene.tweens.add({
          targets: dk,
          alpha: 1,
          ease: 'Cubic.easeOut',
          duration: 1000,
          repeat: 0,
          onComplete: _ => {
            dk.actionStateMachine.transition('idle');
          }
        });
      }
    });
  }
}
