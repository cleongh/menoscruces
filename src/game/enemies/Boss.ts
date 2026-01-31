import { BigCoin } from "../sceneObjects/BigCoin";
import AbstractEnemy from "./AbstractEnemy";

export default class Boss extends AbstractEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      health: 500,
      speed: 80,
      attack: 0.15,
      sprite: "boss",
    });

    this.setDisplaySize(50, 50);
    this.setOrigin(0.5, 0.5);
  }

  die(): void {
    const coin = new BigCoin(this.scene, this.x, this.y, {
      texture: "big-coin",
      option1: "love",
      option2: "toni",
    });

    (this.scene as any).coins.add(coin, true);
    this.destroy();
  }
}
