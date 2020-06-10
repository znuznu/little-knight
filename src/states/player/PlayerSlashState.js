/*
 * State of the player attacking with a sword.
 * Huge improvements possible here, too simple, need some maths.
 */

import State from '../State.js';

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
    let position = {
      x: directionToPosition[direction][0],
      y: directionToPosition[direction][1]
    };

    let slash = scene.playerSlashsGroup.get();
    if (slash) {
      slash.use(position.x, position.y, direction);
    }

    let randIndex = ~~(Math.random() * ~~(3)) + 1;
    scene.sound.playAudioSprite('sounds', 'swing_' + randIndex);

    scene.time.delayedCall(slash.recovery, _ => {
      player.actionStateMachine.transition('idle');
    });
  }
}
