import State from '../State.js';
import SmokeSmall from '../../sprites/effects/SmokeSmall.js';
import SmokeBig from '../../sprites/effects/SmokeBig.js';

export default class EnemyDeadState extends State {
  enter(scene, enemy) {
    let smoke;
    switch (enemy.animationState['dead']) {
      case 'smoke-small':
        smoke = new SmokeSmall({
          scene: scene,
          key: 'smoke-small',
          x: enemy.x,
          y: enemy.y
        });
        break;
      case 'smoke-big':
        smoke = new SmokeBig({
          scene: scene,
          key: 'smoke-big',
          x: enemy.x,
          y: enemy.y
        });
        break;
    }
    enemy.destroy();
  }
}
