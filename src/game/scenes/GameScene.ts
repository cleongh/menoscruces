import Enemy from "../enemy";
import Player from "../player";
import { PickableCoin } from "../sceneObjects/coin";
import { InventoryUI } from "../UI/InventoryUI";

export class GameScene extends Phaser.Scene {
  private player: Player;
  private enemies: Phaser.Physics.Arcade.Group;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private inventory: InventoryUI;
  private coins: Phaser.Physics.Arcade.Group;

  constructor() {
    super("GameScene");
  }

  create() {
    this.player = new Player(this, 0, 0);
    this.enemies = this.physics.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });

    this.coins = this.physics.add.group({
      classType: PickableCoin,
      runChildUpdate: true,
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

    this.physics.add.overlap(this.player, this.enemies, (p, e) => {
      console.log("Pero te quiero...");
      const coin = new PickableCoin(
        this,
        (e as Enemy).x,
        (e as Enemy).y,
        "coin",
        10,
        "love",
      );
      this.coins.add(coin, true);
      e.destroy();
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

    const enemy = new Enemy(this, x, y);
    this.enemies.add(enemy, true);
  }

  update() {
    this.player.update(this.cursors);

    this.enemies.getChildren().forEach((enemy: any) => {
      enemy.followPlayer(this.player);
    });
  }
}
