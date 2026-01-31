import Player from "../player";
import { InventoryUI } from "../UI/InventoryUI";
import Merchant from "../merchant";
import Boss from "../enemies/Boss";
import AbstractEnemy from "../enemies/AbstractEnemy";
import { AbstractCoin } from "../sceneObjects/AbstractCoin";
import { Projectile, ProjectileEnemy } from "../enemies/ProjectileEnemy";
import { baseStats, FatManager } from "../state/FatManager";

export class GameScene extends Phaser.Scene {
  private player: Player;
  private merchant: Merchant;
  private enemies: Phaser.Physics.Arcade.Group;
  private projectiles: Phaser.Physics.Arcade.Group;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private inventory: InventoryUI;
  private coins: Phaser.Physics.Arcade.Group;
  private width: number = 2000;
  private height: number = 2000;

  public fatManager: FatManager;

  constructor() {
    super("GameScene");
    this.fatManager = new FatManager(this, baseStats);
  }

  create() {
    this.enemies = this.physics.add.group({
      classType: AbstractEnemy,
    });

    this.projectiles = this.physics.add.group({
      classType: Projectile,
    });

    this.player = new Player(this, 0, 0, this.enemies);

    this.merchant = new Merchant(this, 0, 0);

    this.coins = this.physics.add.group({
      classType: AbstractCoin,
    });

    // recoger moneda al tocarla
    this.physics.add.collider(this.player, this.coins, (_, coin) => {
      const c = coin as AbstractCoin;
      c.handleCoinPickup();
    });

    this.physics.add.overlap(
      this.player,
      this.projectiles,
      (player, projectile) => {
        const pr = projectile as Projectile;
        const pl = player as Player;

        pl.receiveDamage(pr.damage);
        pr.destroy();
      },
    );

    this.time.addEvent({
      delay: 1000,
      callback: this.spawnEnemy,
      callbackScope: this,
      loop: true,
    });

    this.cursors = this.input.keyboard!.createCursorKeys();

    this.inventory = new InventoryUI(this, 50, 40);

    this.physics.world.setBounds(0, 0, this.width, this.height);
    this.cameras.main.setBounds(0, 0, this.width, this.height);
    this.cameras.main.startFollow(this.player);
  }

  spawnEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const x = this.player.x + Math.cos(angle) * 500;
    const y = this.player.y + Math.sin(angle) * 500;

    if (Phaser.Math.Between(0, 1) === 0) {
      const enemy = new Boss(this, x, y);
      this.enemies.add(enemy, true);
    } else {
      const enemy = new ProjectileEnemy(this, x, y);
      this.enemies.add(enemy, true);
    }
  }

  update() {
    this.player.update(this.cursors);

    this.enemies.getChildren().forEach((enemy: any) => {
      enemy.update(this.player);
      if (
        Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          enemy.x,
          enemy.y,
        ) <= enemy.distanceAttack
      ) {
        console.log("Pero te quiero...");
        enemy.physicalAttack(this.player);
      }
    });

    this.merchant.update();
  }
}
