import State from '../../State.js';

export default class MaskTeleportState extends State {
  enter(scene, maskEnemy, tile) {
    maskEnemy.body.reset(maskEnemy.x, maskEnemy.y);

    scene.tweens.add({
      targets: maskEnemy,
      alpha: 0,
      ease: 'Cubic.easeIn',
      duration: 1000,
      repeat: 0,
      onComplete: _ => {
        maskEnemy.teleport(tile);
        scene.tweens.add({
          targets: maskEnemy,
          alpha: 1,
          ease: 'Cubic.easeOut',
          duration: 1000,
          repeat: 0,
          onComplete: _ => {
            if (!maskEnemy.isDead()) {
              maskEnemy.actionStateMachine.transition('chase');
              return;
            }
          }
        });
      }
    });
  }
}
