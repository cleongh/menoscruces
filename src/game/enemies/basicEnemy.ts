import AbstractEnemy from "./AbstractEnemy";

const possibleSprites = ["cloud", "fatbat", "grr"];

export default class BasicEnemy extends AbstractEnemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      health: 500,
      speed: 80,
      attack: 0.15,
      distanceAttack: 25,
      sprite:
        possibleSprites[Math.floor(Math.random() * possibleSprites.length)],
    });

    this.setDisplaySize(50, 50);
    this.setOrigin(0.5, 0.5);
  }
}
