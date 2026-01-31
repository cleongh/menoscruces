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
    this.scene.scene.launch("NewCoinScene", {
      config: {},
      callback: () => {
        this.destroy();
      },
    });
  }
}
