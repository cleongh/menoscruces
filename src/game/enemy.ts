import Player from "./player";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "logo");
  }

  followPlayer(player: Player) {
    this.scene.physics.moveToObject(this, player, 100);
  }
}
