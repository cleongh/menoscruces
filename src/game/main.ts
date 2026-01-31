import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { GameScene } from "./scenes/GameScene";
import { NewCoinScene } from "./scenes/NewCoinScene";
import { Credicts } from "./scenes/Credicts";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: "rgb(231, 184, 236)",
  scene: [Boot, Preloader, MainMenu, GameScene, GameOver, NewCoinScene, Credicts],
  physics: {
    default: "arcade",
    arcade: {
      debug: true,
    },
  },
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
