import { NewCoinSceneConfig } from "../scenes/NewCoinScene";
import { AbstractCoin } from "./AbstractCoin";

interface BigCoinData {
  texture: string;
  option1: string; // TODO: placeholder, aquí hay que definir bien los bufos que da la moneda tocha
  option2: string;
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
      opcion1: this.coinData.option1,
      opcion2: this.coinData.option2,
      onCoinFlippedResult: (pass: boolean, isHead: boolean) => {
        // Aquí puedes manejar el resultado del lanzamiento de moneda
        console.log(
          `Moneda grande recogida. Resultado del lanzamiento: ${
            isHead ? "CARA" : "CRUZ"
          }`,
        );
        // Reanudar la escena del juego después de manejar el resultado
        this.scene.scene.resume("GameScene");
        this.scene.scene.stop("NewCoinScene");
        this.destroy();
      },
    };
    this.scene.scene.launch("NewCoinScene", config);
  }
}
