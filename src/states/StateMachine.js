/**
 * Heavily inspired by the Finite-State Machine implementation
 * of Michael Kelly. His (awesome) article can be found on his
 * blog: https://www.mkelly.me/blog/phaser-finite-state-machine/
 */

import State from './State.js';

export default class StateMachine {
  constructor(initialState, possibleStates, stateArgs=[]) {
    this.initialState = initialState;
    this.possibleStates = possibleStates;
    this.stateArgs = stateArgs;
    this.state = null;
    this.run = true;

    for (const state of Object.values(this.possibleStates)) {
      state.stateMachine = this;
    }
  }

  update() {
    if (this.run) {
      if (this.state === null) {
        this.state = this.initialState;
        this.possibleStates[this.state].enter(...this.stateArgs);
      }

      this.possibleStates[this.state].execute(...this.stateArgs);
    }
  }

  transition(newState, ...enterArgs) {
    if (this.run) {
      this.state = newState;
      this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs);
    }
  }

  stop() {
    this.run = false;
    this.state = null;
  }
}
