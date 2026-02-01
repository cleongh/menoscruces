import { BigCoin } from "../sceneObjects/BigCoin";
import { GameScene } from "../scenes/GameScene";
import AbstractEnemy from "./AbstractEnemy";
import { baseStats } from "../state/FatManager";

export default class Boss extends AbstractEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      health: baseStats.enemyDamageBase * 2,
      speed: baseStats.enemyHealthBase * 1.2,
      attack: baseStats.enemyDamageBase * 2,
      distanceAttack: baseStats.enemyRangedAttack,
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
      (this.scene as GameScene).fatManager.getRandomCoinFromCurrent(),
    );

    (this.scene as any).coins.add(coin, true);
    this.destroy();
  }
}
