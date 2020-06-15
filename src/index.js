import Phaser from 'phaser';

import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import HUDScene from './scenes/HUDScene.js';
import MenuScene from './scenes/MenuScene.js';
import InstructionsScene from './scenes/InstructionsScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';
import MusicsScene from './scenes/MusicsScene.js';
import CreditsScene from './scenes/CreditsScene.js';

var config = {
    autoCenter: Phaser.Scale.NO_CENTER,
    backgroundColor: '#222222',
    type: Phaser.AUTO,
    width: 800,
    height: 480,
    gameVersion: '1.0.0',
    parent: 'content',
    pixelArt: true,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    },
    scene: [
      BootScene,
      GameScene,
      HUDScene,
      MenuScene,
      InstructionsScene,
      GameOverScene,
      VictoryScene,
      MusicsScene,
      CreditsScene
    ]
};

var game = new Phaser.Game(config);
