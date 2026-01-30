import Player from "./player";

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  private health : number;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "logo");
    this.health = 100;
  }

  followPlayer(player: Player) {
    this.scene.physics.moveToObject(this, player, 100);
  }

  quitHealth(damage: number){
    this.health -= damage;

    if(this.health <= 0){
      this.destroy();
    }
  }
}
