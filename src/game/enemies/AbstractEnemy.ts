import Player from "../player";
import { PickableCoin } from "../sceneObjects/PickableCoin";

interface EnemyData {
  health: number;
  speed: number;
  attack: number;
  distanceAttack: number;
  sprite: string;
}

export default abstract class AbstractEnemy
  extends Phaser.Physics.Arcade.Sprite
{
  protected health: number;
  protected speed: number;
  protected attack: number;
  protected distanceAttack: number;

  private canMove: boolean;
  private stunTime: number;

  private cooldownDamage: number = 500;
  private canRecieveDamage:boolean;

  constructor(scene: Phaser.Scene, x: number, y: number, data: EnemyData) {
    super(scene, x, y, data.sprite);
    this.health = data.health;
    this.speed = data.speed;
    this.attack = data.attack;
    this.distanceAttack = data.distanceAttack;

    this.canMove = true;
    this.stunTime = 200;

    this.canRecieveDamage = true;
  }

  update(player: Player){
    if(this.canMove){
      this.followPlayer(player);
    }
    else{
      this.body!.stop();
    }
  }

  followPlayer(player: Player) {
    this.scene.physics.moveToObject(this, player, this.speed);
  }

  quitHealth(damage: number) {
    if(!this.canRecieveDamage)
      return;

    this.canRecieveDamage = false;
    this.scene.time.addEvent({
      delay: this.cooldownDamage,
      callback: ()=>{this.canRecieveDamage = true;},
      callbackScope: this,
    })

    this.health -= damage;

    this.canMove = false;
    this.scene.time.addEvent({
      delay: this.stunTime,
      callback: ()=>{this.canMove = true;},
      callbackScope: this,
    });

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
