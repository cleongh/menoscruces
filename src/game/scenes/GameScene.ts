import Player from "../player";
import { InventoryUI } from "../UI/InventoryUI";
import Merchant from "../merchant";
import { PickableCoin } from "../sceneObjects/PickableCoin";
import Boss from "../enemies/Boss";
import AbstractEnemy from "../enemies/AbstractEnemy";

export class GameScene extends Phaser.Scene {
  private player: Player;
  private merchant: Merchant;
  private enemies: Phaser.Physics.Arcade.Group;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private inventory: InventoryUI;
  private coins: Phaser.Physics.Arcade.Group;

  constructor() {
    super("GameScene");
  }

  create() {
    this.enemies = this.physics.add.group({
      classType: AbstractEnemy,
    });
    this.player = new Player(this, 0, 0, this.enemies);

    this.merchant = new Merchant(this, 0, 0);

    this.coins = this.physics.add.group({
      classType: PickableCoin,
    });

    // recoger moneda al tocarla
    this.physics.add.overlap(this.player, this.coins, (_, coin) => {
      const c = coin as PickableCoin;

      this.events.emit("coin-collected", c.coinData);

      c.destroy();
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.inventory = new InventoryUI(this, 50, 40);

    this.events.on("coin-collected", (coinData: any) => {
      this.inventory.addItem(coinData.texture, coinData.value, coinData.stat);
    });
  }

  spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const x = this.player.x + Math.cos(angle) * 500;
    const y = this.player.y + Math.sin(angle) * 500;

    const enemy = new Boss(this, x, y);
    this.enemies.add(enemy, true);
  }

  update() {
    this.player.update(this.cursors);

    this.enemies.getChildren().forEach((enemy: any) => {
      enemy.update(this.player);
      if(Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y) <= enemy.distanceAttack){
        console.log("Pero te quiero...");
        this.player.receiveDamage(enemy.attack);
      }
    });

    this.merchant.update();
  }
}
