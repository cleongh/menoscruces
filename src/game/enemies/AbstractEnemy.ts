import Player from "../player";
import { PickableCoin } from "../sceneObjects/PickableCoin";

interface EnemyData {
  health: number;
  speed: number;
  attack: number;
  sprite: string;
}

export default abstract class AbstractEnemy
  extends Phaser.Physics.Arcade.Sprite
{
  private health: number;
  private speed: number;
  private attack: number;

  constructor(scene: Phaser.Scene, x: number, y: number, data: EnemyData) {
    super(scene, x, y, data.sprite);
    this.health = data.health;
    this.speed = data.speed;
    this.attack = data.attack;
  }

  followPlayer(player: Player) {
    this.scene.physics.moveToObject(this, player, this.speed);
  }

  quitHealth(damage: number) {
    this.health -= damage;

    if (this.health <= 0) {
      this.die();
    }
  }

  physicalAttack(player: Player) {
    player.receiveDamage(this.attack);
  }

  die() {
    const coin = new PickableCoin(
      this.scene,
      this.x,
      this.y,
      "coin",
      10,
      "love",
    );
    (this.scene as any).coins.add(coin, true);
    this.destroy();
  }
}
