/*
 * Music scene.
 *
 * Provides functions in order to handle the music.
 * Only one music is played at the same time.
 *
 */

import MusicsEventsManager from '../events/MusicsEventsManager.js';

export default class MusicsScene extends Phaser.Scene {
  constructor() {
    super('musicsScene');
  }

  create() {
    this.createEventsListener();
    this.sound.playAudioSprite('musics', 'menu');
    this.currentMusic = 'Menu';
  }

  createEventsListener() {
    MusicsEventsManager.on('play-music', this.playMusic, this);
  }

  playMusic(key) {
    if (this.currentMusic === key) return;

    this.currentMusic = key;
    this.sound.stopAll();

    switch (key) {
      case 'Menu':
        this.sound.playAudioSprite('musics', 'menu', {loop: true});
        break;
      case 'GameOver':
      this.sound.playAudioSprite('musics', 'gameover');
        break;
      case 'Victory':
        this.sound.playAudioSprite('musics', 'victory');
        break;
      case 'Level-1':
        this.sound.playAudioSprite('musics', 'level-1', {loop: true});
        break;
      case 'DepressumIntro':
        this.sound.playAudioSprite('musics', 'depressum-intro', {loop: true});
        break;
      case 'DepressumLoop':
        this.sound.playAudioSprite('musics', 'depressum-loop', {loop: true});
        break;
      case 'DepressumEnding':
        this.sound.playAudioSprite('musics', 'depressum-ending', {loop: true});
        break;
    }
  }
}
