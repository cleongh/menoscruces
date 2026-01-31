import { BigCoin } from "../sceneObjects/BigCoin";
import { coinDefinitions } from "../sceneObjects/coinDefinitions";
import AbstractEnemy from "./AbstractEnemy";

export default class Boss extends AbstractEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      health: 500,
      speed: 80,
      attack: 0.15,
      distanceAttack: 25,
      sprite: "eleph",
    });

    this.setDisplaySize(50, 50);
    this.setOrigin(0.5, 0.5);
  }

  die(): void {
    const coin = new BigCoin(
      this.scene,
      this.x,
      this.y,
      coinDefinitions[0].availableCoins[0],
    );

    (this.scene as any).coins.add(coin, true);
    this.destroy();
  }
}
