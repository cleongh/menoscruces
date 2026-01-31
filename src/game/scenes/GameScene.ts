import Player from "../player";
import { InventoryUI } from "../UI/InventoryUI";
import Merchant from "../merchant";
import Boss from "../enemies/Boss";
import AbstractEnemy from "../enemies/AbstractEnemy";
import { AbstractCoin } from "../sceneObjects/AbstractCoin";

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
      classType: AbstractCoin,
    });

    // recoger moneda al tocarla
    this.physics.add.collider(this.player, this.coins, (_, coin) => {
      console.log("DAME DINERO");
      const c = coin as AbstractCoin;
      c.handleCoinPickup();
    });

    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(this.player, this.enemies, (p, e) => {
      console.log("Pero te quiero...");
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
      enemy.followPlayer(this.player);
    });

    this.merchant.update();
  }
}
