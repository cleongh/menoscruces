import { Boot } from "./scenes/Boot";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import { AUTO, Game } from "phaser";
import { Preloader } from "./scenes/Preloader";
import { GameScene } from "./scenes/GameScene";
import { NewCoinScene } from "./scenes/NewCoinScene";
import { Credits } from "./scenes/Credits";
import { Lore } from "./scenes/Lore";
import { basicColors } from "./UI/colors";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: AUTO,
  width: 1024,
  height: 768,
  parent: "game-container",
  backgroundColor: basicColors.bone,
  scene: [Boot, Preloader, MainMenu, Lore, GameScene, GameOver, NewCoinScene, Credits],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
};

export default StartGame;
