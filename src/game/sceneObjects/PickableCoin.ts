import { GameScene } from "../scenes/GameScene";
import { AbstractCoin } from "./AbstractCoin";

export class PickableCoin extends AbstractCoin {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture, 20);

    // TODO: tunear cuerpo para que se sienta natural al chocar
    this.body.setCircle(this.width / 2);
  }

  public handleCoinPickup(): void {
    (this.scene as GameScene).fatManager.pickCoin();
    this.destroy();
  }
}
