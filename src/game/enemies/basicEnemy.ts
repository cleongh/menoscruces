import AbstractEnemy from "./AbstractEnemy";
import { baseStats } from "../state/FatManager";

const possibleSprites = ["cloud", "fatbat", "grr"];

export default class BasicEnemy extends AbstractEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      health: baseStats.enemyHealthBase,
      speed: baseStats.enemySpeedBase,
      attack: baseStats.enemyDamageBase,
      distanceAttack: baseStats.enemyDistanceAttack,
      sprite:
        possibleSprites[Math.floor(Math.random() * possibleSprites.length)],
    });

    this.setDisplaySize(50, 50);
    this.setOrigin(0.5, 0.5);
  }
}
