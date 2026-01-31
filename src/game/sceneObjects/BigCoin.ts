import { GameScene } from "../scenes/GameScene";
import { NewCoinSceneConfig } from "../scenes/NewCoinScene";
import { Coin } from "../state/GameState";
import { AbstractCoin } from "./AbstractCoin";

export interface BigCoinData {
  /** Textura de esta moneda en el mundo */
  texture: string;
  name: string;
  option1: Coin;
  option2: Coin;
  /** Monedas necesarias para saltarse la decisión de lanzar esta moneda */
  passCost: number;
}

export class BigCoin extends AbstractCoin {
  private coinData: BigCoinData;

  constructor(scene: Phaser.Scene, x: number, y: number, data: BigCoinData) {
    super(scene, x, y, data.texture, 30);
    this.coinData = data;
  }

  public handleCoinPickup(): void {
    this.scene.scene.pause();
    const config: NewCoinSceneConfig = {
      coinData: this.coinData,
      onCoinFlippedResult: (pass: boolean, isHead: boolean) => {
        const fatManager = (this.scene as GameScene).fatManager;
        // Aquí puedes manejar el resultado del lanzamiento de moneda
        if (pass) {
          // el jugador ha decidido pagar para evitar la moneda
          fatManager.adjustLocalCoins(-this.coinData.passCost);
        } else {
          // ha habido un resultado, lo registramos en el fat manager como local coin
          const selectedCoin = isHead
            ? this.coinData.option1
            : this.coinData.option2;
          fatManager.registerNewLocalCoin(selectedCoin);
        }
        // Reanudar la escena del juego después de manejar el resultado
        this.scene.scene.resume("GameScene");
        this.scene.scene.stop("NewCoinScene");
        this.destroy();
      },
    };
    this.scene.scene.launch("NewCoinScene", config);
  }
}
