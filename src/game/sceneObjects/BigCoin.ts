import { GameScene } from "../scenes/GameScene";
import { NewCoinSceneConfig } from "../scenes/NewCoinScene";
import { Coin } from "../state/gameState";
import { AbstractCoin } from "./AbstractCoin";

export interface BigCoinData {
  /** Textura de esta moneda en el mundo */
  texture: string;
  name: string;
  // Forzamos que la moneda de la opción 1 sea de cara 'head'
  option1: Coin & { face: "head" };
  // Forzamos que la moneda de la opción 2 sea de cara 'tail'
  option2: Coin & { face: "tail" };
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
      localCoins: (this.scene as GameScene).fatManager.getTransformedState()
        .localCoins,
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

        if(fatManager.getTransformedState().currentHealth <= 0){
          this.scene.scene.start("GameOver");
          this.scene.scene.stop("NewCoinScene");
          return;
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
