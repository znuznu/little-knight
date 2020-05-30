import State from '../../State.js';
import HUDEventsManager from '../../../events/HUDEventsManager.js';
import SmokeBoss from '../../../sprites/effects/SmokeBoss.js';

export default class DepressumDeadState extends State {
  enter(scene, dk, damage) {
    dk.setVisible(false);

    let smoke = new SmokeBoss({
      scene: scene,
      key: 'smoke-boss',
      x: dk.x,
      y: dk.y
    });

    dk.actionStateMachine.stop();
    scene.fireballsArcanicGroup.clear(true, true);
    scene.pursuitSwordGroup.clear(true, true);
    dk.destroy();

    scene.cameras.main.shake(1000, 0.03);

    smoke.on('animationcomplete', _ => {
      HUDEventsManager.emit('hide-boss-stats');
      scene.events.emit('replace-tiles', dk.areaGuarded, 'spike', 79);
    }, this);
  }
}