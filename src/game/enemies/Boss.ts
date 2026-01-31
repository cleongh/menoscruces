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
  }
}
