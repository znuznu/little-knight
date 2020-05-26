/*
 * Dash state for the player.
 * The dash "shadows" are part of a pool.
 */

import State from '../State.js';

export default class PlayerDashState extends State {
  enter(scene, player) {
    let t = setInterval(_ => {
      let dashShadow = scene.dashShadowsGroup.get();
      if (dashShadow) {
        dashShadow.setX(player.x);
        dashShadow.setY(player.y);
        dashShadow.setFlipX(player.view === 'left');
        dashShadow.setAlpha(1);
        dashShadow.setVisible(true);
        dashShadow.setActive(true);

        let tw = scene.tweens.add({
          targets: dashShadow,
          alpha: 0,
          ease: 'Cubic.easeOut',
          duration: 300,
          repeat: 0,
          onComplete: _ => {
            dashShadow.setVisible(false);
            dashShadow.setActive(false);
          }
        });
      }
    }, 50);

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

    scene.time.delayedCall(player.dashDuration, _ => {
      clearInterval(t);
      player.actionStateMachine.transition('idle');
    });
  }
}
