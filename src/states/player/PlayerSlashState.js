/*
 * State of the player attacking with a sword.
 * Huge improvements possible here, too simple, need some maths.
 */

import State from '../State.js';
import PlayerSlash from '../../sprites/movesets/player/PlayerSlash.js';

export default class PlayerSlashState extends State {
  enter(scene, player) {
    player.body.setVelocity(0);
    let angle = Phaser.Math.Angle.Between(
      player.body.x,
      player.body.y,
      scene.crosshair.body.x,
      scene.crosshair.body.y
    );

    let angleToDirection = ang => {
      if (ang >= -1.96 && ang < -1.17) {
        return 'north';
      } else if (ang >= -1.17 && ang < -0.39) {
        return 'north-east';
      } else if (ang >= -2.74 && ang < -1.96) {
        return 'north-west';
      } else if (ang >= -0.39 && ang < 0.39) {
        return 'east';
      } else if (ang >= 0.39 && ang < 1.17) {
        return 'south-east';
      } else if (ang >= 1.17 && ang < 1.96) {
        return 'south';
      } else if (ang >= 1.96 && ang < 2.74) {
        return 'south-west';
      } else {
        return 'west';
      }
    };

    let directionToPosition = {
      'north': [player.body.center.x, player.body.center.y - 24],
      'south': [player.body.center.x, player.body.center.y + 24],
      'east': [player.body.center.x + 24, player.body.center.y],
      'west': [player.body.center.x - 24, player.body.center.y],
      'north-west': [player.body.center.x - 24, player.body.center.y - 24],
      'north-east': [player.body.center.x + 24, player.body.center.y - 24],
      'south-west': [player.body.center.x - 24, player.body.center.y + 24],
      'south-east': [player.body.center.x + 24, player.body.center.y + 24]
    };

    let direction = angleToDirection(angle);

    let position = [
      directionToPosition[direction][0],
      directionToPosition[direction][1]
    ];

    this.slash = new PlayerSlash({
      scene: scene,
      key: 'slash-effect',
      x: position[0],
      y: position[1]
    });

    let directionToAngle = {
      'north': -1.57,
      'south': 1.57,
      'east': 0,
      'west': -3.14,
      'north-west': -2.35,
      'north-east': -0.785,
      'south-west': 2.35,
      'south-east': 0.785
    };

    this.slash.rotation = directionToAngle[direction];

    scene.time.delayedCall(300, _ => {
      player.actionStateMachine.transition('idle');
    });
  }
}
