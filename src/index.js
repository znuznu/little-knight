import Phaser from 'phaser';

import GameScene from './scenes/GameScene.js';
import BootScene from './scenes/BootScene.js';
import HUDScene from './scenes/HUDScene.js';
import MenuScene from './scenes/MenuScene.js';
import EndScene from './scenes/EndScene.js';
import InstructionsScene from './scenes/InstructionsScene.js';

var config = {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    backgroundColor: '#1c1117',
    type: Phaser.AUTO,
    width: 800,
    height: 480,
    gameVersion: '1.0.0',
    parent: 'content',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
          debug: true
        }
    },
    scene: [
      BootScene,
      GameScene,
      HUDScene,
      MenuScene,
      InstructionsScene,
      EndScene
    ]
};

var game = new Phaser.Game(config);
