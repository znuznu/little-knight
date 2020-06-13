import State from '../../State.js';
import FireballArcanic from '../../../sprites/movesets/enemies/FireballArcanic.js';

export default class DepressumCastFireballsState extends State {
  enter(scene, dk) {
    let x = dk.x;
    let y = dk.y;

    // Fireballs spawns in 16 directions around the boss.
    let positions = [
      {x: x, y: -y},
      {x: -x, y: y},
      {x: x, y: y},
      {x: x, y: y + 128 },
      {x: x + 128, y: y - 128 },
      {x: x + 128, y: y - 64 },
      {x: x + 64, y: y - 128 },
      {x: x - 128, y: y + 128 },
      {x: x - 64, y: y + 128 },
      {x: x - 128, y: y + 64 },
      {x: x + 128, y: y + 128 },
      {x: x + 128, y: y + 64 },
      {x: x + 64, y: y + 128 },
      {x: x - 128, y: y - 128},
      {x: x - 64, y: y - 128},
      {x: x - 128, y: y - 64 }
    ];

    positions.forEach(p => {
      let fireballArcanic = scene.fireballsArcanicGroup.get();
      if (fireballArcanic) {
        scene.cameras.main.shake(1000, 0.01);
        fireballArcanic.cast(dk.x, dk.y, p.x, p.y);
      }
    });

    // 2 seconds then go back to idle, thus the
    // player can hit him if he's fast enough.
    scene.time.delayedCall(2000, _ => {
      dk.actionStateMachine.transition('idle');
    });
  }
}
