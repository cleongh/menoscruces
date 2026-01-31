import { AbstractCoin } from "./AbstractCoin";

export class PickableCoin extends AbstractCoin {
  public coinData: { texture: string; value: number; stat: string };

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    value: number,
    stat: string,
  ) {
    super(scene, x, y, texture, 20);
    this.coinData = { texture, value, stat };

    // TODO: tunear cuerpo para que se sienta natural al chocar
    this.body.setCircle(this.width / 2);
  }

  public handleCoinPickup(): void {
    this.scene.events.emit("coin-collected", this.coinData);
    this.destroy();
  }
}
